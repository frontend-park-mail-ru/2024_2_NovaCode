export class TrackView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the TrackView.
	 *
	 */
	constructor(parent) {
		this.parent = parent ? parent : document.querySelector('#root');
	}

	/**
	 * Renders the track view.
	 */
	render(track) {
		const template = Handlebars.templates['track.hbs'];
		const trackElement = document.createElement('div');
		trackElement.innerHTML = template(track);
		this.parent.appendChild(trackElement);
	}
}
