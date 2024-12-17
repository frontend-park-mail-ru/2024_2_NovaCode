import { TrackListAPI } from '../../../widgets/trackList/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { userStore } from '../../../entities/user/model/store.js';
import { PlaylistCardView } from '../../../widgets/playlistCard/index.js';
import { UserPlaylistsAPI } from '../../../widgets/userPlaylists/index.js';
import { player } from '../../../shared/player/model/store.js';
import { eventBus } from '../../../shared/lib/eventbus.js';

export class PlaylistPage {
	parent;
	playlistId;
	/**
	 * Creates an instance of the View class.
	 */
	constructor(params) {
		this.parent = document.querySelector('#root');
		this.playlistId = params.playlistId;
	}

	async render() {
		this.parent.innerHTML = '';

		this.pageContent = document.createElement('div');
		this.pageContent.classList.add('page_content');
		this.parent.appendChild(this.pageContent);

		const playlistCardView = new PlaylistCardView(
			this.pageContent,
			this.playlistId,
		);
		await playlistCardView.render();

		const myPlaylistsAPI = new UserPlaylistsAPI(userStore.storage.user.id);
		this.isMyPlaylist = await myPlaylistsAPI.isMyPlaylist(this.playlistId);
		//myPlaylistsAPI.isMyPlaylist(this.playlistId);

		const trackListAPI = new TrackListAPI({ playlistId: this.playlistId });
		const tracks = await trackListAPI.get();
		let args;
		if (this.isMyPlaylist) {
			args = { myPlaylistId: this.playlistId };
		} else {
			args = {};
		}

		const trackListView = new TrackListView(this.pageContent, args);
		await trackListView.render(tracks, false);

		if (tracks.length > 0) {
			player.addTracks(tracks);
		}

		if (player.isReady() && userStore.storage.user.isAuthorized) {
			eventBus.emit('showPlayer');
		} else {
			eventBus.emit('hidePlayer');
		}
	}
}
