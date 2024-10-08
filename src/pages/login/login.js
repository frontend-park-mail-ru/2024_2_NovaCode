import { View } from "../../view.js";
import { Ajax } from "../../modules/ajax.js";
import { API_URL } from "../../app/config.js";
import { isValidUsername } from "../../modules/validation.js";


export class LoginView extends View {
  constructor(router) {
    super(router);
    this.root = document.querySelector("#root");
  }

  render() {
    const template = Handlebars.templates["login.hbs"];
    this.root.innerHTML = template();
    this.bindEvents();
  }

  /**
   * Binds form submission event to handle user login
   *
   * @private
   */
  bindEvents() {
    const form = this.root.querySelector("#login-form");
    const messageBox = this.root.querySelector("#message-box");

    form.addEventListener("submit", (event) =>
      this.submitHandler(event, messageBox),
    );
  }

  /**
   * Handles the form submission event and sends login request to the server
   *
   * @param {Event} event - form submission event
   * @param {HTMLElement} messageBox - element to display message to the user
   * @private
   */
  async submitHandler(event, messageBox) {
    event.preventDefault();
    messageBox.innerHTML = "";

    const user = this.extractFormData(event.target);

    const isValidData = this.isValidData(user);
    if (!isValidData.result) {
      this.displayMessage(
        messageBox,
        isValidData.message,
        "error",
      );
      return;
    }

    try {
      const response = await this.loginRequest(user);
      this.handleLoginResponse(response, user, messageBox);
    } catch (error) {
      this.displayMessage(
        messageBox,
        "Возникла ошибка при входе. Попробуйте позже.",
        "error",
      );
      console.error("Error during login:", error);
    }
  }

  /**
   * Validates the user's data (username and password).
   *
   * @param {Object} user - The user object containing the username and password.
   * 
   * @returns {Object} - An object representing the validation result and error message if needed.
   */
  isValidData(user) {
    if (!isValidUsername(user.username)) {
      return { result: false, message: "Неправильное имя пользователя" };
    }
    if (user.username.length == 0) {
      return { result: false, message: "Пароль не может быть пустым" };
    }
    return { result: true };
  }

  /**
   * Extracts user's login data from form
   *
   * @param {HTMLFormElement} form - login form element
   * @returns {Object} user data, including `username` and `password`
   */
  extractFormData(form) {
    const formData = new FormData(form);
    return {
      username: formData.get("username"),
      password: formData.get("password"),
    };
  }

  /**
   * Sends login request to the server using user data
   *
   * @param {Object} user - user data (username and password)
   * @returns {Promise<Object>} response from the server
   */
  async loginRequest(user) {
    const url = `${API_URL}/api/v1/auth/login`;
    return await Ajax.post(url, user);
  }

  /**
   * Handles server response from login request
   *
   * @param {Object} response - server response from login request
   * @param {Object} user - user data (excluding the password after successful login)
   * @param {HTMLElement} messageBox - element to display message to the user
   * @private
   */
  handleLoginResponse(response, user, messageBox) {
    switch (response.status) {
      case 200:
        delete user.password;
        // localStorage.setItem("user", JSON.stringify(user));
        this.displayMessage(messageBox, "Вход прошел успешно", "success");
        this.router.goTo("/");
        this.router.renderLayout();
        break;
      case 401:
        this.displayMessage(messageBox, "Неправильное имя пользователя или пароль", "error");
        break;
      default:
        this.displayMessage(
          messageBox,
          response.body.error || "Не удалось войти",
          "error",
        );
        break;
    }
  }

  /**
   * Displays message to user in message box
   *
   * @param {HTMLElement} messageBox - element to display message
   * @param {string} message - message content
   * @param {string} type - message type, either 'success' or 'error'
   */
  displayMessage(messageBox, message, type) {
    messageBox.textContent = message;
    messageBox.className =
      type === "success" ? "message-success" : "message-error";
  }
}
