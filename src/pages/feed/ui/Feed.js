import { TrackListAPI } from "../../../widgets/trackList/index.js";
import { ArtistListAPI } from "../../../widgets/artistList/index.js";
import { ListenBlockView } from "../../../widgets/listenBlock/index.js";
import { TrackListView } from "../../../widgets/trackList/index.js";
import { ArtistListView } from "../../../widgets/artistList/index.js";
import { FooterPlayerView } from "../../../widgets/footerPlayer/index.js";
import { userStore } from "../../../entities/user/model/store.js";
import { player } from "../../../shared/player/model/store.js";

export class FeedPage {
  /**
   * Creates an instance of the View class.
   */
  constructor() {
    this.parent = document.querySelector("#root");
  }

  async render() {
    this.parent.innerHTML = "";

    const listenBlockView = new ListenBlockView(this.parent);
    await listenBlockView.render();
    
    const trackListAPI = new TrackListAPI();
    const trackListView = new TrackListView(this.parent);
    const tracks = await trackListAPI.get();
    await trackListView.render(tracks.slice(0, 5));

    const artistListAPI = new ArtistListAPI();
    const artistListView = new ArtistListView(this.parent);
    const artists = await artistListAPI.get();
    await artistListView.render(artists.slice(0, 5));

    player.setTracks(tracks);

    const footPlayerView = new FooterPlayerView(this.parent);
    const user = userStore.loadUser();
    if (user) {
      await footPlayerView.render();
    }
  }
}
