import { ArtistView } from '../../../entities/artist/index.js';
import template from './artistList.hbs';
import * as styles from './artistList.scss';

export class ArtistListView {
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
	}

	/**
	 * Renders the playlist view.
	 */
	async render(artists) {
		const artistListElement = document.createElement('div');
		artistListElement.classList.add('artists');
	
		artistListElement.innerHTML = template({ styles });
		
		this.parent.appendChild(artistListElement);

		const artistsBlock = document.getElementById('mainpage-popular-artists');
		Array.from(artists).forEach((artist) => {
			const artistView = new ArtistView(artistsBlock);
			artistView.render(artist);
		});
	}
}
