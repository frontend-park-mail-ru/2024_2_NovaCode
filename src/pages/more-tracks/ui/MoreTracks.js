import { TrackListAPI } from '../../../widgets/trackList/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { FooterPlayerView } from '../../../widgets/footerPlayer/index.js';
import { userStore } from '../../../entities/user/model/store.js';
import { player } from '../../../shared/player/model/store.js';

export class MoreTracksPage {
	/**
	 * Creates an instance of the View class.
	 */
	constructor(params) {
		this.parent = document.querySelector('#root');
		this.type = params['type']
		this.entity = params['entity'];
		this.entityId = params['id'];
	}

	async render() {
		this.parent.innerHTML = '';

		if (this.entity === 'artist') {
			this.artistId = this.entityId;
		} else if (this.entity === 'album') {
			this.albumId = this.entityId;
		} else if (this.type === 'favorite') {
			this.favorite = true;
		}

		const trackListAPI = new TrackListAPI({artistId: this.artistId, albumId: this.albumId});
		const trackListView = new TrackListView(
			this.parent,
			{
				artistId: this.artistId, 
				albumId: this.albumId,
				favorite: this.favorite,
			},
		);
		const tracks = await trackListAPI.get();
		await trackListView.render(tracks, false);

		player.setTracks(tracks);

		const footPlayerView = new FooterPlayerView(this.parent);
		const user = userStore.storage.user;
		if (user) {
			await footPlayerView.render();
		}
	}
}
