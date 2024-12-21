import { eventBus } from "../../../shared/lib/index.js";
import { S3_BUCKETS } from "../../../shared/lib/index.js";
import template from "./genreCard.hbs";
import * as styles from "./genreCard.scss";

export class GenreCardView {
  /**
   * The parent HTML element.
   * @type {HTMLElement}
   */
  parent;

  /**
   * Initializes the GenreCardView.
   *
   */
  constructor(parent) {
    this.parent = parent ? parent : document.querySelector("#root");
  }

  /**
   * Renders the genre card view.
   */
  render(genre) {
    this.genreID = genre.id;

    const genreCard = document.createElement("div");
    genreCard.classList.add(styles["genre_card"]);
    genreCard.setAttribute("data-genre-id", this.genreID);
    genreCard.innerHTML = template({ styles, genre });
    this.parent.appendChild(genreCard);
    this.bindEvents();
  }

  bindEvents() {
    const genreCard = this.parent.querySelector(
      `[data-genre-id="${this.genreID}"]`,
    );
    genreCard?.addEventListener("click", this.handleGenreClick);
  }

  handleGenreClick = () => {
    eventBus.emit("navigate", `/genre/${this.genreID}`);
  };

  destructor() {
    const genreCard = this.parent.querySelector(
      `[data-genre-id="${this.genreID}"]`,
    );
    if (genreCard) {
      genreCard.removeEventListener("click", this.handleGenreClick);
    }
  }
}
