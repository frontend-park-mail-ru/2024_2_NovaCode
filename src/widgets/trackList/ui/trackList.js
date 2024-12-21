import { TrackView } from "../../../entities/track/index.js";
import { eventBus } from "../../../shared/lib/eventbus.js";
import template from "./trackList.hbs";
import * as styles from "./trackList.scss";

export class TrackListView {
  /**
   * The parent HTML element.
   * @type {HTMLElement}
   */
  parent;

  /**
   * Initializes the TrackListView.
   *
   * @param {HTMLElement} parent - The parent HTML element
   * @param {string} [artistId] - The artist ID (optional)
   * @param {string} [albumId] - The album ID (optional)
   * @param {boolean} [favorite] - Are the tracks favorite (optional)
   */
  constructor(parent, args = {}) {
    this.parent = parent ?? document.querySelector("#root");
    this.artistId = args.artistId ?? null;
    this.albumId = args.albumId ?? null;
    this.userID = args.userID ?? null;
    this.favorite = args.favorite ?? null;
    this.search = args.search ?? false;
    this.myPlaylistId = args.myPlaylistId ?? false;
  }

  /**
   * Renders the tracklist view.
   */
  async render(tracks, needsShowMoreHref = true) {
    tracks = tracks.map(
      ({ id, name, artistName, artistID, albumID, image, duration }) => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        duration = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        return { id, name, artistName, artistID, albumID, image, duration };
      },
    );

    const trackListElement = document.createElement("div");
    trackListElement.classList.add("tracks");

    let titleText;
    let showMoreHref;
    if (this.artistId) {
      showMoreHref = `/more_tracks/${"artist"}/${this.artistId}`;
      titleText = "Треки исполнителя";
    } else if (this.albumId) {
      showMoreHref = `/more_tracks/${"album"}/${this.albumId}`;
      titleText = "Треки альбома";
    } else if (this.favorite) {
      showMoreHref = `/more_tracks/favorite/${this.userID}`;
      titleText = "Любимые треки";
    } else if (this.search) {
			titleText = "Треки";
		} else {
      showMoreHref = `/more_tracks/popular`;
      titleText = "Популярные треки";
    }

    if (needsShowMoreHref) {
      trackListElement.innerHTML = template({ styles, showMoreHref });
    } else {
      trackListElement.innerHTML = template({ styles });
    }

    this.parent.appendChild(trackListElement);

    const tracksBlock = document.getElementById("tracks");
    for (const [index, track] of Array.from(tracks).entries()) {
      const trackView = new TrackView(tracksBlock, index);
      trackView.render(track, this.myPlaylistId);
    }
    eventBus.emit("tracks:rendered");

    this.bindEvents();
    this.setTitle(titleText);
  }

  setTitle(titleText) {
    const titleBlock = document.querySelector(
      `.${styles["tracks__recommend_text"]}`,
    );
    const title = titleBlock.querySelector("h4");
    title.textContent = titleText;
  }

  bindEvents() {
    const links = this.parent.querySelectorAll(".link_more_tracks");

    links.forEach((link) => {
      link.addEventListener("click", (event) => this.handleLink(event));
    });
  }

  deleteEvents() {
    const links = this.parent.querySelectorAll(".link_more_tracks");
    links.forEach((link) => {
      link.removeEventListener("click", (event) => this.handleLink(event));
    });
  }

  handleLink(event) {
    event.preventDefault();
    const href = event.target.getAttribute("href");
    eventBus.emit("navigate", href);
  }

  destructor() {
    this.deleteEvents();
  }
}
