import { ArtistView } from '../../../entities/artist/index.js';
import { ArtistListAPI } from '../api/api.js';

export class ArtistListView {
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
		const artistListAPI = new ArtistListAPI();
		let artists = await artistListAPI.get();

		const template = Handlebars.templates['artistList.hbs'];
		this.parent.innerHTML += template({});

		const artistsBlock = document.getElementById('mainpage-popular-artists');
		Array.from(artists).forEach((artist) => {
			const artistView = new ArtistView(artistsBlock);
			artistView.render(artist);
		});
	}
}
