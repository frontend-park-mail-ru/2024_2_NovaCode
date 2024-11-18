import { eventBus } from '../../../shared/lib/index.js';
import { S3_BUCKETS } from '../../../shared/lib/index.js';
import template from './artist.hbs';
import './artist.scss';

export class ArtistView {
  /**
   * The parent HTML element.
   * @type {HTMLElement}
   */
  parent;

  /**
   * Initializes the ArtistView.
   *
   */
  constructor(parent) {
    this.parent = parent ? parent : document.querySelector('#root');

    this.handleArtistClick = this.handleArtistClick.bind(this);
  }

  /**
   * Renders the artist view.
   */
  render(artist) {
    this.artistId = artist.id;

    if (artist.image) {
      artist.image = `${S3_BUCKETS.ARTIST_IMAGES}/${artist.image}`;
    }

    const artistElement = document.createElement('div');
    artistElement.classList.add('artist');
    artistElement.setAttribute('data-id', this.artistId);
    artistElement.innerHTML = template(artist);
    this.parent.appendChild(artistElement);
    this.bindEvents();
  }

  bindEvents() {
    const artist = this.parent.querySelector(`[data-id="${this.artistId}"]`);
    artist?.addEventListener('click', this.handleArtistClick);
  }

  handleArtistClick() {
    eventBus.emit('navigate', `/artist/${this.artistId}`);
  }

  destructor() {
    const artist = this.parent.querySelector(`[data-id="${this.artistId}"]`);
    if (artist) {
      artist.removeEventListener('click', this.handleArtistClick);
    }
  }
}
