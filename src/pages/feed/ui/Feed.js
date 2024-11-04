import { TrackListAPI } from '../../../widgets/trackList/index.js';
import { ListenBlockView } from '../../../widgets/listenBlock/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { ArtistCarouselView } from '../../../widgets/artistCarousel/index.js';
import { FooterPlayerView } from '../../../widgets/footerPlayer/index.js';
import { userStore } from '../../../entities/user/model/store.js';
import { player } from '../../../shared/player/model/store.js';

export class FeedPage {
  /**
   * Creates an instance of the View class.
   */
  constructor() {
    this.parent = document.querySelector("#root");
  }

  async render() {
    this.parent.innerHTML = "";

	const trackListAPI = new TrackListAPI();
	const listenBlockView = new ListenBlockView(this.parent);
	const trackListView = new TrackListView(this.parent);
	const artistCarouselView = new ArtistCarouselView(this.parent);
	const footPlayerView = new FooterPlayerView(this.parent);

    const tracks = await trackListAPI.get();
    player.setTracks(tracks);

	await listenBlockView.render();
	await trackListView.render(tracks);
	await artistCarouselView.render();

    const user = userStore.loadUser();
    if (user) {
      await footPlayerView.render();
    }
  }
}
