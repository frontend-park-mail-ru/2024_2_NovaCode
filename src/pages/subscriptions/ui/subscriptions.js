import { ArtistCarouselView } from "../../../widgets/artistCarousel/index.js";
import { player } from "../../../shared/player/model/store";
import { userStore } from "../../../entities/user";
import { eventBus } from "../../../shared/lib";
import { AlbumCarouselView } from "../../../widgets/albumCarousel/index.js";
import {
  PlaylistListAPI,
  PlaylistListView,
} from "../../../widgets/playlistList/index.js";

export class SubscriptionsPage {
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

    this.pageContent = document.createElement("div");
    this.pageContent.classList.add("page_content");
    this.parent.appendChild(this.pageContent);

    const artistCarouselView = new ArtistCarouselView(this.pageContent, {
      favorite: true,
    });
    await artistCarouselView.render();

    const albumCardView = new AlbumCarouselView(this.pageContent, null, true);
    await albumCardView.render();

    const playlistListAPI = new PlaylistListAPI();
    const playlistListView = new PlaylistListView(this.pageContent);
    const playlists = await playlistListAPI.getFavorite();
    await playlistListView.render(playlists.slice(0, 5), true, true);

    if (
      userStore.storage.user.isAuthorized &&
      (player.isLoaded || player.isPlaying)
    ) {
      eventBus.emit("showPlayer");
    } else {
      eventBus.emit("hidePlayer");
    }
  }
}
