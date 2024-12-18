import { UserCardView } from "../../../widgets/userCard/index.js";
import { TrackListAPI } from "../../../widgets/trackList/index.js";
import { TrackListView } from "../../../widgets/trackList/index.js";
import { userStore } from "../../../entities/user/model/store.js";
import { player } from "../../../shared/player/model/store.js";
import { UserPlaylistsView } from "../../../widgets/userPlaylists/index.js";
import { eventBus } from "../../../shared/lib/eventbus.js";

export class ProfilePage {
  parent;
  username;

  constructor(params) {
    this.parent = document.querySelector("#root");
    this.username = params["username"];
  }

  async render() {
    this.parent.innerHTML = "";

    this.pageContent = document.createElement("div");
    this.pageContent.classList.add("page_content");
    this.parent.appendChild(this.pageContent);

    const userCardView = new UserCardView(this.pageContent, this.username);
    await userCardView.render();

    this.user = await userStore.getUser(this.username);
    await this.renderFavorites();

    const myPlaylistsView = new UserPlaylistsView(
      this.pageContent,
      this.user.id,
    );
    await myPlaylistsView.render();

    if (player.isReady() && userStore.storage.user.isAuthorized) {
      eventBus.emit("showPlayer");
    } else {
      eventBus.emit("hidePlayer");
    }
  }

  async renderFavorites() {
    const trackListAPI = new TrackListAPI({
      favorite: true,
      userID: this.user.id,
    });
    const tracks = await trackListAPI.get();
    if (!tracks) return;
    if (tracks.length > 0 && userStore.storage.user.isAuthorized) {
      const trackListView = new TrackListView(this.pageContent, {
        favorite: true,
        userID: this.user.id,
      });
      await trackListView.render(tracks.slice(0, 5));
      trackListView.setTitle("Любимые треки");
      player.addTracks(tracks);
    }
  }
}
