import { eventBus } from '../../../shared/lib/eventbus.js';
import { ArtistCardAPI } from '../api/api.js';
import { S3_BUCKETS } from "../../../shared/lib/index.js";
import template from './artistCard.hbs';
import './artistCard.scss';

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

    if (artist.image) {
      artist.image = `${S3_BUCKETS.ARTIST_IMAGES}/${artist.image}`;
    }

    const artistCardElement = document.createElement("div");
    artistCardElement.classList.add("artist_card");
    artistCardElement.innerHTML = template({ artist, genres });
    this.parent.appendChild(artistCardElement);

    this.playPauseBtn = document.querySelector('.buttons__listen');
		this.addEvents();
  }

  addEvents() {
		this.playPauseBtn.addEventListener('click', this.handlePlayPauseBtn);
	}

	deleteEvents() {
		this.playPauseBtn.removeEventListener('click', this.handlePlayPauseBtn);
	}

	handlePlayPauseBtn() {
		eventBus.emit('playPauseTrack');
	}

	destructor() {
		this.deleteEvents();
	}
}
