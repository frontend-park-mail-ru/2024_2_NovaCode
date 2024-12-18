import { userStore } from "../../../entities/user/index.js";
import { eventBus } from "../../../shared/lib/eventbus.js";
import { ArtistListAPI } from "../../../widgets/artistList/index.js";
import { ArtistListView } from "../../../widgets/artistList/index.js";
import { player } from "../../../shared/player/model/store.js";

export class MoreArtistsPage {
  /**
   * Creates an instance of the View class.
   */
  constructor(params) {
    this.parent = document.querySelector("#root");
    this.type = params["entity"];
    this.id = params["id"];
  }

  async render() {
    this.parent.innerHTML = "";

    if (this.type === "favorite") {
      this.favorite = true;
    }

    this.pageContent = document.createElement("div");
    this.pageContent.classList.add("page_content");
    this.parent.appendChild(this.pageContent);

    const artistListAPI = new ArtistListAPI();
    let artists = !this.favorite
      ? await artistListAPI.get()
      : await artistListAPI.getFavorite(this.id);

    const artistListView = new ArtistListView(this.pageContent);
    await artistListView.render(artists, this.favorite);

    if (userStore.storage.user.isAuthorized && player.isReady()) {
      eventBus.emit("showPlayer");
    } else {
      eventBus.emit("hidePlayer");
    }
  }
}
