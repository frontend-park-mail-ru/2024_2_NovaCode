import { eventBus } from '../../../shared/lib/index.js';
<<<<<<< HEAD
import template from './artist.hbs';
import './artist.scss';
=======
import { S3_BUCKETS } from "../../../shared/lib/index.js";
>>>>>>> NM-48

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
<<<<<<< HEAD
=======
		const template = Handlebars.templates['artist.hbs'];

		if (artist.image) {
			artist.image = `${S3_BUCKETS.ARTIST_IMAGES}/${artist.image}`;
		}

>>>>>>> NM-48
		const artistElement = document.createElement('div');
		artistElement.classList.add('artist');
		artistElement.setAttribute('data-id', this.artistId);
		artistElement.innerHTML = template(artist);
		this.parent.appendChild(artistElement);
		this.bindEvents();
	}

	bindEvents() {
		const artist = this.parent.querySelector(`[data-id="${this.artistId}"]`);
		if (artist) {
			artist.addEventListener('click', this.handleArtistClick);
		}
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
