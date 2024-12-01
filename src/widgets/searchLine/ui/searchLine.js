import { SearchLineAPI } from "../api/api.js";
import { eventBus } from "../../../shared/lib/index.js";
import template from './searchLine.hbs';
import './searchLine.scss';

export class SearchLineView {
  parent;

  constructor(parent) {
    this.parent = parent ? parent : document.querySelector("#root");
  }

  async render() {
    const searchLineElement = document.createElement("div");
    searchLineElement.classList.add("search_line");
    searchLineElement.innerHTML = template();
    this.parent.appendChild(searchLineElement);

    this.bindEvents();
  }

  bindEvents() {
    const form = document.querySelector(".search_line__form");
    if (form) {
      form.addEventListener("submit", this.handleSubmit.bind(this));
    }
  }

  destructor() {
    const form = document.querySelector(".search_line__form");
    if (form) {
      form.removeEventListener("submit", this.handleSubmit.bind(this));
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const query = document.querySelector(".search_line__input").value;

    const artists = await SearchLineAPI.findArtists(query);
    eventBus.emit("foundArtists", artists);

    const albums = await SearchLineAPI.findAlbums(query);
    eventBus.emit("foundAlbums", albums);

    const tracks = await SearchLineAPI.findTracks(query);
    eventBus.emit("foundTracks", tracks);

    if (!artists && !albums && !tracks) {
      eventBus.emit("emptySearchResult");
    }
  }
}
