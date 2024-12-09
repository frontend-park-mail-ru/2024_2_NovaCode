import { TrackListAPI } from '../../../widgets/trackList/index.js';
import { ListenBlockView } from '../../../widgets/listenBlock/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { ArtistCarouselView } from '../../../widgets/artistCarousel/index.js';
import {
  PlaylistListAPI,
  PlaylistListView,
} from '../../../widgets/playlistList/index.js';

import { player } from '../../../shared/player/model/store.js';
import { CSATWindow } from '../../../widgets/csatWindow/ui/csatWindow.js';
import { userStore } from '../../../entities/user/index.js';
import { eventBus } from '../../../shared/lib/eventbus.js';

export class FeedPage {
  /**
   * Creates an instance of the View class.
   */
  constructor() {
    this.parent = document.querySelector('#root');
  }

	async render() {
		if (!userStore.isAuth()) {
			eventBus.emit('navigate', '/signin');
			return;
		}

		this.parent.innerHTML = '';

    const iframe = new CSATWindow();
    await iframe.render();

		this.pageContent = document.createElement('div');
		this.pageContent.classList.add('page_content');
		this.parent.appendChild(this.pageContent);

		const listenBlockView = new ListenBlockView(this.pageContent);
		await listenBlockView.render();

		const trackListAPI = new TrackListAPI();
		const trackListView = new TrackListView(this.pageContent);
		const tracks = await trackListAPI.get();
		await trackListView.render(tracks.slice(0, 5));

    player.addTracks(tracks);
    if (userStore.storage.user.isAuthorized) {
      eventBus.emit('showPlayer');
    } else {
      eventBus.emit('hidePlayer');
    }

    const artistCarouselView = new ArtistCarouselView(this.pageContent);
    await artistCarouselView.render();

    const playlistListAPI = new PlaylistListAPI();
    const playlistListView = new PlaylistListView(this.pageContent);
    const playlists = await playlistListAPI.get();
    await playlistListView.render(playlists.slice(0, 5));
  }
}
