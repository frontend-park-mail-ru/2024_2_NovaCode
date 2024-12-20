import { TrackListAPI } from "../../../widgets/trackList/index.js";
import { ArtistCarouselAPI} from "../../../widgets/artistCarousel/index.js";
import { ListenBlockView } from "../../../widgets/listenBlock/index.js";
import { TrackListView } from "../../../widgets/trackList/index.js";
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

// export class FeedPage {
//   /**
//    * Creates an instance of the View class.
//    */
//   constructor() {
//     this.parent = document.querySelector("#root");
//   }

//   async render() {
//     await userStore.checkAuth();
//     if (!userStore.isAuth()) {
//       return;
//     }

//     this.parent.innerHTML = "";

//     if (!csatStore.submitted()) {
//       const iframe = new CSATWindow();
//       await iframe.render();
//     }

//     this.pageContent = document.createElement("div");
//     this.pageContent.classList.add("page_content");
//     this.parent.appendChild(this.pageContent);

//     const listenBlockView = new ListenBlockView(this.pageContent);
//     await listenBlockView.render();

//     const trackListAPI = new TrackListAPI();
//     const trackListView = new TrackListView(this.pageContent);
//     const tracks = await trackListAPI.get();
//     await trackListView.render(tracks.slice(0, 5));

//     player.addTracks(tracks);
//     if (userStore.storage.user.isAuthorized) {
//       eventBus.emit("showPlayer");
//     } else {
//       eventBus.emit("hidePlayer");
//     }

//     const artistCarouselAPI = new ArtistCarouselAPI();
//     const artistCarouselView = new ArtistCarouselView(this.pageContent);
//     const artists = await artistCarouselAPI.get();
//     await artistCarouselView.render(artists);

//     const playlistListAPI = new PlaylistListAPI();
//     const playlistListView = new PlaylistListView(this.pageContent);
//     const playlists = await playlistListAPI.get();
//     await playlistListView.render(playlists.slice(0, 5));
//   }
// }

export class FeedPage {
  constructor() {
    this.parent = document.querySelector("#root");
    this.abortController = null;
  }

  async render() {
    await userStore.checkAuth();
    if (!userStore.isAuth()) {
      return;
    }

    this.parent.innerHTML = "";

    if (!csatStore.submitted()) {
      const iframe = new CSATWindow();
      await this.renderWithAbort(iframe.render());
    }

    this.pageContent = document.createElement("div");
    this.pageContent.classList.add("page_content");
    this.parent.appendChild(this.pageContent);

    const listenBlockView = new ListenBlockView(this.pageContent);
    await this.renderWithAbort(listenBlockView.render());

    const trackListAPI = new TrackListAPI();
    const trackListView = new TrackListView(this.pageContent);
    const tracks = await trackListAPI.get();
    await this.renderWithAbort(trackListView.render(tracks.slice(0, 5)));

    player.addTracks(tracks);
    if (userStore.storage.user.isAuthorized) {
      eventBus.emit("showPlayer");
    } else {
      eventBus.emit("hidePlayer");
    }

    const artistCarouselAPI = new ArtistCarouselAPI();
    const artistCarouselView = new ArtistCarouselView(this.pageContent);
    const artists = await artistCarouselAPI.get();
    await this.renderWithAbort(artistCarouselView.render(artists));

    const playlistListAPI = new PlaylistListAPI();
    const playlistListView = new PlaylistListView(this.pageContent);
    const playlists = await playlistListAPI.get();
    await this.renderWithAbort(playlistListView.render(playlists.slice(0, 5)));
  }

  async renderWithAbort(promise) {
    if (this.abortController) {
      this.abortController.abort('Cancelled due to new render');
    }
    this.abortController = new AbortController();

    try {
      await promise;
    } catch (e) {
      if (e.name === 'AbortError') {
        console.log('Rendering aborted:', e.message);
      } else {
        throw e;
      }
    }

    this.abortController = null;
  }
}