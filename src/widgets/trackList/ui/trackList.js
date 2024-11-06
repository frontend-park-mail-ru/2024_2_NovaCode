import { TrackView } from '../../../entities/track/index.js';
import { eventBus } from '../../../shared/lib/eventbus.js';

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
	 * @param {string} [albumId] - The album ID (optional)
	 */
	constructor(parent, artistId = null, albumId = null) {
		this.parent = parent ? parent : document.querySelector('#root');
		this.artistId = artistId;
		this.albumId = albumId;
	}

	/**
	 * Renders the tracklist view.
	 */
	async render(tracks, needsShowMoreHref = true) {
		tracks = tracks.map(({ name, artist, image, duration }) => {
			const minutes = Math.floor(duration / 60);
			const seconds = duration % 60;
			duration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
			return { name, artist, image, duration };
		});

		const template = Handlebars.templates['trackList.hbs'];
		const trackListElement = document.createElement('div');
		trackListElement.classList.add('tracks');
		
		if (needsShowMoreHref) {
			var showMoreHref;
			if (this.artistId) {
				showMoreHref = `/more_tracks/${"artist"}/${this.artistId}`;
			} else if (this.albumId) {
				showMoreHref = `/more_tracks/${"album"}/${this.albumId}`;
			} else {
				showMoreHref = `/more_tracks/popular`;
			}
			trackListElement.innerHTML = template({ showMoreHref });
		} else {
			trackListElement.innerHTML = template({});
		}

		this.parent.appendChild(trackListElement);

		const tracksBlock = document.getElementById('tracks');
		Array.from(tracks).forEach((track, index) => {
			const trackView = new TrackView(tracksBlock, index);
			trackView.render(track);
		});

		this.bindEvents();
	}

	bindEvents() {
		const links = this.parent.querySelectorAll('.link');

		links.forEach(link => {
			link.addEventListener('click', (event) => this.handleLink(event));
	  	});
	}

	handleLink(event) {
		event.preventDefault();
		const href = event.target.getAttribute('href')
		eventBus.emit('navigate', href);
	}
}
