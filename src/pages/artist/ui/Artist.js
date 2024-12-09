import { TrackListAPI } from '../../../widgets/trackList/index.js';
import { ArtistCardView } from '../../../widgets/artistCard/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { AlbumCarouselView } from '../../../widgets/albumCarousel/index.js';
import { player } from '../../../shared/player/model/store.js';
import { eventBus } from '../../../shared/lib/eventbus.js';
import { userStore } from '../../../entities/user/index.js';

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

    const trackListAPI = new TrackListAPI({ artistId: this.artistId });
    const tracks = await trackListAPI.get();
    const trackListView = new TrackListView(this.parent, {
      artistId: this.artistId,
    });
    await trackListView.render(tracks.slice(0, 5));

    player.addTracks(tracks);
    if (userStore.storage.user.isAuthorized) {
      eventBus.emit('showPlayer');
    } else {
      eventBus.emit('hidePlayer');
    }

    const albumCarouselView = new AlbumCarouselView(this.parent, this.artistId);
    await albumCarouselView.render();
  }
}
