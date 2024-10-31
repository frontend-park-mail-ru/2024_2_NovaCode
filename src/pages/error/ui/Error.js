import { eventBus } from '../../../shared/lib/eventbus.js';
import template from './Error.hbs';

export class ErrorPage {
	constructor() {
		this.parent = document.querySelector('#root');
	}

	render(message = 'Что-то пошло не так') {
		this.parent.innerHTML = '';

		this.parent.innerHTML = template({ message });
	}
}
