import { eventBus } from '../../../shared/lib/index.js';
import { S3_BUCKETS } from "../../../shared/lib/index.js";
import template from './album.hbs';
import * as styles from './album.scss';

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
		this.parent = parent ?? document.querySelector('#root');

		this.handleAlbumClick = this.handleAlbumClick.bind(this);
	}

	/**
	 * Renders the album view.
	 */
	render(album) {
		this.albumId = album.id;

		if (album.image) {
			album.image = `${S3_BUCKETS.ALBUM_IMAGES}/${album.image}`;
		}

		const albumElement = document.createElement('div');
		albumElement.classList.add('album');
		albumElement.setAttribute('data-id', this.albumId);
		albumElement.innerHTML = template({ styles, album });
		this.parent.appendChild(albumElement);
		this.bindEvents();
	}

	bindEvents() {
		const album = this.parent.querySelector(`[data-id="${this.albumId}"]`);
		album?.addEventListener('click', this.handleAlbumClick);
	}

	handleAlbumClick() {
		eventBus.emit('navigate', `/album/${this.albumId}`);
	}

	destructor() {
		const album = this.parent.querySelector(`[data-id="${this.albumId}"]`);
		if (album) {
			album.removeEventListener('click', this.handleAlbumClick);
		}
	}
}
