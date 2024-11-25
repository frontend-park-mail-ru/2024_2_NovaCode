import { eventBus } from '../../../shared/lib/eventbus.js';
import { PlaylistCardAPI } from '../api/api.js';
import { S3_BUCKETS } from "../../../shared/lib/index.js";
import template from './playlistCard.hbs';
import './playlistCard.scss';
import { UserPlaylistsAPI } from '../../userPlaylists/index.js';
import { userStore } from '../../../entities/user/index.js';

export class PlaylistCardView {
    /**
     * The parent HTML element.
     * @type {HTMLElement}
     */
    parent;
    playlistId;

    /**
     * Initializes the PlaylistCardView.
     *
     */
    constructor(parent, playlistId) {
        this.parent = parent ?? document.querySelector("#root");
        this.playlistId = playlistId;
    }

    /**
     * Renders the playlist view.
     */
    async render() {
        const playlistCardAPI = new PlaylistCardAPI(this.playlistId);
        let playlist = await playlistCardAPI.get();

        if (playlist.image) {
            playlist.image = `${S3_BUCKETS.PLAYLIST_IMAGES}/${playlist.image}`;
        } else {
            playlist.image = `${S3_BUCKETS.PLAYLIST_IMAGES}/default.jpeg`;
        }

        const playlistCardElement = document.createElement("div");
        playlistCardElement.classList.add("playlist_card");

        const myPlaylistsAPI = new UserPlaylistsAPI(userStore.storage.user.id);
        const myPlaylists = await myPlaylistsAPI.get();
        this.isMyPlaylist = false;
        Array.from(myPlaylists).forEach((playlist) => {
            if (playlist.id == this.playlistId) {
                this.isMyPlaylist = true;
            }
        })
        playlistCardElement.innerHTML = template({ playlist, isMyPlaylist: this.isMyPlaylist });
        this.parent.appendChild(playlistCardElement);

        this.playPauseBtn = document.querySelector('.buttons__listen');
        this.deleteBtn = document.querySelector('.buttons__delete');
        this.addEvents();
        this.onEvents();
    }

    addEvents() {
        this.playPauseBtn.addEventListener('click', this.handlePlayPauseBtn);
        if (this.deleteBtn) {
            this.deleteBtn.addEventListener('click', () => this.deletePlaylist());
        }
    }

    onEvents() {
        eventBus.on('playlist:deleted', this.handlePlaylistDelete);
    }

    deleteEvents() {
        this.playPauseBtn.removeEventListener('click', this.handlePlayPauseBtn);
    }

    handlePlaylistDelete() {
        const user = userStore.storage.user;
        eventBus.emit('navigate', `/profiles/${user.username}`);
    }

    deletePlaylist() {
        const myPlaylistAPI = new PlaylistCardAPI(this.playlistId);
        myPlaylistAPI.delete();
        eventBus.emit('playlist:deleted');
    }

    handlePlayPauseBtn() {
        eventBus.emit('playPauseTrack');
    }

    destructor() {
        this.deleteEvents();
    }
}
