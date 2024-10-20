import { PlayerView } from '../../../widgets/player/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { ArtistListView } from '../../../widgets/artistList/index.js';

export class FeedPage {
	/**
	 * The router instance responsible for navigating between views.
	 */
	router;

	/**
	 * Creates an instance of the View class.
	 *
	 * @param {Object} router - The router instance responsible for navigating between views.
	 */
	constructor(router) {
		this.parent = document.querySelector('#root');
		this.router = router;
	}

	async render() {
		this.parent.innerHTML = '';

		const playerView = new PlayerView();
		const trackListView = new TrackListView();
		const artistListView = new ArtistListView();

		await playerView.render();
		await trackListView.render();
		await artistListView.render();
	}
}
