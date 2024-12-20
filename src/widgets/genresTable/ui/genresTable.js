import { GenresTableAPI } from "../api/api";
import { GenreCardView } from "../../../entities/genreCard/ui/genreCard";
import template from "./genresTable.hbs";
import * as styles from "./genresTable.scss";

export class GenresTable {
  parent;

  constructor(parent) {
    this.parent = parent ? parent : document.querySelector("#root");
    this.api = new GenresTableAPI();
  }

  async render() {
    const table = document.createElement("div");
    table.classList.add("genres");
    table.innerHTML = template({ styles });

    this.parent.appendChild(table);

    const genres = await this.api.get();
    const genresTable = document.getElementById("mainpage-genres-table");
    Array.from(genres).forEach((genre) => {
      const genreCard = new GenreCardView(genresTable);
      genreCard.render(genre);
    });
  }
}
