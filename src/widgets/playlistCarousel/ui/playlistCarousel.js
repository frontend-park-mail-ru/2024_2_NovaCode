import { PlaylistView } from "../../../entities/playlist/index.js";
import { PlaylistCarouselAPI } from "../api/api.js";
import { eventBus } from "../../../shared/lib/eventbus.js";
import template from "./playlistCarousel.hbs";
import * as styles from "./playlistCarousel.scss";

export class PlaylistCarouselView {
  /**
   * The parent HTML element.
   * @type {HTMLElement}
   */
  parent;

  /**
   * Initializes the PlaylistView.
   *
   */
  constructor(parent, args) {
    this.parent = parent ?? document.querySelector("#root");
    this.position = 0;
    this.favorite = args?.favorite ?? false;
  }

  /**
   * Renders the playlist view.
   */
  async render(playlists) {
    this.playlistCarouselElement = document.createElement("div");
    this.playlistCarouselElement.classList.add("popular_playlists");

    let titleText;
    let showMoreHref;
    if (this.favorite) {
      showMoreHref = `/more_playlists/favorite`;
      titleText = "Любимые плейлисты";
    } else {
      showMoreHref = `/more_playlists/popular`;
      titleText = "Популярные плейлисты";
    }

    this.playlistCarouselElement.innerHTML = template({ styles, showMoreHref });
    this.parent.appendChild(this.playlistCarouselElement);

    const playlistsBlock = document.getElementById("popular-playlists");
    Array.from(playlists).forEach((playlist) => {
      const playlistCarouselItem = document.createElement("div");
      playlistCarouselItem.classList.add("carousel__item");
      const playlistView = new PlaylistView(playlistCarouselItem);
      playlistView.render(playlist);
      playlistsBlock.appendChild(playlistCarouselItem);
    });

    await this.getElements();
    
    this.setTitle(titleText);

    this.onEvents();
    this.addEvents();
  }

  onEvents() {
    eventBus.on("playlists-carousel:next", this.handleGoNext);
    eventBus.on("playlists-carousel:prev", this.handleGoPrev);
  }

  offEvents() {
    eventBus.off("playlists-carousel:next", this.handleGoNext);
    eventBus.off("playlists-carousel:prev", this.handleGoPrev);
  }

  addEvents() {
    this.nextBtn.addEventListener("click", this.handleNextBtn);
    this.prevBtn.addEventListener("click", this.handlePrevBtn);

    const links = this.parent.querySelectorAll(".popular_playlists__show_more");
    links.forEach((link) => {
      link.addEventListener("click", (event) => this.handleLink(event));
    });
  }

  deleteEvents() {
    this.nextBtn.removeEventListener("click", this.handleNextBtn);
    this.prevBtn.removeEventListener("click", this.handlePrevBtn);

    const links = this.parent.querySelectorAll(".popular_playlists__show_more");
    links.forEach((link) => {
      link.removeEventListener("click", (event) => this.handleLink(event));
    });
  }

  async getElements() {
    this.carouselInner = this.playlistCarouselElement.querySelector(".carousel__inner");
    this.carouselItems = this.playlistCarouselElement.querySelectorAll(".carousel__item");
    this.carouselArea = this.playlistCarouselElement.querySelector(".carousel__area");
    this.nextBtn = this.playlistCarouselElement.querySelector(".carousel__button_next");
    this.prevBtn = this.playlistCarouselElement.querySelector(".carousel__button_prev");
    this.title = this.playlistCarouselElement.querySelector(
      `.${styles["popular_playlists__text"]}>h4`,
    );

    this.itemWidth = this.carouselItems[0]?.offsetWidth ?? 0;
    this.carouselAreaWidth = this.carouselArea.offsetWidth;
    this.carouselInnerWidth = this.carouselInner.offsetWidth;

    this.maxPosition = -(this.carouselInnerWidth - this.carouselAreaWidth);
  }

  setTitle(title) {
    this.title.textContent = title;
  }

  handleLink(event) {
    event.preventDefault();
    const href = event.target.getAttribute("href");
    eventBus.emit("navigate", href);
  }

  handleGoNext = () => {
    const remainingWidth =
      this.carouselInnerWidth + this.position - this.carouselAreaWidth;

    if (remainingWidth > this.itemWidth) {
      this.position -= this.itemWidth;
    } else if (remainingWidth > 0) {
      this.position -= remainingWidth;
    }

    this.carouselInner.style.transform = `translateX(${this.position}px)`;
  };

  handleGoPrev = () => {
    if (this.position < 0) {
      this.position +=
        this.position + this.itemWidth > 0 ? -this.position : this.itemWidth;
      this.carouselInner.style.transform = `translateX(${this.position}px)`;
    }
  };

  handleNextBtn = () => {
    eventBus.emit("playlists-carousel:next");
  };

  handlePrevBtn = () => {
    eventBus.emit("playlists-carousel:prev");
  };

  destructor() {
    this.deleteEvents();
    this.offEvents();
  }
}
