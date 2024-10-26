export class AlbumView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the AlbumView.
	 *
	 */
	constructor(parent) {
		this.parent = parent ? parent : document.querySelector('#root');
	}

	/**
	 * Renders the album view.
	 */
	render(album) {
		const template = Handlebars.templates['album.hbs'];
		const albumElement = document.createElement('div');
		albumElement.innerHTML = template(album);
		this.parent.appendChild(albumElement);
	}
}
