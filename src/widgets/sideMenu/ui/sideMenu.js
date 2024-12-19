import { userStore } from "../../../entities/user";
import template from "./sideMenu.hbs";
import * as styles from"./sideMenu.scss"

export class SideMenu {
  constructor() {
    this.parent = document.querySelector("#root"); // Ensure this targets the correct container
  }

  render = () => {
    // Ensure this.parent exists before appending
    console.log('side menu render')
    if (!this.parent) {
      console.error("Parent container not found for SideMenu.");
      return;
    }

    const user = userStore.storage.user;

    // Create and append the side menu
    this.elem = document.createElement("div");
    this.elem.classList.add(`${styles["side_menu"]}`);
    this.elem.innerHTML = template({ styles, user }); // Render the Handlebars template
    document.body.insertBefore(this.elem, this.parent);

    // Bind events
    this.bindEvents();
  }

  bindEvents() {
    const closeButton = this.elem.querySelector(".closebtn");
    if (closeButton) {
      closeButton.addEventListener("click", this.close);
    }
  }

  open = () => {
    if (this.elem) {
      this.elem.style.width = "250px";
    } else {
      console.error("SideMenu element not found. Ensure render() is called.");
    }
  };

  close = () => {
    if (this.elem) {
      this.elem.style.width = "0";
    } else {
      console.error("SideMenu element not found. Ensure render() is called.");
    }
  };
}
