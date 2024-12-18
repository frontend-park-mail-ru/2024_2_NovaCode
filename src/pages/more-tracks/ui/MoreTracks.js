import { TrackListAPI } from "../../../widgets/trackList/index.js";
import { TrackListView } from "../../../widgets/trackList/index.js";
import { userStore } from "../../../entities/user/model/store.js";
import { player } from "../../../shared/player/model/store.js";
import { eventBus } from "../../../shared/lib/eventbus.js";

export class MoreTracksPage {
  /**
   * Creates an instance of the View class.
   */
  constructor(params) {
    this.parent = document.querySelector("#root");
    this.type = params["type"];
    this.entity = params["entity"];
    this.entityId = params["id"];
  }

  async render() {
    this.parent.innerHTML = "";

    if (this.entity === "artist") {
      this.artistId = this.entityId;
    } else if (this.entity === "album") {
      this.albumId = this.entityId;
    } else if (this.entity === "favorite") {
      this.favorite = true;
    }

    this.pageContent = document.createElement("div");
    this.pageContent.classList.add("page_content");
    this.parent.appendChild(this.pageContent);

    const trackListAPI = new TrackListAPI({
      artistId: this.artistId,
      albumId: this.albumId,
      favorite: this.favorite,
      userID: this.entityId,
    });
    const trackListView = new TrackListView(this.pageContent, {
      artistId: this.artistId,
      albumId: this.albumId,
      favorite: this.favorite,
    });
    const tracks = await trackListAPI.get();
    await trackListView.render(tracks, false);

    player.addTracks(tracks);
    if (userStore.storage.user.isAuthorized) {
      eventBus.emit("showPlayer");
    } else {
      eventBus.emit("hidePlayer");
    }
  }
}
