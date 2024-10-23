import { ArtistCardView } from '../../../widgets/artistCard/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { AlbumListView } from '../../../widgets/albumList/index.js';

export class ArtistPage {
	/**
	 * Creates an instance of the View class.
	 */
	constructor(params) {
		this.parent = document.querySelector('#root');
		this.artistId = params['artistId'];
	}

	async render() {
		this.parent.innerHTML = '';

		const artistCardView = new ArtistCardView(this.parent, this.artistId);
		const trackListView = new TrackListView(this.parent, this.artistId);
		const albumListView = new AlbumListView(this.parent, this.artistId);

		await artistCardView.render();
		await trackListView.render();
		await albumListView.render();
	}
}
