import template from './Error.hbs';
import './Error.scss';

export class ErrorPage {
	parent;

	constructor() {
		this.parent = document.querySelector('#root');
	}

	render(message = 'Что-то пошло не так') {
		this.parent.innerHTML = '';

		this.parent.innerHTML = template({ message });
	}
}
