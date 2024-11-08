import { userStore } from "../../../entities/user/model/store.js";
import { eventBus } from "../../../shared/lib/index.js";
import template from './uploadAvatar.hbs';
import './uploadAvatar.scss'


export class UploadAvatarView {
  parent;
  userID;

  constructor(parent, userID) {
    this.parent = parent ? parent : document.querySelector("#root");
    this.userID = userID;
  }

  async render() {
    const uploadAvatarElement = document.createElement("div");
    uploadAvatarElement.classList.add("upload_avatar");
    uploadAvatarElement.innerHTML = template({});
    this.parent.appendChild(uploadAvatarElement);

    this.bindEvents();
    this.onEvents();
  }

  onEvents() {
    eventBus.on("updateAvatarSuccess", this.handleSuccess);
  }

  offEvents() {
    eventBus.off("updateAvatarSuccess", this.handleSuccess);
  }

  destructor() {
    this.offEvents();
    const form = document.querySelector("#edit-user-form");
    if (form) {
      form.removeEventListener("submit", this.handleSubmit);
    }
  }

  bindEvents() {
    const form = document.querySelector("#upload-avatar-form");
    if (form) {
      form.addEventListener("submit", this.handleSubmit.bind(this));
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const fileInput = document.querySelector("#avatar");
    if (!fileInput.files.length) {
      console.error("no file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      await userStore.updateAvatar(this.userID, formData);
    } catch (error) {
      console.error("failed to update avatar:", error);
    }
  }

  handleSuccess() {
    const user = userStore.storage.user;
    eventBus.emit("navigate", `/profiles/${user.username}`);
  }
}
