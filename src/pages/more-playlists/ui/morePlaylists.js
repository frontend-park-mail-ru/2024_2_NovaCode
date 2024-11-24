import { userStore } from '../../../entities/user/index.js';
import { FooterPlayerView } from '../../../widgets/footerPlayer/index.js';
import { PlaylistListAPI } from '../../../widgets/playlistList/index.js';
import { PlaylistListView } from '../../../widgets/playlistList/index.js';
import template from './morePlaylists.hbs';
import './morePlaylists.scss';

export class MorePlaylistsPage {
	/**
	 * Creates an instance of the View class.
	 */
	constructor() {
		this.parent = document.querySelector('#root');
	}

	async render() {
		this.parent.innerHTML = template();

		const playlistListAPI = new PlaylistListAPI();
		const playlists = await playlistListAPI.get();
		const playlistListView = new PlaylistListView(this.parent);
		await playlistListView.render(playlists, false);

		const footPlayerView = new FooterPlayerView(this.parent);
		const user = userStore.storage.user;
		if (user) {
			await footPlayerView.render();
		}
	}
}