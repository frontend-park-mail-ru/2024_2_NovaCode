export class ListenBlockView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the ListenBlockView.
	 *
	 */
	constructor(parent) {
		this.parent = parent ? parent : document.querySelector('#root');
	}

	/**
	 * Renders the listen block view.
	 */
	async render() {
		const template = Handlebars.templates['listenBlock.hbs'];
		const listenBlockElement = document.createElement('div');
		listenBlockElement.innerHTML = template({});
		this.parent.appendChild(listenBlockElement);
	}
}
