import { eventBus } from '../../../shared/lib/eventbus.js';
import { ArtistCardAPI } from '../api/api.js';
import { S3_BUCKETS } from "../../../shared/lib/index.js";
import template from './artistCard.hbs';
import './artistCard.scss';
import { ShareModal } from '../../shareModal/index.js';
import { BASE_URL } from '../../../shared/config/api.js';

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

    await this.getElements();
		this.addEvents();
  }

  async getElements() {
    this.playPauseBtn = document.querySelector('.buttons__listen');
    this.shareBtn = document.querySelector('.buttons__share');
  }

  addEvents() {
		this.playPauseBtn.addEventListener('click', this.handlePlayPauseBtn);
    this.shareBtn.addEventListener('click', this.handleShareBtn);
	}

	deleteEvents() {
		this.playPauseBtn.removeEventListener('click', this.handlePlayPauseBtn);
    this.shareBtn.addEventListener('click', this.handleShareBtn);
	}

	handlePlayPauseBtn() {
		eventBus.emit('playPauseTrack');
	}

  handleShareBtn = () => {
    const url = `${BASE_URL}/artist/${this.artistId}`;

		const shareModal = new ShareModal(document.querySelector('#root'));
		shareModal.render(url);
  }

	destructor() {
		this.deleteEvents();
	}
}
