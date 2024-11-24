import { PlaylistView } from '../../../entities/playlist/index.js';
import { userStore } from '../../../entities/user/index.js';
import { eventBus } from '../../../shared/lib/eventbus.js';
import { CreatePlaylistModal } from '../../createPlaylist/index.js';
import { UserPlaylistsAPI } from '../api/api.js';
import template from './userPlaylists.hbs'
import './userPlaylists.scss';

export class UserPlaylistsView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the MyPlaylistsView.
	 *
	 */
	constructor(parent, userId) {
		this.parent = parent ?? document.querySelector('#root');
		this.userId = userId;
	}

	/**
	 * Renders the playlist view.
	 */
	async render() {
		const userPlaylistsAPI = new UserPlaylistsAPI(this.userId);
		const playlists = await userPlaylistsAPI.get();

		const userPlaylistsElement = document.createElement('div');
		userPlaylistsElement.classList.add('user-playlists');

		this.isMyProfile = false;
		if (this.userId === userStore.storage.user.id) {
			this.isMyProfile = true;
		}

		userPlaylistsElement.innerHTML = template({ isMyProfile: this.isMyProfile });

		this.parent.appendChild(userPlaylistsElement);

		const playlistsBlock = document.getElementById('user-playlists');
		Array.from(playlists).forEach((playlist) => {
			const playlistView = new PlaylistView(playlistsBlock);
			playlistView.render(playlist);
		});

		this.addBtn = document.getElementById('add-playlist');
		if (this.addBtn) {
			this.addEvents();
			this.onEvents();
		}

	}

	addEvents() {
		this.addBtn.addEventListener('click', this.handleAddBtn);
	}

	deleteEvents() {
		this.addBtn.addEventListener('click', this.handlePlayPauseBtn);
	}

	onEvents() {
		eventBus.on('playlist:created', () => {
			const userPlaylistsElement = document.querySelector('.user-playlists');
			this.parent.removeChild(userPlaylistsElement);
			this.render();
		});
	}

	offEvents() {
		eventBus.off('playlist:created', this.render);
	}

	handleAddBtn() {
		const modal = new CreatePlaylistModal(this.parent);
		modal.render();
	}

	destructor() {
		if (this.addBtn) {
			this.deleteEvents();
			this.offEvents();
		}

	}
}
