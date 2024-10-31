import { ArtistCardAPI } from '../api/api.js';
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
		this.parent = parent ? parent : document.querySelector('#root');
		this.artistId = artistId;
	}

	/**
	 * Renders the playlist view.
	 */
	async render() {
		const artistCardAPI = new ArtistCardAPI(this.artistId);
		let [artist, genres] = await artistCardAPI.get();

		const artistCardElement = document.createElement('div');
		artistCardElement.innerHTML = template({artist, genres}); 
		this.parent.appendChild(artistCardElement);
	}
}