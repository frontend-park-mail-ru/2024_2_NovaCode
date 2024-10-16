import { TrackListView } from '../../../widgets/trackList/index.js';

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

	render() {
		const trackListView = new TrackListView();
		trackListView.render();
	}
}
