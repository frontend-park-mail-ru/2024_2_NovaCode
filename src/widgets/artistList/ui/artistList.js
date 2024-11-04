import { ArtistView } from '../../../entities/artist/index.js';
import { ArtistListAPI } from '../api/api.js';

export class ArtistListView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the ArtistView.
	 *
	 */
	constructor(parent) {
		this.parent = parent ? parent : document.querySelector('#root');
	}

	/**
	 * Renders the playlist view.
	 */
	async render(artists, needsShowMoreHref = true) {
		const template = Handlebars.templates['artistList.hbs'];
		const artistListElement = document.createElement('div');
		artistListElement.classList.add('artists');

		if (needsShowMoreHref) {
			var showMoreHref = `/more_artists/popular`;
			artistListElement.innerHTML = template({ showMoreHref });
		} else {
			artistListElement.innerHTML = template({});
		}
		
		this.parent.appendChild(artistListElement);

		const artistsBlock = document.getElementById('mainpage-popular-artists');
		Array.from(artists).forEach((artist) => {
			const artistView = new ArtistView(artistsBlock);
			artistView.render(artist);
		});
	}
}
