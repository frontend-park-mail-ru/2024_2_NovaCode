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

		const listenBlockView = new ListenBlockView();
		const trackListView = new TrackListView();
		const artistListView = new ArtistListView();
		const footPlayerView = new FooterPlayerView();

		await listenBlockView.render();
		await trackListView.render();
		await artistListView.render();
		await footPlayerView.render();
	}
}
