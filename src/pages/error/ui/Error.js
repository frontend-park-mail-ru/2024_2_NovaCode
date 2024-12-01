import { eventBus } from '../../../shared/lib/index.js';
import { ErrorView } from '../../../widgets/error/index.js';

export class ErrorPage {
  parent;

  constructor(title = 'Ошибка', message = 'Что-то пошло не так...') {
    this.parent = document.querySelector('#root');
    this.title = title;;
    this.message = message;
  }

  async render() {
    this.parent.innerHTML = '';

    const errorView = new ErrorView(this.parent, this.title, this.message);
    await errorView.render();

    eventBus.emit('hidePlayer');
  }
}
