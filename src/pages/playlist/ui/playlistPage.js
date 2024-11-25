import { TrackListAPI } from '../../../widgets/trackList/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { FooterPlayerView } from '../../../widgets/footerPlayer/index.js';
import { userStore } from '../../../entities/user/model/store.js';
import { PlaylistCardView } from '../../../widgets/playlistCard/index.js';
import { TrackInPlaylistAPI } from '../../../widgets/trackInPlaylist/index.js';
import { UserPlaylistsAPI } from '../../../widgets/userPlaylists/index.js';

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

		const playlistCardView = new PlaylistCardView(this.parent, this.playlistId);
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
		const trackListView = new TrackListView(this.parent, args);
		await trackListView.render(tracks, false);

		const footPlayerView = new FooterPlayerView(this.parent);
		const user = userStore.storage.user;
		if (user) {
			await footPlayerView.render();
		}
	}
}
