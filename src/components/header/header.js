import { View } from "../../view.js";
import { Ajax } from "../../modules/ajax.js";
// import { getCurrentUser, removeCurrentUser } from "../../modules/user.js";
import { API_URL } from "../../app/config.js";

export class HeaderView extends View {
  /**
   * Initializes the HeaderView instance with the given router.
   * 
   * @param {Router} router - The router instance used for navigation.
   */
  constructor(router) {
    super(router);
    this.root = document.querySelector("#header");
  }

  async render() {
    // const user = getCurrentUser();
    const response = await this.isAuthorizedRequest();
    const isAuthorized = this.handleIsAuthorizedResponse(response);
    const html = this.template(isAuthorized);
    this.root.innerHTML = html;

    this.switchActiveNavlink();
    this.bindEvents();
  }

  /**
   * Generates html template for header using Handlebars
   *
   * @param {Object} user - current user object
   * @returns {string} rendered html string for header
   */
  template(isAuthorized) {
    const template = Handlebars.templates["header.hbs"];
    return template({ isAuthorized });
  }

  /**
   * Binds event listeners to buttons
   *
   * @private
   */
  bindEvents() {
    const logoutLink = this.root.querySelector("#header_logout_link");

    if (logoutLink) {
      this.addEventListener(
        logoutLink,
        "click",
        this.logoutHandler.bind(this),
      );
    }
  }

  /**
   * Appends class active to current navlink
   *
   * @private
   */
  switchActiveNavlink() {
    let a = document.querySelectorAll('.header__a_navlink')
    a.forEach((el)=>{
      if (el.getAttribute('href') == window.location.pathname) el.classList.add('active')  
    })
  }

  /**
   * Handles logout  дштл click event
   *
   * @param {Event} event - click event
   * @returns {Promise<void>} promise that resolves when the logout process is complete
   */
  async logoutHandler(event) {
    const url = `${API_URL}/api/v1/auth/logout`;
    const response = await Ajax.post(url);

    if (!(response.status === 200)) {
      console.error("logout failed:", response.body);
    }
  }
  
  /**
   * Sends authorization request to the server using user data
   *
   * @returns {Promise<Object>} response from the server
   */
  async isAuthorizedRequest() {
    const url = `${API_URL}/api/v1/auth/health`;
    return await Ajax.get(url);
  }
  
  /**
   * Handles server response from authorization request
   *
   * @param {Object} response - server response from login request
   * @private
   */
  handleIsAuthorizedResponse(response) {
    switch (response.status) {
      case 200:
        return true;
      case 401:
        return false;
      default:
        console.error('Ошибка при проверке авторизации:', response.body.error);
        return;
    }
  }
}
