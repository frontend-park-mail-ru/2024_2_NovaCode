import { AlbumView } from '../../../entities/album/index.js';
import template from './albumList.hbs';
import * as styles from './albumList.scss';

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
	async render(albums, favorite = false) {
		const albumListElement = document.createElement('div');
		albumListElement.classList.add('albums');

		let titleText;
		if (this.artistId) {
			titleText = "Альбомы исполнителя";
		} else if (favorite) {
			titleText = "Любимые альбомы";
		} else {
			titleText = "Популярные альбомы";
		}

		albumListElement.innerHTML = template({styles});

		this.parent.appendChild(albumListElement);

		const albumsBlock = document.getElementById('albums');
		Array.from(albums).forEach((album) => {
			const albumView = new AlbumView(albumsBlock);
			albumView.render(album);
		});

		this.setTitle(titleText);
	}

	setTitle(titleText) {
		const titleBlock = document.querySelector(`.${styles['albums__recommend_text']}`);
		const title = titleBlock.querySelector('h4');
		title.textContent = titleText;
	}
}
