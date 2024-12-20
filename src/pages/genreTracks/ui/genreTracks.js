import { TrackListView } from "../../../widgets/trackList/index.js";
import { GenreTracksAPI } from "../api/api.js";
import { ErrorView } from "../../../widgets/error/index.js";
import { player } from "../../../shared/player/model/store.js";
import { eventBus } from "../../../shared/lib/eventbus.js";
import { userStore } from "../../../entities/user/index.js";

export class GenreTracksPage {
  /**
   * Creates an instance of the View class.
   */
  constructor(params) {
    this.parent = document.querySelector("#root");
    this.genreID = params["genreID"];
    this.api = new GenreTracksAPI();
  }

  async render() {
    this.parent.innerHTML = "";

    this.pageContent = document.createElement("div");
    this.pageContent.classList.add("page_content");
    this.parent.appendChild(this.pageContent);

    const tracks = await this.api.get(this.genreID);
    console.log(tracks);
    if (tracks.length > 0) {
      const trackListView = new TrackListView(this.pageContent);
      await trackListView.render(tracks);
      player.addTracks(tracks);
    } else {
      const errorView = new ErrorView(
        this.pageContent,
        "Пока нету треков этого жанра",
      );
      await errorView.render();
    }

    if (userStore.storage.user.isAuthorized && player.isReady()) {
      eventBus.emit("showPlayer");
    } else {
      eventBus.emit("hidePlayer");
    }
  }
}
