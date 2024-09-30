import { View } from "../../view.js";
import { Ajax } from "../../modules/ajax.js";
import { API_URL } from "../../app/config.js";
import { isValidEmail, isValidPassword, isValidUsername } from "../../modules/validation.js";

export class SignupView extends View {
  constructor(router) {
    super(router);
    this.root = document.querySelector("#root");
  }

  render() {
    const template = Handlebars.templates["signup.hbs"];
    this.root.innerHTML = template();
    this.bindEvents();
  }

  /**
   * Binds form submission event to handle user registration
   *
   * @private
   */
  bindEvents() {
    const form = this.root.querySelector("#signup-form");
    const messageBox = this.root.querySelector("#message-box");

    form.addEventListener("submit", (event) =>
      this.submitHandler(event, messageBox),
    );
  }

  /**
   * Handles form submission event and sends registration request to server
   *
   * @param {Event} event - form submission event
   * @param {HTMLElement} messageBox - element to display messages to user
   * @private
   */
  async submitHandler(event, messageBox) {
    event.preventDefault();
    messageBox.innerHTML = "";

    const formData = new FormData(event.target);
    const user = this.extractFormData(formData);

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
      const response = await this.signupRequest(user);
      this.handleRegistrationResponse(response, user, messageBox);
    } catch (error) {
      this.displayMessage(
        messageBox,
        "Возникла ошибка при регистрации. Попробуйте позже.",
        "error",
      );
      console.error("Error during registration:", error);
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
    if (!isValidEmail(user.email)) {
      return {result: false, message: "Неправильный адрес электроннойй почты"};
    }
    if (!isValidUsername(user.username)) {
      return {result: false, message: "Неправильное имя пользователя"};
    }
    if (!isValidPassword(user.password)) {
      return {result: false, message: "Неправильный пароль"};
    }
    return {result: true};
  }

  /**
   * Extracts user data from form
   *
   * @param {FormData} form - form data object containing user details
   * @returns {Object} user data including `email`, `username`, and `password`
   */
  extractFormData(form) {
    return {
      email: form.get("email"),
      username: form.get("username"),
      password: form.get("password"),
    };
  }

  /**
   * Sends registration request to server using user data
   *
   * @param {Object} user - user data to register (email, username, password)
   * @returns {Promise<Object>} response from the server
   */
  async signupRequest(user) {
    const url = `${API_URL}/api/v1/auth/register`;
    return await Ajax.post(url, user);
  }

  /**
   * Handles server response from registration request
   *
   * @param {Object} response - server response from registration request
   * @param {Object} user - user data (excluding the password after successful registration)
   * @param {HTMLElement} messageBox - element to display messages to user
   * @private
   */
  handleRegistrationResponse(response, user, messageBox) {
    if (response.status === 200) {
      delete user.password;
      localStorage.setItem("user", JSON.stringify(user));

      this.displayMessage(messageBox, "Регистрация прошла успешно", "success");
      this.router.renderLayout();
      this.router.goTo("/");
    } else {
      this.displayMessage(
        messageBox,
        response.body.error || "Регистрация не удалась",
        "error",
      );
    }
  }

  /**
   * Displays message to user in message box
   *
   * @param {HTMLElement} messageBox - element to display the message
   * @param {string} message - message content
   * @param {string} type - message type, either 'success' or 'error'
   */
  displayMessage(messageBox, message, type) {
    messageBox.textContent = message;
    messageBox.className =
      type === "success" ? "message-success" : "message-error";
  }
}
