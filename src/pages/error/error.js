import { View } from "../../view.js";

export class ErrorView extends View {
  constructor(router) {
    super(router);
    this.root = document.querySelector("#root");
  }

  render(message = "Что-то пошло не так") {
    const template = Handlebars.templates["error.hbs"];
    this.root.innerHTML = template({ message });
  }
}
