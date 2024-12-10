import { PlaylistView } from '../../../entities/playlist/index.js';
import template from './playlistList.hbs'
import * as styles from './playlistList.scss';

export class PlaylistListView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the PlaylistView.
	 *
	 */
	constructor(parent) {
		this.parent = parent ?? document.querySelector('#root');
	}

	/**
	 * Renders the playlist view.
	 */
	async render(playlists, needsShowMoreHref = true) {
		const playlistListElement = document.createElement('div');
		playlistListElement.classList.add('playlists');

		if (needsShowMoreHref) {
			let showMoreHref = `/more_playlists/popular`;
			playlistListElement.innerHTML = template({ styles, showMoreHref });
		} else {
			playlistListElement.innerHTML = template({ styles });
		}
		
		this.parent.appendChild(playlistListElement);

		const playlistsBlock = document.getElementById('mainpage-popular-playlists');
		Array.from(playlists).forEach((playlist) => {
			const playlistView = new PlaylistView(playlistsBlock);
			playlistView.render(playlist);
		});
	}
}
