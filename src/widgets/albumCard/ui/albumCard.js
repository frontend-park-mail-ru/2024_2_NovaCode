import { eventBus } from '../../../shared/lib/eventbus.js';
import { AlbumCardAPI } from '../api/api.js';
import { S3_BUCKETS } from "../../../shared/lib/index.js";
import template from './albumCard.hbs';
import './albumCard.scss';
import { BASE_URL } from '../../../shared/config/api.js';
import { ShareModal } from '../../shareModal/index.js';

export class AlbumCardView {
  /**
   * The parent HTML element.
   * @type {HTMLElement}
   */
  parent;

  /**
   * Initializes the AlbumCardView.
   *
   */
  constructor(parent, albumId) {
    this.parent = parent ?? document.querySelector("#root");
    this.albumId = albumId;
  }

  /**
   * Renders the playlist view.
   */
  async render() {
    const albumCardAPI = new AlbumCardAPI(this.albumId);
    let album = await albumCardAPI.get();
    album.release = new Date(album.release).getFullYear();

    if (album.image) {
      album.image = `${S3_BUCKETS.ALBUM_IMAGES}/${album.image}`;
    }

    this.albumCardElement = document.createElement("div");
    this.albumCardElement.classList.add("album_card");
    this.albumCardElement.innerHTML = template({ album });
    this.parent.appendChild(this.albumCardElement);

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

    const links = this.albumCardElement.querySelectorAll('.link');
    links.forEach(link => {
			link.addEventListener('click', (event) => this.handleLink(event));
	  });
	}

	deleteEvents() {
		this.playPauseBtn.removeEventListener('click', this.handlePlayPauseBtn);
    this.shareBtn.removeEventListener('click', this.handleShareBtn);


    const links = this.parent.querySelectorAll('.link');
		links.forEach((link) => {
			link.removeEventListener('click', (event) => this.handleLink(event));
		});
	}

	handlePlayPauseBtn() {
		eventBus.emit('playPauseTrack');
	}

  handleShareBtn = () => {
    const url = `${BASE_URL}/album/${this.albumId}`;

		const shareModal = new ShareModal(document.querySelector('#root'));
		shareModal.render(url);
  }

  handleLink(event) {
		event.preventDefault();
		const href = event.target.getAttribute('href')
		eventBus.emit('navigate', href);
	}

	destructor() {
		this.deleteEvents();
	}
}
