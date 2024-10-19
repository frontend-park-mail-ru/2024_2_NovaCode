import { eventBus } from "../../../shared/lib/eventbus.js";

export class ErrorPage {
	constructor() {
	  this.root = document.querySelector("#root");
	}

	render(message = "Что-то пошло не так") {
	  const template = Handlebars.templates["error.hbs"];
	  this.root.innerHTML = template({ message });
	}
  }