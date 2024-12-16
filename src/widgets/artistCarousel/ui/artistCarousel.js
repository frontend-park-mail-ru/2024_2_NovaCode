import { ArtistView } from "../../../entities/artist/index.js";
import { ArtistCarouselAPI } from "../api/api.js";
import { eventBus } from "../../../shared/lib/eventbus.js";
import template from "./artistCarousel.hbs";
import * as styles from "./artistCarousel.scss";

export class ArtistCarouselView {
  /**
   * The parent HTML element.
   * @type {HTMLElement}
   */
  parent;

  /**
   * Initializes the ArtistView.
   *
   */
  constructor(parent, args) {
    this.parent = parent ? parent : document.querySelector("#root");
    this.position = 0;
    this.favorite = args?.favorite ?? false;
  }

  /**
   * Renders the playlist view.
   */
  async render() {
    const artistCarouselAPI = new ArtistCarouselAPI();
    let artists = !this.favorite
      ? await artistCarouselAPI.get()
      : await artistCarouselAPI.getFavorite();
    if (!artists) return;

    const artistCarouselElement = document.createElement("div");
    artistCarouselElement.classList.add("popular_artists");

    let titleText;
    let showMoreHref;
    if (this.favorite) {
      showMoreHref = `/more_artists/favorite`;
      titleText = "Любимые артисты";
    } else {
      showMoreHref = `/more_artists/popular`;
      titleText = "Популярные артисты";
    }

    artistCarouselElement.innerHTML = template({ styles, showMoreHref });
    this.parent.appendChild(artistCarouselElement);

    const artistsBlock = document.getElementById("popular-artists");
    Array.from(artists).forEach((artist) => {
      const artistCarouselElement = document.createElement("div");
      artistCarouselElement.classList.add("carousel__item");
      const artistView = new ArtistView(artistCarouselElement);
      artistView.render(artist);
      artistsBlock.appendChild(artistCarouselElement);
    });

    await this.getElements();
    
    this.setTitle(titleText);

    this.onEvents();
    this.addEvents();
  }

  onEvents() {
    eventBus.on("carousel:next", this.handleGoNext);
    eventBus.on("carousel:prev", this.handleGoPrev);
  }

  offEvents() {
    eventBus.off("carousel:next", this.handleGoNext);
    eventBus.off("carousel:prev", this.handleGoPrev);
  }

  addEvents() {
    this.nextBtn.addEventListener("click", this.handleNextBtn);
    this.prevBtn.addEventListener("click", this.handlePrevBtn);

    const links = this.parent.querySelectorAll(".popular_artists__show_more");
    links.forEach((link) => {
      link.addEventListener("click", (event) => this.handleLink(event));
    });
  }

  deleteEvents() {
    this.nextBtn.removeEventListener("click", this.handleNextBtn);
    this.prevBtn.removeEventListener("click", this.handlePrevBtn);

    const links = this.parent.querySelectorAll(".popular_artists__show_more");
    links.forEach((link) => {
      link.removeEventListener("click", (event) => this.handleLink(event));
    });
  }

  async getElements() {
    this.carouselInner = document.querySelector(".carousel__inner");
    this.carouselItems = document.querySelectorAll(".carousel__item");
    this.carouselArea = document.querySelector(".carousel__area");
    this.nextBtn = document.querySelector(".carousel__button_next");
    this.prevBtn = document.querySelector(".carousel__button_prev");
    this.title = document.querySelector(
      `.${styles["popular_artists__text"]}>h4`,
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
    eventBus.emit("carousel:next");
  };

  handlePrevBtn = () => {
    eventBus.emit("carousel:prev");
  };

  destructor() {
    this.deleteEvents();
    this.offEvents();
  }
}
