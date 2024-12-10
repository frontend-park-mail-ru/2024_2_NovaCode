import { TrackListAPI } from '../../../widgets/trackList/index.js';
import { AlbumCardView } from '../../../widgets/albumCard/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { player } from '../../../shared/player/model/store.js';
import { userStore } from '../../../entities/user/index.js';
import { eventBus } from '../../../shared/lib/eventbus.js';

export class AlbumPage {
  /**
   * Creates an instance of the View class.
   */
  constructor(params) {
    this.parent = document.querySelector('#root');
    this.albumId = params['albumId'];
  }

  async render() {
    this.parent.innerHTML = '';

		this.pageContent = document.createElement('div');
		this.pageContent.classList.add('page_content');
		this.parent.appendChild(this.pageContent);

		const albumCardView = new AlbumCardView(this.pageContent, this.albumId);
		await albumCardView.render();

		const trackListAPI = new TrackListAPI({albumId: this.albumId});
		const tracks = await trackListAPI.get();
		const trackListView = new TrackListView(this.pageContent, {albumId: this.albumId});
		await trackListView.render(tracks);

    player.addTracks(tracks);
    if (userStore.storage.user.isAuthorized) {
      eventBus.emit('showPlayer');
    } else {
      eventBus.emit('hidePlayer');
    }
  }
}
