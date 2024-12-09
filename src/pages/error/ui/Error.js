import template from './Error.hbs';
import './Error.scss';

export class ErrorPage {
	parent;

	constructor() {
		this.parent = document.querySelector('#root');
	}

	render(message = 'Что-то пошло не так') {
		this.parent.innerHTML = '';

		this.pageContent = document.createElement('div');
		this.pageContent.classList.add('page_content');
		this.parent.appendChild(this.pageContent);

		const errorBlock = document.createElement('div');
		flexBefore.classList.add('error');
		this.pageContent.appendChild(errorBlock);

		errorBlock.innerHTML = template({ message });
	}
}
