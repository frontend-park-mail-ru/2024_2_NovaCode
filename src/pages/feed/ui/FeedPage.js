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
		this.router = router;
	}

	async render() {
		const trackListView = new TrackListView();
		const artistListView = new ArtistListView();

		await trackListView.render();
		await artistListView.render();
	}
}
