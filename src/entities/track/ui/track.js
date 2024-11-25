import { eventBus } from '../../../shared/lib/eventbus.js';
import { S3_BUCKETS } from "../../../shared/lib/index.js";
import { TrackInPlaylistAPI, TrackInPlaylistModal } from '../../../widgets/trackInPlaylist/index.js';
import { userStore } from '../../user/index.js';
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
	render(track, myPlaylistId = null) {
		this.myPlaylistId = myPlaylistId;
		this.track = track;
		if (track.image) {
			track.image = `${S3_BUCKETS.TRACK_IMAGES}/${track.image}`;
		}

		const user = userStore.storage.user;

		this.trackElement = document.createElement('div');
		this.trackElement.classList.add('track');
		this.trackElement.setAttribute('data-track-id', track.id);
		this.trackElement.innerHTML = template({ track, user, isMyPlaylist: (this.myPlaylistId ? true : false) });
		this.parent.appendChild(this.trackElement);

		this.addBtns = this.trackElement.getElementsByClassName('track__add-btn');
		this.deleteBtns = this.trackElement.getElementsByClassName('track__delete-btn');

		this.addEvents();
	}

	addEvents() {
		this.trackElement.addEventListener('click', this.bindTrack);

		const links = this.trackElement.querySelectorAll('.link');
		links.forEach(link => {
			link.addEventListener('click', (event) => this.handleLink(event));
		});
		if (this.addBtns.length > 0) {
			this.addBtns[0].addEventListener('click', this.handleTrackAdd.bind(this));
		}

		if (this.deleteBtns.length > 0) {
			this.deleteBtns[0].addEventListener('click', this.handleTrackDelete.bind(this));
		}
	}

	handleTrackAdd = (event) => {
		const trackInPlaylistModal = new TrackInPlaylistModal(this.parent, this.track.id);
		trackInPlaylistModal.render()
		event.stopPropagation();
	}

	handleTrackDelete = (event) => {
		const trackInPlaylistAPI = new TrackInPlaylistAPI(this.myPlaylistId);
		trackInPlaylistAPI.deleteTrack(this.track.id);
		this.trackElement.remove();
		event.stopPropagation();
	}

	deleteEvents() {
		this.trackElement.removeEventListener('click', this.bindTrack);

		const links = this.trackElement.querySelectorAll('.link');
		links.forEach((link) => {
			link.removeEventListener('click', (event) => this.handleLink(event));
		});
		if (this.addBtns.length > 0) {
			this.addBtns[0].removeEventListener('click', this.handleTrackAdd.bind(this));
		}

		if (deleteBtns.length > 0) {
			deleteBtns[0].removeEventListener('click', this.handleTrackDelete.bind(this));
		}
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
