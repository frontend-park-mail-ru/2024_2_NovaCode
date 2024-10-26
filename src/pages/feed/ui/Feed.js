import { TrackListAPI } from '../../../widgets/trackList/index.js';
import { ListenBlockView } from '../../../widgets/listenBlock/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { ArtistListView } from '../../../widgets/artistList/index.js';
import { FooterPlayerView } from '../../../widgets/footerPlayer/index.js';

export class FeedPage {
	/**
	 * Creates an instance of the View class.
	 */
	constructor() {
		this.parent = document.querySelector('#root');
	}

	async render() {
		this.parent.innerHTML = '';

		const trackListAPI = new TrackListAPI(this.artistId);
		const listenBlockView = new ListenBlockView();
		const trackListView = new TrackListView();
		const artistListView = new ArtistListView();
		const footPlayerView = new FooterPlayerView();

		const tracks = await trackListAPI.get();

		await listenBlockView.render();
		await trackListView.render(tracks);
		await artistListView.render();
		await footPlayerView.render(tracks);
	}
}
