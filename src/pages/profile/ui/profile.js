import { UserCardView } from '../../../widgets/userCard/index.js';
import { TrackListAPI } from '../../../widgets/trackList/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { FooterPlayerView } from '../../../widgets/footerPlayer/index.js';
import { userStore } from '../../../entities/user/model/store.js';
import { player } from '../../../shared/player/model/store.js';

export class ProfilePage {
	parent;
	username;

	constructor(params) {
		this.parent = document.querySelector('#root');
		this.username = params['username'];
	}

	async render() {
		this.parent.innerHTML = '';

		const userCardView = new UserCardView(this.parent, this.username);
		await userCardView.render();

		const trackListAPI = new TrackListAPI();
		const trackListView = new TrackListView(this.parent);
		const tracks = await trackListAPI.getFavorite();

		if (tracks.length > 0) {
			await trackListView.render(tracks.slice(0, 5));
			trackListView.setTitle('Любимые треки');
			player.clearTracks();
			player.setTracks(tracks);
			const footPlayerView = new FooterPlayerView(this.parent);
			const user = userStore.storage.user;
			if (user) {
				await footPlayerView.render();
			}
		}
	}
}
