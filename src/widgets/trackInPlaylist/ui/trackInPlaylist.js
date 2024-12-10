import { userStore } from '../../../entities/user/index.js';
import { UserPlaylistsAPI } from '../../userPlaylists/index.js';
import { TrackInPlaylistAPI } from '../api/api.js';
import template from './trackInPlaylist.hbs';
import * as styles from './trackInPlaylist.scss';

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
        this.modal.classList.add(styles['track-playlist-modal-container']);
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

    renderBtn() {
        const button = document.createElement('button');
        button.classList.add('track-playlist-button');
        button.textContent = 'Add to Playlist';

        button.addEventListener('click', () => {
            this.modal = new TrackInPlaylistModal(this.parent, this.trackId);
            this.modal.render();
        });

        this.parent.appendChild(button);
    }

    addEventListeners() {
        const closeButton = this.modal.querySelector(`.${styles['track-playlist-modal__close-btn']}`);
        closeButton.addEventListener('click', this.handleClose.bind(this));

        const playlistLinks = this.modal.querySelectorAll(styles['track-playlist-modal__playlist-link']);
        playlistLinks.forEach((link) => {
            link.addEventListener('click', async (event) => {
                event.preventDefault();
                this.handleLink(link);
            });
        });
    }

    handleClose = () => {
        this.modal.remove();
    }

    handleLink = function(link) {
        
        const playlistId = link.dataset.id;

        try {
            const trackInPlaylistAPI = new TrackInPlaylistAPI(playlistId);
            trackInPlaylistAPI.addTrack(this.trackId);
            this.modal.remove();
        } catch (error) {
            console.error('Failed to add track to playlist:', error);
        }
    }

    removeEventListeners() {
        const closeButton = this.modal.querySelector(`.${styles['track-playlist-modal__close-btn']}`);
        closeButton.removeEventListener('click', this.handleClose.bind(this));

        const playlistLinks = this.modal.querySelectorAll(styles['track-playlist-modal__playlist-link']);
        playlistLinks.forEach((link) => {
            link.removeEventListener('click', this.handleLink.bind(this));
        });
    }

    destrcutor() {
        this.removeEventListeners();
    }
}
