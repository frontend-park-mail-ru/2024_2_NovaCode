import { TrackListAPI } from '../api/api';
import trackListTemplate from './trackList.hbs';
// import trackTemplate from './track.hbs';

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
	render() {
		const trackListAPI = new TrackListAPI();
		var tracks = trackListAPI.get();
		tracks = tracks.forEach((track) => {
			track.map(({ name, artist, image, duration }) => {
				const minutes = Math.floor(duration / 60);
				const seconds = duration % 60;
				const duration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
				return { name, artist, image, duration };
			});
		});

		this.parent.innerHTML = trackListTemplate(tracks);
	}
}
