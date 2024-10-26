import { TrackListAPI } from '../../../widgets/trackList/index.js';
import { ArtistCardView } from '../../../widgets/artistCard/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { AlbumListView } from '../../../widgets/albumList/index.js';
import { FooterPlayerView } from '../../../widgets/footerPlayer/index.js';
import { userStore } from '../../../entities/user/model/store.js';
import { player } from '../../../shared/player/model/store.js';

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

		const trackListAPI = new TrackListAPI(this.artistId);
		const artistCardView = new ArtistCardView(this.parent, this.artistId);
		const trackListView = new TrackListView(this.parent, this.artistId);
		const albumListView = new AlbumListView(this.parent, this.artistId);
		const footPlayerView = new FooterPlayerView(this.parent);

		const tracks = await trackListAPI.get();
		player.setTracks(tracks);

		await artistCardView.render();
		await trackListView.render(tracks);
		await albumListView.render();

		const user = userStore.getUser();
		if (user) {
			await footPlayerView.render();
		}
	}
}
