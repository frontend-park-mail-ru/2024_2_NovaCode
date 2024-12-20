import { userStore } from "../../../entities/user/index.js";
import { eventBus } from "../../../shared/lib/eventbus.js";
import { AlbumListAPI } from "../../../widgets/albumList/index.js";
import { AlbumListView } from "../../../widgets/albumList/index.js";
import { player } from "../../../shared/player/model/store.js";

export class MoreAlbumsPage {
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
    } else if (this.entity === "favorite") {
      this.favorite = true;
    }

    this.pageContent = document.createElement("div");
    this.pageContent.classList.add("page_content");
    this.parent.appendChild(this.pageContent);

    const albumListAPI = new AlbumListAPI(this.artistId);
    let albums = !this.favorite
      ? await albumListAPI.get()
      : await albumListAPI.getFavorite(this.entityId);

    const albumListView = new AlbumListView(this.pageContent, this.artistId);
    await albumListView.render(albums, this.favorite);

    if (userStore.storage.user.isAuthorized && player.isReady()) {
      eventBus.emit("showPlayer");
    } else {
      eventBus.emit("hidePlayer");
    }
  }
}
