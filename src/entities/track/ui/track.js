import { eventBus } from '../../../shared/lib/eventbus.js';
import template from './track.hbs';
import './track.scss';

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
	constructor(parent, index) {
		this.parent = parent ? parent : document.querySelector('#root');
		this.trackIndex = index;
	}

	/**
	 * Renders the track view.
	 */
	render(track) {
		this.trackElement = document.createElement('div');
		this.trackElement.classList.add('track');
		this.trackElement.innerHTML = template(track);
		this.parent.appendChild(this.trackElement);

		this.addEvents();
	}

	addEvents() {
		this.trackElement.addEventListener('click', this.bindTrack);
	}

	deleteEvents() {
		this.trackElement.removeEventListener('click', this.bindTrack);
	}

	bindTrack = () => {
		eventBus.emit('playById', this.trackIndex);
	};

	destructor() {
		this.deleteEvents();
	}
}
