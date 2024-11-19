import { userStore } from "../../../entities/user/model/store.js";
import { eventBus } from "../../../shared/lib/index.js";
import { validate, VALIDATION_RULES } from "../../../shared/lib/index.js";
import template from './editUser.hbs';
import './editUser.scss';

export class EditUserView {
  parent;
  userID;

  constructor(parent, userID) {
    this.parent = parent ? parent : document.querySelector("#root");
    this.userID = userID;
  }

  async render() {
    const user = userStore.storage.user;

    const editUserElement = document.createElement("div");
    editUserElement.classList.add("edit_user");
    editUserElement.innerHTML = template({ user });
    this.parent.appendChild(editUserElement);

    this.bindEvents();
    this.onEvents();
  }

  onEvents() {
    eventBus.on("updateUserSuccess", this.handleSuccess);
    eventBus.on("updateUserError", this.handleError);
  }

  offEvents() {
    eventBus.off("updateUserSuccess", this.handleSuccess);
    eventBus.off("updateUserError", this.handleError);
  }

  destructor() {
    this.offEvents();
    const form = document.querySelector("#edit-user-form");
    if (form) {
      form.removeEventListener("submit", this.handleSubmit);
    }
  }

  bindEvents() {
    const form = document.querySelector("#edit-user-form");
    if (form) {
      form.addEventListener("submit", this.handleSubmit.bind(this));
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;

    let validationErrors = {};

    const usernameError = validate(username, VALIDATION_RULES.username);
    if (usernameError) {
      validationErrors.username = usernameError;
    }

    const emailError = validate(email, VALIDATION_RULES.email);
    if (emailError) {
      validationErrors.email = emailError;
    }

    if (Object.keys(validationErrors).length > 0) {
      this.handleError(validationErrors);
      return;
    }

    const user = userStore.storage.user;
    const updatedUser = { id: user.id, username, email };
    await userStore.updateUser(updatedUser);
  }

  handleSuccess() {
    const user = userStore.storage.user;
    eventBus.emit("navigate", `/profiles/${user.username}`);
  }

  handleError(error) {
    document.querySelector("#edit-user__username-error").textContent = "";
    document.querySelector("#edit-user__email-error").textContent = "";
    document.querySelector("#edit-user__general-error").textContent = "";

    if (error.username) {
      document.querySelector("#edit-user__username-error").textContent =
        error.username;
    }

    if (error.email) {
      document.querySelector("#edit-user__email-error").textContent =
        error.email;
    }

    if (typeof error === "string") {
      document.querySelector("#edit-user__general-error").textContent = error;
    }
  }
}
