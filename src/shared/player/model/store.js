import { eventBus } from '../../../shared/lib/index.js';
import { DEFAULT_PLAYER_VOLUME } from '../../lib/constants/player.js';

class PlayerStore {
	constructor() {
		this.currentIndex = -1;
		this.isPlaying = false;

		this.tracks = [];
		this.currentTrack = document.createElement('audio');
		this.currentTrack.volume = DEFAULT_PLAYER_VOLUME;

		this.onEvents();
	}

	clearTracks() {
		this.currentTrack.pause();
		this.tracks = [];
	}

	setTracks(tracks) {
		this.tracks = tracks;
		if (this.tracks.length > 0) {
			this.currentIndex = 0;
			this.loadTrack();
		}
	}

	getTrackInfo() {
		return this.tracks[this.currentIndex];
	}

	onEvents() {
		eventBus.on('playPauseTrack', this.onPlayPauseTrack);
		eventBus.on('playById', this.onPlayById);
		eventBus.on('nextTrack', this.onNextTrack);
		eventBus.on('prevTrack', this.onPrevTrack);
	}

	offEvents() {
		eventBus.off('playPauseTrack', this.onPlayPauseTrack);
		eventBus.off('playById', this.onPlayById);
		eventBus.off('nextTrack', this.onNextTrack);
		eventBus.off('prevTrack', this.onPrevTrack);
	}

	loadTrack() {
		this.currentTrack.src = `/${this.tracks[this.currentIndex].filepath}`;
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

	onPlayPauseTrack = () => {
		if (this.isPlaying) {
			this.currentTrack.pause();
			this.isPlaying = false;
		} else {
			this.currentTrack.play();
			this.isPlaying = true;
		}
	};

	onPlayById = (index) => {
		this.currentTrack.pause();
		this.currentIndex = index;
		this.loadTrack();
		this.currentTrack.play();
		this.isPlaying = true;
	};

	onNextTrack = () => {
		this.currentIndex =
			this.currentIndex + 1 >= this.tracks.length ? 0 : this.currentIndex + 1;
		this.loadTrack();
		this.currentTrack.play();
		this.isPlaying = true;
	};

	onPrevTrack = () => {
		this.currentIndex =
			this.currentIndex - 1 < 0
				? this.tracks.length - 1
				: this.currentIndex - 1;
		this.loadTrack();
		this.currentTrack.play();
		this.isPlaying = true;
	};

	destructor() {
		this.offEvents();
	}
}

export const player = new PlayerStore();
