export class ErrorPage {
	parent;

	constructor() {
		this.parent = document.querySelector('#root');
	}

	render(message = 'Что-то пошло не так') {
		this.parent.innerHTML = '';

		const template = Handlebars.templates['error.hbs'];
		this.parent.innerHTML = template({ message });
	}
}
