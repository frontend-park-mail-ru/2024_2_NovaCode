import { eventBus } from "../../../shared/lib/eventbus.js";
import { PlaylistCardAPI } from "../api/api.js";
import { S3_BUCKETS } from "../../../shared/lib/index.js";
import template from "./playlistCard.hbs";
import * as styles from "./playlistCard.scss";
import { UserPlaylistsAPI } from "../../userPlaylists/index.js";
import { userStore } from "../../../entities/user/index.js";
import { BASE_URL } from "../../../shared/config/api.js";
import { ShareModal } from "../../shareModal/index.js";
import heartIcon from "../../../../public/images/icons/heart.svg";
import playCircleIcon from "../../../../public/images/icons/play-circle.svg";
import musicSquareRemoveIcon from "../../../../public/images/icons/music-square-remove.svg";
import sendSquareWhiteIcon from "../../../../public/images/icons/send-square-white.svg";
import { ImageUploaderView } from "../../imageUploader/index.js";
import { playlistAPI } from "../../../entities/playlist/api/api.js";

export class PlaylistCardView {
  /**
   * The parent HTML element.
   * @type {HTMLElement}
   */
  parent;
  playlistId;

  /**
   * Initializes the PlaylistCardView.
   *
   */
  constructor(parent, playlistId) {
    this.parent = parent ?? document.querySelector("#root");
    this.playlistId = playlistId;
  }

  /**
   * Renders the playlist view.
   */
  async render() {
    const playlistCardAPI = new PlaylistCardAPI(this.playlistId);
    this.api = playlistCardAPI;

    let playlist = await playlistCardAPI.get();
    if (playlist.image) {
      playlist.image = `${S3_BUCKETS.PLAYLIST_IMAGES}/${playlist.image}`;
    } else {
      playlist.image = `${S3_BUCKETS.PLAYLIST_IMAGES}/default.webp`;
    }

    const playlistLikesCount = (await playlistCardAPI.GetPlaylistLikesCount(this.playlistId))?.count;

    const playlistCardElement = document.createElement("div");
    playlistCardElement.classList.add("playlist_card");

    const myPlaylistsAPI = new UserPlaylistsAPI(userStore.storage.user.id);
    const myPlaylists = await myPlaylistsAPI.get();
    this.isMyPlaylist = false;
    Array.from(myPlaylists).forEach((playlist) => {
      if (playlist.id == this.playlistId) {
        this.isMyPlaylist = true;
      }
    });
    playlistCardElement.innerHTML = template({
      styles,
      playlist,
      isMyPlaylist: this.isMyPlaylist,
      heartIcon,
      playCircleIcon,
      musicSquareRemoveIcon,
      sendSquareWhiteIcon,
      playlistLikesCount
    });
    this.parent.appendChild(playlistCardElement);

    await this.getElements();
    this.addEvents();
    this.onEvents();

    const isFavorite = await this.api.isFavorite(this.playlistId);
    if (userStore.storage.user.isAuthorized && isFavorite) {
      this.subscribeBtn.classList.add(styles["playlist__liked"]);
    }

    this.imageUploaderView = new ImageUploaderView({
			parent: document.querySelector(".image_uploader"),
			uploadFunction: (formData) =>
				playlistAPI.updateImage(playlist.id, formData),
			onSuccessEvent: 'updatePlaylistImageSuccess',
      navigateUrl: `/playlist/${playlist.id}`,
		});
		await this.imageUploaderView.render();
  }

  async getElements() {
    this.playPauseBtn = document.querySelector(".buttons__listen");
    this.deleteBtn = document.querySelector(`.${styles["buttons__delete"]}`);
    this.shareBtn = document.querySelector(".buttons__share");
    this.subscribeBtn = document.querySelector(".buttons__like");
  }

  addEvents() {
    this.playPauseBtn.addEventListener("click", this.handlePlayPauseBtn);
    this.deleteBtn?.addEventListener("click", this.deletePlaylist);
    this.shareBtn.addEventListener("click", this.handleShareBtn);
    this.subscribeBtn.addEventListener("click", this.handleSubscribe);
  }

  onEvents() {
    eventBus.on("playlist:deleted", this.handlePlaylistDeleted);
  }

  deleteEvents() {
    this.playPauseBtn.removeEventListener("click", this.handlePlayPauseBtn);
    this.deleteBtn?.removeEventListener("click", this.deletePlaylist);
    this.shareBtn.removeEventListener("click", this.handleShareBtn);
    this.shareBtn.removeEventListener("click", this.handleShareBtn);
  }

  handlePlaylistDeleted() {
    const user = userStore.storage.user;
    eventBus.emit("navigate", `/profiles/${user.username}`);
  }

  deletePlaylist = () => {
    const myPlaylistAPI = new PlaylistCardAPI(this.playlistId);
    myPlaylistAPI.delete();
    eventBus.emit("playlist:deleted");
  };

  handlePlayPauseBtn() {
    eventBus.emit("playPauseTrack");
  }

  handleShareBtn = () => {
    const url = `${BASE_URL}/playlist/${this.playlistId}`;

    const shareModal = new ShareModal(document.querySelector("#root"));
    shareModal.render(url);
  };

  handleSubscribe = async () => {
    const isFavorite = await this.api.isFavorite(this.playlistId);
    if (userStore.storage.user.isAuthorized && isFavorite) {
      this.api.deleteFavorite(this.playlistId);
      this.subscribeBtn.classList.remove(styles["playlist__liked"]);
    } else {
      this.api.addFavorite(this.playlistId);
      this.subscribeBtn.classList.add(styles["playlist__liked"]);
    }
  };

  destructor() {
    this.deleteEvents();
  }
}
