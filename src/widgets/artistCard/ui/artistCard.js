import { eventBus } from "../../../shared/lib/eventbus.js";
import { ArtistCardAPI } from "../api/api.js";
import { S3_BUCKETS } from "../../../shared/lib/index.js";
import template from "./artistCard.hbs";
import { ShareModal } from "../../shareModal/index.js";
import { BASE_URL } from "../../../shared/config/api.js";
import { userStore } from "../../../entities/user/index.js";
import * as styles from "./artistCard.scss";
import heartIcon from "../../../../public/images/icons/heart.svg";
import playCircleIcon from "../../../../public/images/icons/play-circle.svg";
import sendSquareWhiteIcon from "../../../../public/images/icons/send-square-white.svg";

export class ArtistCardView {
  /**
   * The parent HTML element.
   * @type {HTMLElement}
   */
  parent;

  /**
   * Initializes the ArtistCardView.
   *
   */
  constructor(parent, artistId) {
    this.parent = parent ? parent : document.querySelector("#root");
    this.artistId = artistId;
  }

  /**
   * Renders the artist view.
   */
  async render() {
    const artistCardAPI = new ArtistCardAPI(this.artistId);
    this.api = artistCardAPI;

    let [artist, genres] = await artistCardAPI.get();
    if (artist.image) {
      artist.image = `${S3_BUCKETS.ARTIST_IMAGES}/${artist.image}`;
    }

    const artistLikesCount = (await artistCardAPI.GetArtistLikesCount(this.artistId))?.count;

    const artistCardElement = document.createElement("div");
    artistCardElement.classList.add("artist_card");
    artistCardElement.innerHTML = template({
      styles,
      artist,
      genres,
      heartIcon,
      playCircleIcon,
      sendSquareWhiteIcon,
      artistLikesCount
    });
    this.parent.appendChild(artistCardElement);

    await this.getElements();
    this.addEvents();

    const isFavorite = await this.api.isFavorite(this.artistId);
    if (userStore.storage.user.isAuthorized && isFavorite) {
      this.subscribeBtn.classList.add(styles["artist__liked"]);
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
  }

  deleteEvents() {
    this.playPauseBtn.removeEventListener("click", this.handlePlayPauseBtn);
    this.subscribeBtn.removeEventListener("click", this.handleSubscribe);
    this.shareBtn.addEventListener("click", this.handleShareBtn);
  }

  handlePlayPauseBtn() {
    eventBus.emit("playPauseTrack");
  }

  handleShareBtn = () => {
    const url = `${BASE_URL}/artist/${this.artistId}`;

    const shareModal = new ShareModal(document.querySelector("#root"));
    shareModal.render(url);
  };

  handleSubscribe = async () => {
    const isFavorite = await this.api.isFavorite(this.artistId);
    if (userStore.storage.user.isAuthorized && isFavorite) {
      this.api.deleteFavorite(this.artistId);
      this.subscribeBtn.classList.remove(styles["artist__liked"]);
    } else {
      this.api.addFavorite(this.artistId);
      this.subscribeBtn.classList.add(styles["artist__liked"]);
    }
  };

  destructor() {
    this.deleteEvents();
  }
}
