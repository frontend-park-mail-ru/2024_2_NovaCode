import { PlaylistView } from '../../../entities/playlist/index.js';
import { userStore } from '../../../entities/user/index.js';
import { eventBus } from '../../../shared/lib/eventbus.js';
import { CreatePlaylistModal } from '../../createPlaylist/index.js';
import { UserPlaylistsAPI } from '../api/api.js';
import template from './userPlaylists.hbs'
import * as styles from './userPlaylists.scss';
import musicSquareAddIcon from '../../../../public/images/icons/music-square-add.svg';

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

		this.isCurrentUser = false;
		if (this.userId === userStore.storage.user.id) {
			this.isCurrentUser = true;
		}

		userPlaylistsElement.innerHTML = template({ styles, isCurrentUser: this.isCurrentUser, musicSquareAddIcon });
		this.parent.appendChild(userPlaylistsElement);

		this.addBtn = document.getElementById('add-playlist');
		console.log(this.addBtn);
		if (this.addBtn) {
			this.addEvents();
			this.onEvents();
		}

		const playlistsBlock = document.getElementById('user-playlists');
		if (playlists?.length === 0) return;
		Array.from(playlists).forEach((playlist) => {
			const playlistView = new PlaylistView(playlistsBlock);
			playlistView.render(playlist);
		});
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

	handleAddBtn = () => {
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
