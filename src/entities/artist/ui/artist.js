export class ArtistView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the ArtistView.
	 *
	 */
	constructor(parent) {
		this.parent = parent ? parent : document.querySelector('#root');
	}

	/**
	 * Renders the artist view.
	 */
	render(artist) {
		const template = Handlebars.templates['artist.hbs'];
		this.parent.innerHTML = template({ artist });
	}
}
