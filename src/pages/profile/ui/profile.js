import { userStore } from "../../../entities/user/index.js";
import { UserCardView } from "../../../widgets/userCard/index.js";
import { UserPlaylistsView } from "../../../widgets/userPlaylists/index.js";

export class ProfilePage {
  parent;
  username;

  constructor(params) {
    this.parent = document.querySelector("#root");
    this.username = params["username"];
  }

  async render() {
    this.parent.innerHTML = "";

    const userCardView = new UserCardView(this.parent, this.username);
    await userCardView.render();

    this.user = await userStore.getUser(this.username);
    const myPlaylistsView = new UserPlaylistsView(this.parent, this.user.id);
    await myPlaylistsView.render();
  }
}
