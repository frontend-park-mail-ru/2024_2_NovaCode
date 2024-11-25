import { TrackListAPI } from '../../../widgets/trackList/index.js';
import { ListenBlockView } from '../../../widgets/listenBlock/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { ArtistCarouselView } from '../../../widgets/artistCarousel/index.js';
import { PlaylistListAPI, PlaylistListView } from '../../../widgets/playlistList/index.js';
import { FooterPlayerView } from '../../../widgets/footerPlayer/index.js';

import { userStore } from '../../../entities/user/model/store.js';
import { player } from '../../../shared/player/model/store.js';
import { CSATWindow } from '../../../widgets/csatWindow/ui/csatWindow.js';

export class FeedPage {
	/**
	 * Creates an instance of the View class.
	 */
	constructor() {
		this.parent = document.querySelector('#root');
	}

	async render() {
		this.parent.innerHTML = '';

		const iframe = new CSATWindow();
		await iframe.render();

		const listenBlockView = new ListenBlockView(this.parent);
		await listenBlockView.render();

		const trackListAPI = new TrackListAPI();
		const trackListView = new TrackListView(this.parent);
		const tracks = await trackListAPI.get();
		await trackListView.render(tracks.slice(0, 5));

		player.setTracks(tracks);

		const artistCarouselView = new ArtistCarouselView(this.parent);
		await artistCarouselView.render();

		const playlistListAPI = new PlaylistListAPI();
		const playlistListView = new PlaylistListView(this.parent)
		const playlists = await playlistListAPI.get();
		await playlistListView.render(playlists.slice(0, 5));


		const footPlayerView = new FooterPlayerView(this.parent);

		const user = userStore.storage.user;
		if (user) {
			await footPlayerView.render();
		}
	}
}
