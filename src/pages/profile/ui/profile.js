import { UserCardView } from '../../../widgets/userCard/index.js';
import { TrackListAPI } from '../../../widgets/trackList/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { FooterPlayerView } from '../../../widgets/footerPlayer/index.js';
import { userStore } from '../../../entities/user/model/store.js';
import { player } from '../../../shared/player/model/store.js';
import { UserPlaylistsView } from "../../../widgets/userPlaylists/index.js";

export class ProfilePage {
	parent;
	username;

	constructor(params) {
		this.parent = document.querySelector('#root');
		this.username = params['username'];
	}

	async render() {
		this.parent.innerHTML = '';

		this.pageContent = document.createElement('div');
		this.pageContent.classList.add('page_content');
		this.parent.appendChild(this.pageContent);

		const userCardView = new UserCardView(this.pageContent, this.username);
		await userCardView.render();

		this.user = await userStore.getUser(this.username);
		const myPlaylistsView = new UserPlaylistsView(this.pageContent, this.user.id);
		await myPlaylistsView.render();

		if (this.user.id === userStore.storage.user.id) {
			await this.renderFavorites();
		}
	}

	async renderFavorites() {
		const trackListAPI = new TrackListAPI({ favorite: true });
		const trackListView = new TrackListView(this.pageContent, { favorite: true });
		const tracks = await trackListAPI.get();

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
