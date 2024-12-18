import { eventBus } from '../../../shared/lib/index.js';
import { DEFAULT_PLAYER_VOLUME } from '../../lib/constants/player.js';
import { S3_BUCKETS } from '../../../shared/lib/index.js';
import {
	PLAYER_PAUSED_STATE,
	PLAYER_PLAYING_STATE,
	PLAYER_STATE,
} from '../../lib/constants/player.js';

class PlayerStore {
	constructor() {
		this.currentIndex = -1;
		this.isPlaying = false;
		this.isLoaded = false;

		this.sessionID = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
		this.queue = [];
		this.tracks = [];
		this.currentTrack = document.createElement('audio');
		this.currentTrack.volume = DEFAULT_PLAYER_VOLUME;

		this.onEvents();
		window.addEventListener('storage', this.storageHandler);
		window.addEventListener('beforeunload', this.beforeUnloadHandler);
	}

	clearTracks() {
		this.currentTrack.pause();
		this.tracks = [];
	}

	addTracks(tracks) {
		this.isLoaded = false;
		if (this.tracks.length == 0) {
			this.tracks = tracks;
			this.setTracks();
		} else {
			this.queue = tracks;
		}
	}

	isReady() {
		return this.isPlaying || this.tracks.length > 0;
	}

	setTracks() {
		this.currentIndex = 0;
		this.loadTrack();
	}

	getTrackInfo() {
		return this.tracks[this.currentIndex];
	}

	onEvents() {
		eventBus.on('playPauseTrack', this.onPlayPauseTrack);
		eventBus.on('playById', this.onPlayById);
		eventBus.on('nextTrack', this.onNextTrack);
		eventBus.on('prevTrack', this.onPrevTrack);
		eventBus.on('reloadTracks', this.onReloadTracks);
	}

	offEvents() {
		eventBus.off('playPauseTrack', this.onPlayPauseTrack);
		eventBus.off('playById', this.onPlayById);
		eventBus.off('nextTrack', this.onNextTrack);
		eventBus.off('prevTrack', this.onPrevTrack);
		eventBus.off('reloadTracks', this.onReloadTracks);
	}

	loadTrack() {
		this.currentTrack.src = `${S3_BUCKETS.TRACK_FILES}/${this.tracks[this.currentIndex].filepath}`;
		this.currentTrack.load();
		this.currentTrack.addEventListener('ended', this.onNextTrack);
		eventBus.emit('loadingTrack');
	}

	setTime(time) {
		this.currentTrack.currentTime = time;
	}

	getTime() {
		return this.currentTrack.currentTime;
	}

	setVolume(volume) {
		this.currentTrack.volume = volume;
	}

	getVolume() {
		return this.currentTrack.volume;
	}

	getDuration() {
		return this.currentTrack.duration;
	}

	isPaused() {
		return this.currentTrack.paused;
	}

	onReloadTracks = () => {
		if (!this.isLoaded && this.queue.length > 0) {
			this.clearTracks();
			this.tracks = this.queue;
			this.queue = [];
			this.isLoaded = true;
		}
	};

	onPlayPauseTrack = () => {
		if (this.isPlaying) {
			this.currentTrack.pause();
			this.isPlaying = false;
		} else {
			this.currentTrack.play();
			this.isPlaying = true;
		}
		this.onChangeState();
	};

	onPlayById = (index) => {
		this.currentTrack.pause();
		this.currentIndex = index;
		this.loadTrack();
		this.currentTrack.play();
		this.isPlaying = true;
		this.onChangeState();
	};

	onNextTrack = () => {
		this.currentIndex =
			this.currentIndex + 1 >= this.tracks.length ? 0 : this.currentIndex + 1;
		this.loadTrack();
		this.currentTrack.play();
		this.isPlaying = true;
		this.onChangeState();
	};

	onPrevTrack = () => {
		this.currentIndex =
			this.currentIndex - 1 < 0
				? this.tracks.length - 1
				: this.currentIndex - 1;
		this.loadTrack();
		this.currentTrack.play();
		this.isPlaying = true;
		this.onChangeState();
	};

	onChangeState = () => {
		const state = {
			sessionID: this.sessionID,
			status: this.isPaused() ? PLAYER_PAUSED_STATE : PLAYER_PLAYING_STATE,
		};
		localStorage.setItem(PLAYER_STATE, JSON.stringify(state));
	};

	storageHandler = (event) => {
		if (event.key === PLAYER_STATE) {
			const state = JSON.parse(event.newValue);
			if (
				state &&
				state.sessionID !== this.sessionID &&
				state.status === PLAYER_PLAYING_STATE &&
				this.isPlaying
			) {
				this.currentTrack.pause();
				this.isPlaying = false;
			}
		}
	};

	beforeUnloadHandler = () => {
		localStorage.removeItem(PLAYER_STATE);
	};

	destructor() {
		this.offEvents();
		window.removeEventListener('storage', this.storageHandler);
		window.removeEventListener('beforeunload', this.beforeUnloadHandler);
	}
}

export const player = new PlayerStore();
