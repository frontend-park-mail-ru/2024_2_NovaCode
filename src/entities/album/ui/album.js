import template from './album.hbs';
import './album.scss';

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
		const albumElement = document.createElement('div');
		albumElement.innerHTML = template(album);
		this.parent.appendChild(albumElement);
	}
}
