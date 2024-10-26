import { eventBus } from '../../../shared/lib/eventbus.js';
import { player } from '../../../shared/player/model/store.js';

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

		this.trackTimer = null;
	}

	/**
	 * Renders the tracklist view.
	 */
	async render(tracks) {
		const template = Handlebars.templates['footerPlayer.hbs'];
		const footerPlayerElement = document.createElement('div');
		footerPlayerElement.classList.add('footer_player');
		footerPlayerElement.innerHTML = template({});

		const spacer = document.createElement('div');
		spacer.classList.add('spacer');

		this.parent.appendChild(spacer);
		this.parent.appendChild(footerPlayerElement);

		await this.getElements();

		this.onEvents();
		this.addEvents();

		player.setTracks(tracks);
	}

	async getElements() {
		this.trackTime = document.querySelector('.track_slider__time_current');

		this.playPauseBtn = document.querySelector('.buttons__play_track');
		this.nextTrackBtn = document.querySelector('.buttons__next_track');
		this.prevTrackBtn = document.querySelector('.buttons__prev_track');

		this.seekTimerSlider = document.querySelector('.track_slider__seek');
		this.seekVolumeSlider = document.querySelector('.volume_slider__seek');

		this.trackInfoTrackImg = document.querySelector(
			'.player_details__track_img',
		);
		this.trackInfoTrackName = document.querySelector('.player__track_name');
		this.trackInfoTrackArtist = document.querySelector('.player__track_artist');
		this.trackInfoTrackDuration = document.querySelector(
			'.track_slider__time_total',
		);
	}

	onEvents() {
		eventBus.on('loadingTrack', this.handleLoading);
	}

	offEvents() {
		eventBus.off('loadingTrack', this.handleLoading);
	}

	addEvents() {
		this.playPauseBtn.addEventListener('click', this.handlePlayPauseBtn);
		this.nextTrackBtn.addEventListener('click', this.handleNextTrackBtn);
		this.prevTrackBtn.addEventListener('click', this.handlePrevTrackBtn);
		this.seekTimerSlider.addEventListener('change', this.handleTimerSlider);
		this.seekVolumeSlider.addEventListener('change', this.handleVolumeSlider);
	}

	deleteEvents() {
		this.playPauseBtn.removeEventListener('click', this.handlePlayPauseBtn);
		this.nextTrackBtn.removeEventListener('click', this.handleNextTrackBtn);
		this.prevTrackBtn.removeEventListener('click', this.handlePrevTrackBtn);
		this.seekTimerSlider.removeEventListener('change', this.handleTimerSlider);
		this.seekVolumeSlider.removeEventListener(
			'change',
			this.handleVolumeSlider,
		);
	}

	resetValues = async () => {
		this.trackTime.textContent = '00:00';
		this.seekTimerSlider.value = 0;
	};

	seekSliderUpdate = async () => {
		if (!isNaN(player.getDuration()) && !player.isPaused()) {
			const currentTime = player.getTime();
			const duration = player.getDuration();
			const seekPosition = currentTime * (100 / duration);
			this.seekTimerSlider.value = seekPosition;

			let currentMinutes = Math.floor(currentTime / 60);
			currentMinutes =
				currentMinutes < 10 ? `0${currentMinutes}` : `${currentMinutes}`;

			let currentSeconds = Math.floor(currentTime - currentMinutes * 60);
			currentSeconds =
				currentSeconds < 10 ? `0${currentSeconds}` : `${currentSeconds}`;

			this.trackTime.textContent = `${currentMinutes}:${currentSeconds}`;
		}
	};

	seekToTimer = async () => {
		const seekTime = player.getDuration() * (this.seekTimerSlider.value / 100);
		player.setTime(seekTime);
	};

	seekToVolume = async () => {
		player.setVolume(this.seekVolumeSlider.value / 100);
	};

	handleLoading = () => {
		const trackInfo = player.getTrackInfo();
		this.trackInfoTrackImg.setAttribute('src', `images/${trackInfo.image}`);
		this.trackInfoTrackName.textContent = trackInfo.name;
		this.trackInfoTrackArtist.textContent = trackInfo.artist;

		const duration = trackInfo.duration;
		let mins = Math.floor(duration / 60);
		mins = mins < 10 ? `0${mins}` : `${mins}`;
		let secs = Math.floor(duration - mins * 60);
		secs = secs < 10 ? `0${secs}` : `${secs}`;
		this.trackInfoTrackDuration.textContent = `${mins}:${secs}`;

		clearInterval(this.trackTimer);
		this.resetValues();
		this.trackTimer = setInterval(this.seekSliderUpdate, 1000);
	};

	handlePlayPauseBtn = () => {
		eventBus.emit('playPauseTrack');
	};

	handleNextTrackBtn = () => {
		console.log('handle nextTrack');
		eventBus.emit('nextTrack');
	};

	handlePrevTrackBtn = () => {
		console.log('handle prevTrack');
		eventBus.emit('prevTrack');
	};

	handleTimerSlider = () => {
		this.seekToTimer();
	};

	handleVolumeSlider = () => {
		this.seekToVolume();
	};

	destructor() {
		this.deleteEvents();
		this.offEvents();
	}
}
