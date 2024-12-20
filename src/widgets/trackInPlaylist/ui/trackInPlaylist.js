import { eventBus } from '../../../shared/lib/eventbus.js';
import { userStore } from '../../../entities/user/index.js';
import { UserPlaylistsAPI } from '../../userPlaylists/index.js';
import { TrackInPlaylistAPI } from '../api/api.js';
import template from './trackInPlaylist.hbs';
import * as styles from './trackInPlaylist.scss';
import { CreatePlaylistModal } from '../../createPlaylist/index.js';

export class TrackInPlaylistModal {
    /**
     * Initializes the modal with the parent element and track ID.
     *
     * @param {HTMLElement} parent - The parent element.
     * @param {string} trackId - The track ID to add.
     */
    constructor(parent, trackId) {
        this.parent = parent ?? document.querySelector('#root');
        this.trackId = trackId;
    }

    async render() {
        this.modal = document.createElement('div');
        this.modal.classList.add(styles['track-in-playlist-modal']);
        this.parent.appendChild(this.modal);

        try {
            const myPlaylistsAPI = new UserPlaylistsAPI(userStore.storage.user.id);
            const playlists = await myPlaylistsAPI.get();
            this.modal.innerHTML = template({ styles, playlists });
            this.addEventListeners(this.modal);
        } catch (error) {
            console.error('Failed to load playlists:', error);
            this.modal.innerHTML = '<p class="error">Failed to load playlists. Please try again later.</p>';
        }
    }

    addEventListeners() {
        const closeButton = this.modal.querySelector(`.${styles['track-in-playlist-modal__close-btn']}`);
        closeButton.addEventListener('click', this.handleClose.bind(this));

        const playlistLinks = this.modal.querySelectorAll(`.${styles['track-in-playlist-modal__playlist-link']}`);
        playlistLinks.forEach((link) => {
            link.addEventListener('click', (event) => this.handleLink(event));
        });

        const createButton = this.modal.querySelector(`.${styles["track-in-playlist-modal__create-btn"]}`);
        createButton.addEventListener('click', this.handleCreate)
    }

    handleClose = () => {
        this.modal.remove();
    }

    handleLink(event) {
        const link = event.target;

        const playlistId = link.dataset.id;
        try {
            const trackInPlaylistAPI = new TrackInPlaylistAPI(playlistId);
            trackInPlaylistAPI.addTrack(this.trackId);
            this.modal.remove();
        } catch (error) {
            console.error('Failed to add track to playlist:', error);
        }

        event.preventDefault();
		const href = link.getAttribute('href')
		eventBus.emit('navigate', href);
    }

    handleCreate = async () => {
        this.modal.remove();
        const createPlaylistModal = new CreatePlaylistModal(null, async () => {
            const trackInPlaylistModal = new TrackInPlaylistModal(this.parent, this.trackId);
            await trackInPlaylistModal.render();
        });
        await createPlaylistModal.render();
    }

    removeEventListeners() {
        const closeButton = this.modal.querySelector(`.${styles['track-in-playlist-modal__close-btn']}`);
        closeButton.removeEventListener('click', this.handleClose.bind(this));

        const playlistLinks = this.modal.querySelectorAll(`.${styles['track-in-playlist-modal__playlist-link']}`);
        playlistLinks.forEach((link) => {
            link.removeEventListener('click', this.handleLink.bind(this));
        });
    }

    destrcutor() {
        this.removeEventListeners();
    }
}
