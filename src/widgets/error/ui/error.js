import template from './error.hbs';
import './error.scss';

export class ErrorView {
  parent;
  title;
  message;

  constructor(parent, title = 'Ошибка', message = 'Что-то пошло не так...') {
    this.parent = parent ? parent : document.querySelector("#root");
    this.title = title;
    this.message = message;
  }

  async render() {
    const errorElement = document.createElement("div");
    errorElement.classList.add("error");
    errorElement.innerHTML = template({ title: this.title, message: this.message });
    this.parent.appendChild(errorElement);
  }
}
