import { userStore } from "../../../entities/user/index.js";
import { eventBus } from "../../../shared/lib/eventbus.js";
import { PlaylistListAPI } from "../../../widgets/playlistList/index.js";
import { PlaylistListView } from "../../../widgets/playlistList/index.js";
import { player } from "../../../shared/player/model/store.js";

export class MorePlaylistsPage {
  /**
   * Creates an instance of the View class.
   */
  constructor(params) {
    this.parent = document.querySelector("#root");
    this.type = params["type"];
    this.entity = params["entity"];
    this.id = params["id"];
  }

  async render() {
    this.parent.innerHTML = "";

    if (this.type === "favorite" || this.entity === "favorite") {
      this.favorite = true;
    }

    this.pageContent = document.createElement("div");
    this.pageContent.classList.add("page_content");
    this.parent.appendChild(this.pageContent);

    const playlistListAPI = new PlaylistListAPI();
    let playlists = !this.favorite
      ? await playlistListAPI.get()
      : await playlistListAPI.getFavorite(this.id);

    const playlistListView = new PlaylistListView(this.pageContent);
    await playlistListView.render(playlists, false, this.favorite);

    if (userStore.storage.user.isAuthorized && player.isReady()) {
      eventBus.emit("showPlayer");
    } else {
      eventBus.emit("hidePlayer");
    }
  }
}
