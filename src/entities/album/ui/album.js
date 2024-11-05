import { S3_BUCKETS } from "../../../shared/lib/index.js";

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
		if (album.image) {
			album.image = `${S3_BUCKETS.ALBUM_IMAGES}/${album.image}`;
		}

		const template = Handlebars.templates['album.hbs'];
		const albumElement = document.createElement('div');
		albumElement.innerHTML = template(album);
		this.parent.appendChild(albumElement);
	}
}
