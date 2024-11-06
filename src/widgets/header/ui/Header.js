import { eventBus } from "../../../shared/lib/index.js";
import { userStore } from "../../../entities/user/model/store.js";
import { player } from "../../../shared/player/model/store.js";
import { handleLink, S3_BUCKETS } from "../../../shared/lib/index.js";
import template from './Header.hbs';
import './Header.scss';

export class Header {
  parent;

  constructor() {
    this.parent = document.querySelector("#header");
  }

  render() {
    this.parent.innerHTML = "";
    const user = userStore.storage.user;

    if (user.image) {
      user.image = `${S3_BUCKETS.AVATAR_IMAGES}/${user.image}`;
    }

    this.parent.innerHTML = template({ user });

    this.bindEvents();
    this.onEvents();
    this.switchActiveNavlink(window.location.pathname);
  }


  bindEvents() {
    const logoutLink = this.parent.querySelector("#header_logout_link");
    const links = this.parent.querySelectorAll(".link");

    if (logoutLink) {
      logoutLink.addEventListener("click", (event) =>
        this.handleSignOut(event),
      );
    }
    links.forEach((link) => {
      link.addEventListener("click", handleLink);
    });

    eventBus.on("navigate", this.handleNavigation.bind(this));
  }

  async handleSignOut(event) {
    event.preventDefault();
    try {
      await userStore.signOut();
      player.clearTracks();
      eventBus.emit("navigate", "/signin");
    } catch (error) {
      console.error("unable to sign out", error);
    }
  }

  onEvents() {
    eventBus.on("signInSuccess", this.onSignInSuccess);
    eventBus.on("signUpSuccess", this.onSignUpSuccess);
    eventBus.on("signOutSuccess", this.onSignOutSuccess);
  }

  offEvents() {
    eventBus.off("signInSuccess", this.onSignInSuccess);
    eventBus.off("signUpSuccess", this.onSignUpSuccess);
    eventBus.off("signOutSuccess", this.onSignOutSuccess);
  }

  onSignInSuccess = (user) => {
    this.render(user);
  };

  onSignUpSuccess = (user) => {
    this.render(user);
  };

  onSignOutSuccess = (user) => {
    this.render(user);
  };

  destructor() {
    this.offEvents();
  }

  handleNavigation(href) {
    this.switchActiveNavlink(href);
  }

  switchActiveNavlink(href) {
    let navlinks = document.querySelectorAll(".navlink");
    navlinks.forEach((navlink) => {
      if (navlink.getAttribute("href") == href) {
        navlink.classList.add("active");
      } else {
        navlink.classList.remove("active");
      }
    });
  }
}
