import { player } from "../../../shared/player/model/store";
import { userStore } from "../../../entities/user";
import { eventBus } from "../../../shared/lib";
import { ErrorView } from "../../../widgets/error/index.js";
import { 
  AlbumCarouselView,
  AlbumCarouselAPI
} from "../../../widgets/albumCarousel/index.js";
import { 
  ArtistCarouselView, 
  ArtistCarouselAPI 
} from "../../../widgets/artistCarousel/index.js";
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

    const artistCarouselAPI = new ArtistCarouselAPI();
    const artistCarouselView = new ArtistCarouselView(this.pageContent, {
      favorite: true,
    });
    const artists = await artistCarouselAPI.getFavorite();
    if (artists) {
      await artistCarouselView.render(artists);
    }

    const albumCarouselAPI = new AlbumCarouselAPI();
    const albumCarouselView = new AlbumCarouselView(this.pageContent, null, true);
    const albums = await albumCarouselAPI.getFavorite();
    if (albums) {
      await albumCarouselView.render(albums);
    }

    const playlistListAPI = new PlaylistListAPI();
    const playlistListView = new PlaylistListView(this.pageContent);
    const playlists = await playlistListAPI.getFavorite();
    if (playlists) {
      await playlistListView.render(playlists.slice(0, 5), true, true);
    }

    if (!artists && !albums && !playlists) {
      const errorView = new ErrorView(
        this.pageContent,
        "Здесь пока нет подписок",
        "В этом разделе можно увидеть подписки на артистов, альбомы и плейлисты",
      );
      await errorView.render();
    }

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
