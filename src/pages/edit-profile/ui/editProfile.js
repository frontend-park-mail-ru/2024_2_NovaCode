import { UploadAvatarView } from "../../../widgets/uploadAvatar/index.js";
import { EditUserView } from "../../../widgets/editUser/index.js";
import { userStore } from "../../../entities/user/index.js";
import { PUBLIC_ERRORS } from "../../../shared/lib/index.js";
import { eventBus } from "../../../shared/lib/index.js";

export class EditProfilePage {
  parent;
  username;

  constructor(params) {
    this.parent = document.querySelector("#root");
    this.username = params["username"];
  }

  async render() {
    this.parent.innerHTML = "";

    if (!userStore.isAuth()) {
      console.error(PUBLIC_ERRORS.UNAUTHORIZED);
      eventBus.emit("navigate", "/");
      return;
    }

    const user = userStore.storage.user;

    if (user.username != this.username) {
      console.error(PUBLIC_ERRORS.FORBIDDEN);
      eventBus.emit("navigate", "/");
      return;
    }

    const uploadAvatarView = new UploadAvatarView(this.parent, user.id);
    await uploadAvatarView.render();

    const editUserView = new EditUserView(this.parent, user.id);
    await editUserView.render();
  }
}
