export class PlayerView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the PlayerView.
	 *
	 */
	constructor(parent) {
		this.parent = parent ? parent : document.querySelector('#root');
	}

	/**
	 * Renders the player view.
	 */
	async render() {
		const template = Handlebars.templates['player.hbs'];
		this.parent.innerHTML += template({});
	}
}
