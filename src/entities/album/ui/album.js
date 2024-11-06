<<<<<<< HEAD
import template from './album.hbs';
import './album.scss';
=======
import { S3_BUCKETS } from "../../../shared/lib/index.js";
>>>>>>> NM-48

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
<<<<<<< HEAD
=======
		if (album.image) {
			album.image = `${S3_BUCKETS.ALBUM_IMAGES}/${album.image}`;
		}

		const template = Handlebars.templates['album.hbs'];
>>>>>>> NM-48
		const albumElement = document.createElement('div');
		albumElement.classList.add('album');
		albumElement.innerHTML = template(album);
		this.parent.appendChild(albumElement);
	}
}
