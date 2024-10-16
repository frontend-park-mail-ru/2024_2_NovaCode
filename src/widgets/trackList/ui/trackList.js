import { TrackView } from '../../../entities/track/index.js';
import { TrackListAPI } from '../api/api.js';

export class TrackListView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the TrackView.
	 *
	 */
	constructor(parent) {
		this.parent = parent ? parent : document.querySelector('#root');
	}

	/**
	 * Renders the playlist view.
	 */
	async render() {
		const trackListAPI = new TrackListAPI();
		let tracks = await trackListAPI.get();
		tracks = tracks.map(({ name, artist, image, duration }) => {
			const minutes = Math.floor(duration / 60);
			const seconds = duration % 60;
			duration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
			return { name, artist, image, duration };
		});

		const template = Handlebars.templates['trackList.hbs'];
		this.parent.innerHTML = template(tracks);

		const tracksBlock = document.getElementById('mainpage-playlist');
		Array.from(tracks).forEach((track) => {
			const trackView = new TrackView(tracksBlock);
			trackView.render(track);
		});
	}
}
