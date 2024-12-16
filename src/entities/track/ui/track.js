import { BASE_URL } from "../../../shared/config/api.js";
import { eventBus } from "../../../shared/lib/eventbus.js";
import { S3_BUCKETS } from "../../../shared/lib/index.js";
import { FooterPlayerAPI } from "../../../widgets/footerPlayer/api/api.js";
import { ShareModal } from "../../../widgets/shareModal/index.js";
import {
  TrackInPlaylistAPI,
  TrackInPlaylistModal,
} from "../../../widgets/trackInPlaylist/index.js";
import { userStore } from "../../user/index.js";
import template from "./track.hbs";
import * as styles from "./track.scss";
import trashIcon from "../../../../public/images/icons/trash.svg";
import heartBlackIcon from "../../../../public/images/icons/heart-black.svg";
import addIcon from "../../../../public/images/icons/add.svg";
import sendSquareBlackIcon from "../../../../public/images/icons/send-square-black.svg";

export class TrackView {
  /**
   * The parent HTML element.
   * @type {HTMLElement}
   */
  parent;

  /**
   * Initializes the TrackView.
   *
   */
  constructor(parent, index) {
    this.parent = parent ?? document.querySelector("#root");
    this.trackIndex = index;
    this.footerPlayerAPI = new FooterPlayerAPI();
  }

  /**
   * Renders the track view.
   */
  async render(track, myPlaylistId = null) {
    this.myPlaylistId = myPlaylistId;
    this.track = track;
    if (track.image) {
      track.image = `${S3_BUCKETS.TRACK_IMAGES}/${track.image}`;
    }

    const user = userStore.storage.user;

    this.trackElement = document.createElement("div");
    this.trackElement.classList.add(styles["track"]);
    this.trackElement.setAttribute("data-track-id", track.id);
    let isMyPlaylist = this.myPlaylistId ? true : false;
    let isFavorite = await this.footerPlayerAPI.isFavorite(this.track.id);
    this.trackElement.innerHTML = template({
      styles,
      track,
      user,
      isMyPlaylist,
      isFavorite,
      trashIcon,
      heartBlackIcon,
      addIcon,
      sendSquareBlackIcon,
    });
    this.parent.appendChild(this.trackElement);

    await this.getElements();

    this.addEvents();
  }

  async getElements() {
    this.addBtn = this.trackElement.querySelector(
      `.${styles["track__add-btn"]}`,
    );
    this.deleteBtn = this.trackElement.querySelector(
      `.${styles["track__delete-btn"]}`,
    );
    this.likeBtn = this.trackElement.querySelector(
      `.${styles["track__like-btn"]}`,
    );
    this.shareBtn = this.trackElement.querySelector(
      `.${styles["track__share-btn"]}`,
    );
  }

  addEvents() {
    this.trackElement.addEventListener("click", this.bindTrack);

    const links = this.trackElement.querySelectorAll(".link");
    links.forEach((link) => {
      link.addEventListener("click", (event) => this.handleLink(event));
    });

    this.addBtn.addEventListener("click", this.handleTrackAdd);
    this.deleteBtn?.addEventListener("click", this.handleTrackDelete);
    this.likeBtn.addEventListener("click", this.handleLikeTrackBtn);
    this.shareBtn.addEventListener("click", this.handleTrackShare);
  }

  handleTrackAdd = (event) => {
    const trackInPlaylistModal = new TrackInPlaylistModal(
      this.parent,
      this.track.id,
    );
    trackInPlaylistModal.render();
    event.stopPropagation();
  };

  handleTrackDelete = (event) => {
    const trackInPlaylistAPI = new TrackInPlaylistAPI(this.myPlaylistId);
    trackInPlaylistAPI.deleteTrack(this.track.id);
    this.trackElement.remove();
    event.stopPropagation();
  };

  handleLikeTrackBtn = async (event) => {
    event.stopPropagation();
    const user = userStore.storage.user;
    if (!user.isAuthorized) {
      eventBus.emit("navigate", "/signin");
      return;
    }

    const isFavorite = await this.footerPlayerAPI.isFavorite(this.track.id);
    if (user.isAuthorized && isFavorite) {
      this.footerPlayerAPI.deleteFavorite(this.track.id);
      this.likeBtn.classList.remove(styles["track__liked"]);
    } else {
      this.footerPlayerAPI.addFavorite(this.track.id);
      this.likeBtn.classList.add(styles["track__liked"]);
    }
  };

  handleTrackShare = (event) => {
    event.stopPropagation();

    const url = `${BASE_URL}/album/${this.track.albumID}/track/${this.track.id}`;

    const shareModal = new ShareModal(document.querySelector("#root"));
    shareModal.render(url);
  };

  deleteEvents() {
    this.trackElement.removeEventListener("click", this.bindTrack);

    const links = this.trackElement.querySelectorAll(".link");
    links.forEach((link) => {
      link.removeEventListener("click", (event) => this.handleLink(event));
    });
    this.addBtn.removeEventListener("click", this.handleTrackAdd);
    this.deleteBtn?.removeEventListener("click", this.handleTrackDelete);
    this.likeBtn.removeEventListener("click", this.handleLikeTrackBtn);
    this.shareBtn.removeEventListener("click", this.handleTrackShare);
  }

  bindTrack = () => {
    eventBus.emit("reloadTracks");
    eventBus.emit("playById", this.trackIndex);
  };

  handleLink(event) {
    event.preventDefault();
    event.stopPropagation();
    const href = event.target.getAttribute("href");
    eventBus.emit("navigate", href);
  }

  destructor() {
    this.deleteEvents();
  }
}
