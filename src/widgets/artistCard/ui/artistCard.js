<<<<<<< HEAD
import { ArtistCardAPI } from '../api/api.js';
import template from './artistCard.hbs';
import './artistCard.scss';
=======
import { ArtistCardAPI } from "../api/api.js";
import { S3_BUCKETS } from "../../../shared/lib/index.js";
>>>>>>> NM-48

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
   * Renders the playlist view.
   */
  async render() {
    const artistCardAPI = new ArtistCardAPI(this.artistId);
    let [artist, genres] = await artistCardAPI.get();

<<<<<<< HEAD
		const artistCardElement = document.createElement('div');
		artistCardElement.innerHTML = template({artist, genres}); 
		this.parent.appendChild(artistCardElement);
	}
}
=======
    if (artist.image) {
      artist.image = `${S3_BUCKETS.ARTIST_IMAGES}/${artist.image}`;
    }

    const template = Handlebars.templates["artistCard.hbs"];
    const artistCardElement = document.createElement("div");
    artistCardElement.classList.add("artist_card");
    artistCardElement.innerHTML = template({ artist, genres });
    this.parent.appendChild(artistCardElement);
  }
}
>>>>>>> NM-48
