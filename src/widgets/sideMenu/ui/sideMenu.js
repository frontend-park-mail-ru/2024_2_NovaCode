import { userStore } from "../../../entities/user";
import { eventBus, handleLink } from "../../../shared/lib";
import { ModalConfirmView } from "../../modalConfirm";
import template from "./sideMenu.hbs";
import * as styles from "./sideMenu.scss"

export class SideMenu {
  constructor() {
    this.root = document.querySelector("#root"); // Ensure this targets the correct container
  }

  render() {
    const existed = document.querySelectorAll(`.${styles["side_menu"]}`);
    existed.forEach((elem) => elem.remove());

    const user = userStore.storage.user;

    // Create and append the side menu
    this.sideMenuElement = document.createElement("div");
    this.sideMenuElement.classList.add(`${styles["side_menu"]}`);
    this.sideMenuElement.innerHTML = template({ styles, user });
    document.body.insertBefore(this.sideMenuElement, this.root);

    this.addEvents();
    this.switchActiveNavlink(window.location.pathname);
  }

  addEvents() {
    const closeButton = this.sideMenuElement.querySelector(`.${styles["side_menu__button_close"]}>h2`);
    closeButton.addEventListener("click", this.close);

    const logoutLink = this.sideMenuElement.querySelector('#side_menu_logout_link');
    if (logoutLink) {
      logoutLink.addEventListener('click', this.handleSignOutBtn);
    }

    const links = this.sideMenuElement.querySelectorAll('.navlink');
    links.forEach((link) => {
      link.addEventListener('click', handleLink);
    });

    eventBus.on('navigate', this.handleNavigation);
  }

  open = () => {
    this.sideMenuElement.style.width = "200px";
  };

  close = () => {
    this.sideMenuElement.style.width = "0";
  };

  handleSignOutBtn = (event) => {
    event.preventDefault();
    const modalConfirmView = new ModalConfirmView(
      null,
      'Вы уверены, что хотите выйти?',
      this.handleSignOut,
    );
    modalConfirmView.render();
  }

  async handleSignOut() {
    try {
      await userStore.signOut();
      eventBus.emit('hidePlayer');
      eventBus.emit('navigate', '/signin');
    } catch (error) {
      console.error('unable to sign out', error);
    }
  }

  onEvents() {
    eventBus.on('signInSuccess', this.onSignInSuccess);
    eventBus.on('signUpSuccess', this.onSignUpSuccess);
    eventBus.on('signOutSuccess', this.onSignOutSuccess);
    eventBus.on('unauthorized', this.onSignOutSuccess);
  }

  offEvents() {
    eventBus.off('signInSuccess', this.onSignInSuccess);
    eventBus.off('signUpSuccess', this.onSignUpSuccess);
    eventBus.off('signOutSuccess', this.onSignOutSuccess);
    eventBus.off('unauthorized', this.onSignOutSuccess);
  }

  onSignInSuccess = () => {
    this.render();
  };

  onSignUpSuccess = () => {
    this.render();
  };

  onSignOutSuccess = () => {
    this.render();
  };

  destructor() {
    this.offEvents();
  }

  handleNavigation = (href) => {
    this.switchActiveNavlink(href);
    this.close();
  }

  switchActiveNavlink(href) {
    let navlinks = document.querySelectorAll('.navlink_switch');
    navlinks.forEach((navlink) => {
      if (navlink.getAttribute('href') == href) {
        navlink.classList.add(styles.active);
      } else {
        navlink.classList.remove(styles.active);
      }
    });
  }
}
