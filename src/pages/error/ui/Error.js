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

		this.pageContent = document.createElement('div');
		this.pageContent.classList.add('page_content');
		this.parent.appendChild(this.pageContent);

		const errorBlock = document.createElement('div');
		flexBefore.classList.add('error');
		this.pageContent.appendChild(errorBlock);

		errorBlock.innerHTML = template({ message });

    eventBus.emit('hidePlayer');
	}
}
