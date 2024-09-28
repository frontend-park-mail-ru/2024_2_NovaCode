import { View } from "../../view.js";
import { Ajax } from "../../modules/ajax.js";
import { getCurrentUser } from "../../modules/user.js";
import { API_URL } from "../../app/config.js";

export class HeaderView extends View {
  constructor(router) {
    super(router);
    /** @private @type {HTMLElement} */
    this.root = document.querySelector("#header");
  }

  render() {
    const user = getCurrentUser();
    const html = this.template(user);
    this.root.innerHTML = html;

    this.bindEvents();
  }

  /**
   * Generates html template for header using Handlebars
   * 
   * @param {Object} user - current user object
   * @returns {string} rendered html string for header
   */
  template(user) {
    const template = Handlebars.templates["header.hbs"];
    return template({ user });
  }

  /**
   * Binds event listeners to buttons
   * 
   * @private
   */
  bindEvents() {
    const loginButton = this.root.querySelector("#header_login_button");
    const signupButton = this.root.querySelector("#header_signup_button");
    const logoutButton = this.root.querySelector("#header_logout_button");

    if (loginButton) {
      this.addEventListener(loginButton, "click", this.loginHandler.bind(this));
    }

    if (signupButton) {
      this.addEventListener(
        signupButton,
        "click",
        this.signupHandler.bind(this),
      );
    }

    if (logoutButton) {
      this.addEventListener(
        logoutButton,
        "click",
        this.logoutHandler.bind(this),
      );
    }
  }

  /**
   * Handles login button click event
   * 
   * @param {Event} event - click event
   */
  loginHandler(event) {
    event.preventDefault();
    this.router.goTo("/login");
  }

  /**
   * Handles signup button click event
   * 
   * @param {Event} event - click event
   */
  signupHandler(event) {
    event.preventDefault();
    this.router.goTo("/signup");
  }

  /**
   * Handles logout button click event
   * 
   * @param {Event} event - click event
   * @returns {Promise<void>} promise that resolves when the logout process is complete
   */
  async logoutHandler(event) {
    event.preventDefault();

    const url = `${API_URL}/api/v1/auth/logout`;
    const response = await Ajax.post(url);

    if (response.status === 200) {
      localStorage.removeItem("user");
      this.render();
      await this.router.goTo("/");
    } else {
      console.error("logout failed:", response.body);
    }
  }
}
