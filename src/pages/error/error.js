import { View } from "../../view.js";

export class ErrorView extends View {
  
  /**
   * Initializes the ErrorView instance with the given router.
   * 
   * @param {Router} router - The router instance used for navigation.
   */
  constructor(router) {
    super(router);
    this.root = document.querySelector("#root");
  }

  /**
   * Renders the error view with a provided or default error message.
   * 
   * @param {string} [message="Что-то пошло не так"] - The error message to display.
   */
  render(message = "Что-то пошло не так") {
    const template = Handlebars.templates["error.hbs"];
    this.root.innerHTML = template({ message });
  }
}
