import { CreatePlaylistAPI } from '../api/api.js';
import { eventBus } from '../../../shared/lib/eventbus.js';
import template from './createPlaylist.hbs';
import * as styles from './createPlaylist.scss';

export class CreatePlaylistModal {
    /**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the CreatePlaylistModal.
	 *
	 */
	constructor(parent) {
		this.parent = parent ?? document.querySelector('#root');
	}

    async render() {
        this.createPlaylistModal = document.createElement('div');
        this.createPlaylistModal.classList.add('create-playlist-modal');
        this.createPlaylistModal.innerHTML = template({ styles });
        this.parent.appendChild(this.createPlaylistModal);

        this.addEventListeners(this.createPlaylistModal);
    }

    addEventListeners() {
        const form = this.createPlaylistModal.querySelector('#create-playlist-modal__form');
        const cancelButton = this.createPlaylistModal.querySelector(`.${styles['create-playlist-modal__cancel']}`);

        form.addEventListener('submit', this.handleFormSubmit.bind(this));
        cancelButton.addEventListener('click', this.handleClose.bind(this));

        const closeButton = this.createPlaylistModal.querySelector(`.${styles['create-playlist-modal__close-btn']}`);
        closeButton.addEventListener('click', this.handleClose.bind(this));
    }

    handleClose() {
        this.createPlaylistModal.remove();
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        const playlistNameInput = event.target.querySelector('#playlist-name');
        const playlistName = playlistNameInput.value.trim();

        if (!playlistName) {
            eventBus.emit('notification', { type: 'error', message: 'Playlist name cannot be empty.' });
            return;
        }

        try {
            const api = new (CreatePlaylistAPI);
            const response = await api.createPlaylist(playlistName);
            eventBus.emit('notification', { type: 'success', message: 'Playlist created successfully!' });
            eventBus.emit('playlist:created', response);
            this.createPlaylistModal.remove();
        } catch (error) {
            eventBus.emit('notification', { type: 'error', message: `Failed to create playlist: ${error.message}` });
        }
    }
}