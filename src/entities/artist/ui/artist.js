import artistTemplate from './artist.hbs';

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
		this.parent.innerHTML = artistTemplate({ artist });
	}
}
