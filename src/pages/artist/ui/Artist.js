import { TrackListAPI } from '../../../widgets/trackList/index.js';
import { AlbumListAPI } from '../../../widgets/albumList/index.js';
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

		const artistCardView = new ArtistCardView(this.parent, this.artistId);
		await artistCardView.render();

		const trackListAPI = new TrackListAPI(this.artistId);
		const tracks = await trackListAPI.get();
		const trackListView = new TrackListView(this.parent, this.artistId);
		await trackListView.render(tracks.slice(0, 5));

		player.setTracks(tracks);

		const albumListAPI = new AlbumListAPI(this.artistId);
		const albumListView = new AlbumListView(this.parent, this.artistId);
		const albums = await albumListAPI.get();
		await albumListView.render(albums.slice(0, 5));

		const footPlayerView = new FooterPlayerView(this.parent);
		const user = userStore.storage.user;
		if (user) {
			await footPlayerView.render();
		}
	}
}
