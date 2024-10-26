import { TrackListAPI } from '../../../widgets/trackList/index.js';
import { ListenBlockView } from '../../../widgets/listenBlock/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { ArtistListView } from '../../../widgets/artistList/index.js';
import { FooterPlayerView } from '../../../widgets/footerPlayer/index.js';
import { userStore } from '../../../entities/user/model/store.js';
import { player } from '../../../shared/player/model/store.js';

export class FeedPage {
	/**
	 * Creates an instance of the View class.
	 */
	constructor() {
		this.parent = document.querySelector('#root');
	}

	async render() {
		this.parent.innerHTML = '';

		const trackListAPI = new TrackListAPI();
		const listenBlockView = new ListenBlockView(this.parent);
		const trackListView = new TrackListView(this.parent);
		const artistListView = new ArtistListView(this.parent);
		const footPlayerView = new FooterPlayerView(this.parent);

		const tracks = await trackListAPI.get();
		player.setTracks(tracks);

		await listenBlockView.render();
		await trackListView.render(tracks);
		await artistListView.render();

		const user = userStore.getUser();
		if (user) {
			await footPlayerView.render();
		}
	}
}
