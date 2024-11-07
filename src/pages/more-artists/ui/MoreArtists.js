import { ArtistListAPI } from '../../../widgets/artistList/index.js';
import { ArtistListView } from '../../../widgets/artistList/index.js';
import template from './MoreArtists.hbs';
import './MoreArtists.scss';

export class MoreArtistsPage {
	/**
	 * Creates an instance of the View class.
	 */
	constructor() {
		this.parent = document.querySelector('#root');
	}

	async render() {
		this.parent.innerHTML = template();

		const artistListAPI = new ArtistListAPI();
		const artists = await artistListAPI.get();
		const artistListView = new ArtistListView(this.parent);
		await artistListView.render(artists, false);
	}
}
