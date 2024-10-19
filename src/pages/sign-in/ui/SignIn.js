import { eventBus } from "../../../shared/lib/eventbus.js";
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

    const user = { username, password };

    if (!username || !password) {
      this.showMessage("All fields are required.", "error");
      return;
    }

    await userStore.signIn(user);
  }

  handleSignInSuccess() {
    eventBus.emit("navigate", "/");
  }

  handleSignInError(error) {
    this.showMessage(`Error: ${error.message || error}`, "error");
  }

  showMessage(message, type) {
    const messageBox = document.querySelector("#message-box");
    if (messageBox) {
      messageBox.textContent = message;
      messageBox.className = `message-box ${type}`;
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
