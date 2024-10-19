import { eventBus } from "../../../shared/lib/index.js";
import { userStore } from "../../../entities/user/model/store.js";

export class Header {
  parent;

  constructor() {
    this.parent = document.querySelector("#header");
  }

  render() {
    const template = Handlebars.templates["Header.hbs"];
    const user = userStore.getUser();
    this.parent.innerHTML = template({ user });

    this.bindEvents();
    this.onEvents();
  }

  bindEvents() {
    this.parent.addEventListener("click", (event) => {
      if (event.target.id === "header_logout_button") {
        this.handleSignOut();
      } else if (event.target.id === "header_login_button") {
        this.handleSignIn();
      } else if (event.target.id === "header_signup_button") {
        this.handleSignup();
      }
    });
  }

  onEvents() {
    eventBus.on("signInSuccess", this.render);
    eventBus.on("signUpSuccess", this.render);
    eventBus.on("signOutSuccess", this.render);
  }

  offEvents() {
    eventBus.off("signUpSuccess", this.render);
    eventBus.off("signUpError", this.render);
    eventBus.off("signOutSuccess", this.render);
  }

  async handleSignOut() {
    try {
      await userStore.signOut();
      eventBus.emit("navigate", "/");
    } catch (error) {
      console.error("unable to sign out", error);
    }
  }

  handleSignIn() {
    eventBus.emit("navigate", "/signin");
  }

  handleSignup() {
    eventBus.emit("navigate", "/signup");
  }

  destructor() {
    this.offEvents();
  }
}
