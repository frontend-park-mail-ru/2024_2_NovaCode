import { TrackView } from '../../../entities/track/index.js';
import template from './trackList.hbs';
import './trackList.scss';

export class TrackListView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the TrackListView.
	 *
	 * @param {HTMLElement} parent - The parent HTML element
	 * @param {string} [artistId] - The artist ID (optional)
	 */
	constructor(parent, artistId) {
		this.parent = parent ? parent : document.querySelector('#root');
		this.artistId = artistId;
	}

	/**
	 * Renders the tracklist view.
	 */
	async render(tracks) {
		tracks = tracks.map(({ name, artist, image, duration }) => {
			const minutes = Math.floor(duration / 60);
			const seconds = duration % 60;
			duration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
			return { name, artist, image, duration };
		});

		const trackListElement = document.createElement('div');
		trackListElement.classList.add('tracks');
		trackListElement.innerHTML = template({});
		this.parent.appendChild(trackListElement);

		const tracksBlock = document.getElementById('tracks');
		Array.from(tracks).forEach((track, index) => {
			const trackView = new TrackView(tracksBlock, index);
			trackView.render(track);
		});
	}
}
