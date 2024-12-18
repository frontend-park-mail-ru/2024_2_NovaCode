import { eventBus } from "../../../shared/lib/eventbus.js";
import { AlbumCardAPI } from "../api/api.js";
import { S3_BUCKETS } from "../../../shared/lib/index.js";
import template from "./albumCard.hbs";
import { BASE_URL } from "../../../shared/config/api.js";
import { ShareModal } from "../../shareModal/index.js";
import * as styles from "./albumCard.scss";
import subIcon from "../../../../public/images/icons/sub.svg";
import playCircleIcon from "../../../../public/images/icons/play-circle.svg";
import sendSquareWhiteIcon from "../../../../public/images/icons/send-square-white.svg";
import { userStore } from "../../../entities/user/index.js";

export class AlbumCardView {
  /**
   * The parent HTML element.
   * @type {HTMLElement}
   */
  parent;

  /**
   * Initializes the AlbumCardView.
   *
   */
  constructor(parent, albumId) {
    this.parent = parent ?? document.querySelector("#root");
    this.albumId = albumId;
  }

  /**
   * Renders the playlist view.
   */
  async render() {
    const albumCardAPI = new AlbumCardAPI(this.albumId);
    this.api = albumCardAPI;

    let album = await albumCardAPI.get();
    album.release = new Date(album.release).getFullYear();

    if (album.image) {
      album.image = `${S3_BUCKETS.ALBUM_IMAGES}/${album.image}`;
    }

    const albumLikesCount = (await albumCardAPI.GetAlbumLikesCount(this.albumId))?.albumLikesCount;

    this.albumCardElement = document.createElement("div");
    this.albumCardElement.classList.add("album_card");
    this.albumCardElement.innerHTML = template({
      styles,
      album,
      subIcon,
      playCircleIcon,
      sendSquareWhiteIcon,
      albumLikesCount
    });
    this.parent.appendChild(this.albumCardElement);

    await this.getElements();
    this.addEvents();

    const isFavorite = await this.api.isFavorite(this.albumId);
    if (userStore.storage.user.isAuthorized && isFavorite) {
      this.subscribeBtn.classList.add(styles["album__liked"]);
    }
  }

  async getElements() {
    this.playPauseBtn = document.querySelector(".buttons__listen");
    this.subscribeBtn = document.querySelector(".buttons__subscribe");
    this.shareBtn = document.querySelector(".buttons__share");
  }

  addEvents() {
    this.playPauseBtn.addEventListener("click", this.handlePlayPauseBtn);
    this.subscribeBtn.addEventListener("click", this.handleSubscribe);
    this.shareBtn.addEventListener("click", this.handleShareBtn);

    const links = this.albumCardElement.querySelectorAll(".link");
    links.forEach((link) => {
      link.addEventListener("click", (event) => this.handleLink(event));
    });
  }

  deleteEvents() {
    this.playPauseBtn.removeEventListener("click", this.handlePlayPauseBtn);
    this.subscribeBtn.removeEventListener("click", this.handleSubscribe);
    this.shareBtn.removeEventListener("click", this.handleShareBtn);

    const links = this.parent.querySelectorAll(".link");
    links.forEach((link) => {
      link.removeEventListener("click", (event) => this.handleLink(event));
    });
  }

  handlePlayPauseBtn() {
    eventBus.emit("playPauseTrack");
  }

  handleShareBtn = () => {
    const url = `${BASE_URL}/album/${this.albumId}`;

    const shareModal = new ShareModal(document.querySelector("#root"));
    shareModal.render(url);
  };

  handleSubscribe = async () => {
    const isFavorite = await this.api.isFavorite(this.albumId);
    if (userStore.storage.user.isAuthorized && isFavorite) {
      this.api.deleteFavorite(this.albumId);
      this.subscribeBtn.classList.remove(styles["album__liked"]);
    } else {
      this.api.addFavorite(this.albumId);
      this.subscribeBtn.classList.add(styles["album__liked"]);
    }
  };

  handleLink(event) {
    event.preventDefault();
    const href = event.target.getAttribute("href");
    eventBus.emit("navigate", href);
  }

  destructor() {
    this.deleteEvents();
  }
}
