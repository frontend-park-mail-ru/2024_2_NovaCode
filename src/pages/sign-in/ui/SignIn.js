import { eventBus } from "../../../shared/lib/index.js";
import { validate, VALIDATION_RULES } from "../../../shared/lib/index.js";
import { userStore } from "../../../entities/user/model/store.js";

export class SignInPage {
  parent;

  constructor() {
    this.parent = document.querySelector("#root");

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSignInSuccess = this.handleSignInSuccess.bind(this);
    this.handleSignInError = this.handleSignInError.bind(this);
  }

  render() {
    const template = Handlebars.templates["SignIn.hbs"];
    this.parent.innerHTML = template();
    this.bindEvents();
    this.onEvents();
  }

  bindEvents() {
    const form = document.querySelector("#login-form");
    if (form) {
      form.addEventListener("submit", this.handleSubmit);
    }
  }

  onEvents() {
    eventBus.on("signInSuccess", this.handleSignInSuccess);
    eventBus.on("signInError", this.handleSignInError);
  }

  offEvents() {
    eventBus.off("signInSuccess", this.handleSignInSuccess);
    eventBus.off("signInError", this.handleSignInError);
  }

  async handleSubmit(event) {
    event.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    let validationErrors = {};

    const usernameError = validate(username, VALIDATION_RULES.username);
    if (usernameError) {
      validationErrors.username = usernameError;
    }

    const passwordError = validate(password, VALIDATION_RULES.password);
    if (passwordError) {
      validationErrors.password = passwordError;
    }

    if (Object.keys(validationErrors).length > 0) {
      this.handleSignInError(validationErrors);
      return;
    }

    const user = { username, password };
    await userStore.signIn(user);
  }

  handleSignInSuccess() {
    eventBus.emit("navigate", "/");
  }

  handleSignInError(error) {
    document.querySelector("#login__username-error").textContent = "";
    document.querySelector("#login__password-error").textContent = "";
    document.querySelector("#login__general-error").textContent = "";

    if (error.username) {
      document.querySelector("#login__username-error").textContent =
        error.username;
    }

    if (error.password) {
      document.querySelector("#login__password-error").textContent =
        error.password;
    }

    if (typeof error === "string") {
      document.querySelector("#login__general-error").textContent = error;
    }
  }

  destructor() {
    this.offEvents();
    const form = document.querySelector("#login-form");
    if (form) {
      form.removeEventListener("submit", this.handleSubmit);
    }
  }
}
