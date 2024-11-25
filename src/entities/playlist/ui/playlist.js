import { eventBus } from "../../../shared/lib/index.js";
import { S3_BUCKETS } from "../../../shared/lib/index.js";
import template from "./playlist.hbs";
import "./playlist.scss";

export class PlaylistView {
  /**
   * The parent HTML element.
   * @type {HTMLElement}
   */
  parent;

  /**
   * Initializes the PlaylistView.
   *
   */
  constructor(parent) {
    this.parent = parent ?? document.querySelector("#root");

    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);
  }

  /**
   * Renders the playlist preview.
   */
  render(playlist) {
    this.playlistId = playlist.id;

    if (!playlist.image) {
      playlist.image = `${S3_BUCKETS.PLAYLIST_IMAGES}/default.jpeg`;
    }

    const playlistElement = document.createElement("div");
    playlistElement.classList.add("playlist");
    playlistElement.setAttribute("data-playlist-id", this.playlistId);
    playlistElement.innerHTML = template(playlist);
    this.parent.appendChild(playlistElement);
    this.bindEvents();
  }

  bindEvents() {
    const playlist = this.parent.querySelector(
      `[data-playlist-id="${this.playlistId}"]`,
    );
    playlist?.addEventListener("click", this.handlePlaylistClick);
  }

  handlePlaylistClick() {
    eventBus.emit("navigate", `/playlist/${this.playlistId}`);
  }

  destructor() {
    const playlist = this.parent.querySelector(
      `[data-playlist-id="${this.playlistId}"]`,
    );
    if (playlist) {
      playlist.removeEventListener("click", this.handlePlaylistClick);
    }
  }
}
