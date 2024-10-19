import { eventBus } from "../../../shared/lib/eventbus.js";
import { userStore } from "../../../entities/user/model/store.js";

export class SignUpPage {
  parent;

  constructor() {
    this.parent = document.querySelector("#root");

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSignUpSuccess = this.handleSignUpSuccess.bind(this);
    this.handleSignUpError = this.handleSignUpError.bind(this);
  }

  render() {
    const template = Handlebars.templates["SignUp.hbs"];
    this.parent.innerHTML = template();
    this.bindEvents();
    this.onEvents();
  }

  bindEvents() {
    const form = document.querySelector("#signup-form");
    if (form) {
      form.addEventListener("submit", this.handleSubmit);
    }
  }

  onEvents() {
    eventBus.on("signUpSuccess", this.handleSignUpSuccess);
    eventBus.on("signUpError", this.handleSignUpError); 
  }

  offEvents() {
    eventBus.off("signUpSuccess", this.handleSignUpSuccess);
    eventBus.off("signUpError", this.handleSignUpError);
  }

  async handleSubmit(event) {
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    const user = { email, username, password };

    if (!email || !username || !password) {
      this.showMessage("All fields are required.", "error");
      return;
    }

    await userStore.signUp(user);
  }

  handleSignUpSuccess() {
    eventBus.emit("navigate", "/");
  }

  handleSignUpError(error) {
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
    const form = document.querySelector("#signup-form");
    if (form) {
      form.removeEventListener("submit", this.handleSubmit);
    }
  }
}
