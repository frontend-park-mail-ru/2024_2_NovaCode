import { PlaylistView } from "../../../entities/playlist/index.js";
import { eventBus } from "../../../shared/lib/eventbus.js";
import { handleLink } from "../../../shared/lib/link.js";
import template from "./playlistList.hbs";
import * as styles from "./playlistList.scss";

export class PlaylistListView {
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
  }

  /**
   * Renders the playlist view.
   */
  async render(playlists, needsShowMoreHref = true, favorite = false) {
    const playlistListElement = document.createElement("div");
    playlistListElement.classList.add("playlists");

    let titleText;
    let showMoreHref;
    if (favorite) {
      showMoreHref = `/more_playlists/favorite`;
      titleText = "Любимые плейлисты";
    } else {
      showMoreHref = `/more_playlists/popular`;
      titleText = "Популярные плейлисты";
    }

    if (needsShowMoreHref) {
      playlistListElement.innerHTML = template({ styles, showMoreHref });
    } else {
      playlistListElement.innerHTML = template({ styles });
    }

    this.parent.appendChild(playlistListElement);

    const playlistsBlock = document.getElementById(
      "mainpage-popular-playlists",
    );
    Array.from(playlists).forEach((playlist) => {
      const playlistView = new PlaylistView(playlistsBlock);
      playlistView.render(playlist);
    });

    this.addEvents();

    this.setTitle(titleText);
  }

  setTitle(newTitle) {
    const titleBlock = document.querySelector(`.${styles['playlists__text']}`);
    const title = titleBlock.querySelector('h4');
    title.textContent = newTitle;
  }

  addEvents() {
    const links = this.parent.querySelectorAll(".playlists__show_more");

    links.forEach((link) => {
      link.addEventListener("click", handleLink);
    });
  }

  removeEvents() {
    const links = this.parent.querySelectorAll(".playlists__show_more");

    links.forEach((link) => {
      link.addEventListener("click", handleLink);
    });
  }

  destructor() {
    this.removeEvents();
  }
}
