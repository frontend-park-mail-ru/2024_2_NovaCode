import { ArtistListAPI } from '../../../widgets/artistList/index.js';
import { ArtistListView } from '../../../widgets/artistList/index.js';

export class MoreArtistsPage {
	/**
	 * Creates an instance of the View class.
	 */
	constructor() {
		this.parent = document.querySelector('#root');
	}

	async render() {
		this.parent.innerHTML = '';

		this.pageContent = document.createElement('div');
		this.pageContent.classList.add('page_content');
		this.parent.appendChild(this.pageContent);

		const artistListAPI = new ArtistListAPI();
		const artists = await artistListAPI.get();
		const artistListView = new ArtistListView(this.pageContent);
		await artistListView.render(artists);
	}
}
