// import { FooterPlayerAPI } from '../api/api.js';

export class FooterPlayerView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the TrackListView.
	 *
	 * @param {HTMLElement} parent - The parent HTML element
	 */
	constructor(parent) {
		this.parent = parent ? parent : document.querySelector('#root');
	}

	/**
	 * Renders the tracklist view.
	 */
	async render() {
		const template = Handlebars.templates['footerPlayer.hbs'];
		const footerPlayerElement = document.createElement('div');
		footerPlayerElement.classList.add('footer_player');
		footerPlayerElement.innerHTML = template({});
		const spacer = document.createElement('div');
		spacer.classList.add('spacer');

		this.parent.appendChild(spacer);
		this.parent.appendChild(footerPlayerElement);
	}
}
