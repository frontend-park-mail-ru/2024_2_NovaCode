import { userStore } from '../../../entities/user/index.js';
import { FooterPlayerView } from '../../../widgets/footerPlayer/index.js';
import { PlaylistListAPI } from '../../../widgets/playlistList/index.js';
import { PlaylistListView } from '../../../widgets/playlistList/index.js';

export class MorePlaylistsPage {
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

		const playlistListAPI = new PlaylistListAPI();
		const playlists = await playlistListAPI.get();
		const playlistListView = new PlaylistListView(this.pageContent);
		await playlistListView.render(playlists, false);

		const footPlayerView = new FooterPlayerView(this.parent);
		const user = userStore.storage.user;
		if (user) {
			await footPlayerView.render();
		}
	}
}