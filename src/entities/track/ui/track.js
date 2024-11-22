import { eventBus } from '../../../shared/lib/eventbus.js';
import { S3_BUCKETS } from "../../../shared/lib/index.js";
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
		if (track.image) {
			track.image = `${S3_BUCKETS.TRACK_IMAGES}/${track.image}`;
		}

		this.trackElement = document.createElement('div');
		this.trackElement.classList.add('track');
		this.trackElement.innerHTML = template(track);
		this.parent.appendChild(this.trackElement);

		this.addEvents();
	}

	addEvents() {
		this.trackElement.addEventListener('click', this.bindTrack);

		const links = this.trackElement.querySelectorAll('.link');
		links.forEach(link => {
			link.addEventListener('click', (event) => this.handleLink(event));
		});
	}

	deleteEvents() {
		this.trackElement.removeEventListener('click', this.bindTrack);

		const links = this.trackElement.querySelectorAll('.link');
		links.forEach((link) => {
			link.removeEventListener('click', (event) => this.handleLink(event));
		});
	}

	bindTrack = () => {
		eventBus.emit('playById', this.trackIndex);
	};

	handleLink(event) {
		event.preventDefault();
		event.stopPropagation();
		const href = event.target.getAttribute('href')
		eventBus.emit('navigate', href);
	}

	destructor() {
		this.deleteEvents();
	}
}
