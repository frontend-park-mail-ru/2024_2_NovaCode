import { TrackListAPI } from "../../../widgets/trackList/index.js";
import { ArtistCarouselAPI } from "../../../widgets/artistCarousel/index.js";
import { ListenBlockView } from "../../../widgets/listenBlock/index.js";
import { TrackListView } from "../../../widgets/trackList/index.js";
import { GenresTable } from "../../../widgets/genresTable/index.js";
import { ArtistCarouselView } from "../../../widgets/artistCarousel/index.js";
import {
  PlaylistListAPI,
  PlaylistListView,
} from "../../../widgets/playlistList/index.js";

import { player } from "../../../shared/player/model/store.js";
import { CSATWindow } from "../../../widgets/csatWindow/ui/csatWindow.js";
import { userStore } from "../../../entities/user/index.js";
import { eventBus } from "../../../shared/lib/eventbus.js";
import { csatStore } from "../../../entities/csat/index.js";
import { PlaylistCarouselAPI, PlaylistCarouselView } from "../../../widgets/playlistCarousel/index.js";

export class FeedPage {
  /**
   * Creates an instance of the View class.
   */
  constructor() {
    this.parent = document.querySelector("#root");
  }

  async render() {
    await userStore.checkAuth();
    if (!userStore.isAuth()) {
      return;
    }

    this.parent.innerHTML = "";

    if (csatStore.shouldShow()) {
      const iframe = new CSATWindow();
      await iframe.render();
    }

    this.pageContent = document.createElement("div");
    this.pageContent.classList.add("page_content");
    this.parent.appendChild(this.pageContent);

    const listenBlockView = new ListenBlockView(this.pageContent);
    await listenBlockView.render();

    const trackListAPI = new TrackListAPI();
    const trackListView = new TrackListView(this.pageContent);
    const tracks = await trackListAPI.get();
    await trackListView.render(tracks.slice(0, 5));

    player.addTracks(tracks);
    if (userStore.storage.user.isAuthorized) {
      eventBus.emit("showPlayer");
    } else {
      eventBus.emit("hidePlayer");
    }

    const genresTable = new GenresTable(this.pageContent);
    await genresTable.render();

    const artistCarouselAPI = new ArtistCarouselAPI();
    const artistCarouselView = new ArtistCarouselView(this.pageContent);
    const artists = await artistCarouselAPI.get();
    await artistCarouselView.render(artists);

    const playlistCarouselView = new PlaylistCarouselView(this.pageContent);
    await playlistCarouselView.render();
  }
}
