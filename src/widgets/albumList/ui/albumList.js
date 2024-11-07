import { AlbumView } from '../../../entities/album/index.js';
import template from './albumList.hbs';
import './albumList.scss';

export class AlbumListView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the AlbumListView.
	 *
	 */
	constructor(parent, artistId = null) {
		this.parent = parent ? parent : document.querySelector('#root');
		this.artistId = artistId;
	}

	/**
	 * Renders the album view.
	 */
	async render(albums, needsShowMoreHref = true) {
		const albumListElement = document.createElement('div');
		albumListElement.classList.add('albums');

		if (needsShowMoreHref) {
			let showMoreHref;
			if (this.artistId) {
				showMoreHref = `/more_albums/${"artist"}/${this.artistId}`;
			} else {
				showMoreHref = `/more_albums/popular`;
			}
			albumListElement.innerHTML = template({showMoreHref });
		} else {
			albumListElement.innerHTML = template({});
		}

		this.parent.appendChild(albumListElement);

		const albumsBlock = document.getElementById('albums');
		Array.from(albums).forEach((album) => {
			const albumView = new AlbumView(albumsBlock);
			albumView.render(album);
		});
	}
}
