import { eventBus } from '../../../shared/lib/eventbus.js';
import { S3_BUCKETS } from "../../../shared/lib/index.js";
import { FooterPlayerAPI } from '../../../widgets/footerPlayer/api/api.js';
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
		this.footerPlayerAPI = new FooterPlayerAPI();
	}

	/**
	 * Renders the track view.
	 */
	async render(track, myPlaylistId = null) {
		this.myPlaylistId = myPlaylistId;
		this.track = track;
		if (track.image) {
			track.image = `${S3_BUCKETS.TRACK_IMAGES}/${track.image}`;
		}

    const user = userStore.storage.user;

		this.trackElement = document.createElement('div');
		this.trackElement.classList.add('track');
		this.trackElement.setAttribute('data-track-id', this.track.id);
		let isMyPlaylist = (this.myPlaylistId ? true : false);
		let isFavorite = await this.footerPlayerAPI.isFavorite(this.track.id);
		this.trackElement.innerHTML = template({ track, user, isMyPlaylist, isFavorite });
		this.parent.appendChild(this.trackElement);

		this.addBtn = this.trackElement.querySelector('track__add-btn');
		this.deleteBtn = this.trackElement.querySelector('track__delete-btn');
		this.likeBtn = this.trackElement.querySelector('.track__like-btn');

    this.addEvents();
  }

  addEvents() {
    this.trackElement.addEventListener('click', this.bindTrack);

		const links = this.trackElement.querySelectorAll('.link');
		links.forEach(link => {
			link.addEventListener('click', (event) => this.handleLink(event));
		});
		
		this.addBtn.addEventListener('click', this.handleTrackAdd);
		this.deleteBtn.addEventListener('click', this.handleTrackDelete);
		this.likeBtn.addEventListener('click', this.handleLikeTrackBtn);
	}

  handleTrackAdd = (event) => {
    const trackInPlaylistModal = new TrackInPlaylistModal(
      this.parent,
      this.track.id,
    );
    trackInPlaylistModal.render();
    event.stopPropagation();
  };

  handleTrackDelete = (event) => {
    const trackInPlaylistAPI = new TrackInPlaylistAPI(this.myPlaylistId);
    trackInPlaylistAPI.deleteTrack(this.track.id);
    this.trackElement.remove();
    event.stopPropagation();
  };

	handleLikeTrackBtn = async (event) => {
		event.stopPropagation();
		const user = userStore.storage.user;
		if (!user.isAuthorized) {
		  eventBus.emit('navigate', '/signin');
		  return;
		}
		
		const isFavorite = await this.footerPlayerAPI.isFavorite(this.track.id);
		if (user.isAuthorized && isFavorite) {
		  this.footerPlayerAPI.deleteFavorite(this.track.id);
		  this.likeBtn.classList.remove('track__liked');
		} else {
		  this.footerPlayerAPI.addFavorite(this.track.id);
		  this.likeBtn.classList.add('track__liked');
		}
	  };

	deleteEvents() {
		this.trackElement.removeEventListener('click', this.bindTrack);

		const links = this.trackElement.querySelectorAll('.link');
		links.forEach((link) => {
			link.removeEventListener('click', (event) => this.handleLink(event));
		});
		this.addBtn.removeEventListener('click', this.handleTrackAdd);
		this.deleteBtn.removeEventListener('click', this.handleTrackDelete);
		this.likeBtn.removeEventListener('click', this.handleLikeTrackBtn);
	}

  bindTrack = () => {
    eventBus.emit('reloadTracks');
    eventBus.emit('playById', this.trackIndex);
  };

  handleLink(event) {
    event.preventDefault();
    event.stopPropagation();
    const href = event.target.getAttribute('href');
    eventBus.emit('navigate', href);
  }

  destructor() {
    this.deleteEvents();
  }
}
