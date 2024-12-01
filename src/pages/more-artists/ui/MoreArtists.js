import { userStore } from '../../../entities/user/index.js';
import { eventBus } from '../../../shared/lib/eventbus.js';
import { ArtistListAPI } from '../../../widgets/artistList/index.js';
import { ArtistListView } from '../../../widgets/artistList/index.js';

export class MoreArtistsPage {
  /**
   * Creates an instance of the View class.
   */
  constructor() {
    this.parent = document.querySelector('#root');
  }

  async render() {
    this.parent.innerHTML = '';

    const artistListAPI = new ArtistListAPI();
    const artists = await artistListAPI.get();
    const artistListView = new ArtistListView(this.parent);
    await artistListView.render(artists);
    if (userStore.storage.user.isAuthorized) {
      eventBus.emit('showPlayer');
    } else {
      eventBus.emit('hidePlayer');
    }
  }
}
