import { PlaylistView } from '../../../entities/playlist/index.js';
import { eventBus } from '../../../shared/lib/eventbus.js';
import { handleLink } from '../../../shared/lib/link.js';
import template from './playlistList.hbs'
import './playlistList.scss';

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
			playlistListElement.innerHTML = template({ showMoreHref });
		} else {
			playlistListElement.innerHTML = template({});
		}
		
		this.parent.appendChild(playlistListElement);

		const playlistsBlock = document.getElementById('mainpage-popular-playlists');
		Array.from(playlists).forEach((playlist) => {
			const playlistView = new PlaylistView(playlistsBlock);
			playlistView.render(playlist);
		});

		this.addEvents();
	}

	addEvents() {
		const links = this.parent.querySelectorAll('.playlists__show_more');

		links.forEach((link) => {
			link.addEventListener('click', handleLink);
		});
	}

	removeEvents() {
		const links = this.parent.querySelectorAll('.playlists__show_more');

		links.forEach((link) => {
			link.addEventListener('click', handleLink);
		});
	}

	destructor() {
		this.removeEvents();
	}
}
