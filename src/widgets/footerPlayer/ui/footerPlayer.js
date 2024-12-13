import { eventBus } from "../../../shared/lib/eventbus.js";
import { player } from "../../../shared/player/model/store.js";
import { S3_BUCKETS } from "../../../shared/lib/index.js";
import template from "./footerPlayer.hbs";
import * as styles from "./footerPlayer.scss";
import { FooterPlayerAPI } from "../api/api.js";
import { userStore } from "../../../entities/user/index.js";
import { TrackInPlaylistModal } from '../../trackInPlaylist/index.js';
import { ShareModal } from '../../shareModal/index.js';
import { BASE_URL } from '../../../shared/config/api.js';
import playCircleBlackIcon from '../../../../public/images/icons/play-circle-black.svg';
import pauseCircleBlackIcon from '../../../../public/images/icons/pause-circle-black.svg';
import backwardIcon from '../../../../public/images/icons/backward.svg';
import forwardIcon from '../../../../public/images/icons/forward.svg';
import heartBlackIcon from '../../../../public/images/icons/heart-black.svg';
import addIcon from '../../../../public/images/icons/add.svg';
import volumeLowIcon from '../../../../public/images/icons/volume-low.svg';
import volumeUpIcon from '../../../../public/images/icons/volume-up.svg';
import sendSquareBlackIcon from '../../../../public/images/icons/send-square-black.svg';


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
  constructor() {
    this.parent = document.querySelector("#player");
    this.api = new FooterPlayerAPI();
    this.trackTimer = null;
  }

  /**
   * Renders the tracklist view.
   */
  async render() {
    const footerPlayerElement = document.createElement("div");
    footerPlayerElement.classList.add("footer_player");
    footerPlayerElement.innerHTML = template({
      styles, 
      playCircleBlackIcon,
      pauseCircleBlackIcon,
      backwardIcon,
      forwardIcon,
      heartBlackIcon,
      addIcon,
      sendSquareBlackIcon,
      volumeLowIcon,
      volumeUpIcon,
    });
    this.parent.appendChild(footerPlayerElement);

    await this.getElements();

    this.onEvents();
    this.addEvents();

    this.seekVolumeSlider.value = player.getVolume() * 100;
  }

  async getElements() {
    this.footerPlayer = document.querySelector("#player");
    this.trackTime = document.querySelector(`.${styles['track_slider__time_current']}`);

    this.playPauseBtn = document.querySelector('.buttons_player__play_track');
    this.playPauseBtnIcon = this.playPauseBtn.querySelector('img');
    this.nextTrackBtn = document.querySelector('.buttons_player__next_track');
    this.prevTrackBtn = document.querySelector('.buttons_player__prev_track');
    this.likeTrackBtn = document.querySelector('.buttons_player__like_track');
    this.addTrackBtn = document.querySelector('.buttons_player__add_track');
    this.shareTrackBtn = document.querySelector('.buttons_player__share_track')

    this.seekTimerSlider = document.querySelector('.track_slider__seek');
    this.seekVolumeSlider = document.querySelector('.volume_slider__seek');

    this.trackInfoTrackImg = document.querySelector(
      `.${styles['player_details__track_img']}`,
    );
    this.trackInfoTrackName = document.querySelector(`.${styles['player__track_name']}`);
    this.trackInfoTrackArtist = document.querySelector(`.${styles['player__track_artist']}`);
    this.trackInfoTrackDuration = document.querySelector(
      `.${styles['track_slider__time_total']}`,
    );
  }

  onEvents() {
    eventBus.on("loadingTrack", this.handleLoading);
    eventBus.on("hidePlayer", this.hidePlayer);
    eventBus.on("showPlayer", this.showPlayer);
    eventBus.on("playPauseTrack", this.changePlayPauseBtnImg);
    eventBus.on("playById", this.changePlayPauseBtnImg);
    eventBus.on("prevTrack", this.changePlayPauseBtnImg);
    eventBus.on("nextTrack", this.changePlayPauseBtnImg);
  }

  offEvents() {
    eventBus.off("loadingTrack", this.handleLoading);
    eventBus.off("hidePlayer", this.hidePlayer);
    eventBus.off("showPlayer", this.showPlayer);
    eventBus.on("playPauseTrack", this.changePlayPauseBtnImg);
    eventBus.on("playById", this.changePlayPauseBtnImg);
    eventBus.on("prevTrack", this.changePlayPauseBtnImg);
    eventBus.on("nextTrack", this.changePlayPauseBtnImg);
  }

  addEvents() {
    this.playPauseBtn.addEventListener('click', this.handlePlayPauseBtn);
    this.nextTrackBtn.addEventListener('click', this.handleNextTrackBtn);
    this.prevTrackBtn.addEventListener('click', this.handlePrevTrackBtn);
    this.likeTrackBtn.addEventListener('click', this.handleLikeTrackBtn);
    this.addTrackBtn.addEventListener('click', this.handleAddTrackBtn);
    this.shareTrackBtn.addEventListener('click', this.handleShareTrackBtn);
    this.seekTimerSlider.addEventListener('change', this.handleTimerSlider);
    this.seekVolumeSlider.addEventListener('change', this.handleVolumeSlider);
  }

  deleteEvents() {
    this.playPauseBtn.removeEventListener('click', this.handlePlayPauseBtn);
    this.nextTrackBtn.removeEventListener('click', this.handleNextTrackBtn);
    this.prevTrackBtn.removeEventListener('click', this.handlePrevTrackBtn);
    this.likeTrackBtn.removeEventListener('click', this.handleLikeTrackBtn);
    this.addTrackBtn.removeEventListener('click', this.handleAddTrackBtn);
    this.seekTimerSlider.removeEventListener('change', this.handleTimerSlider);
    this.seekVolumeSlider.removeEventListener(
      "change",
      this.handleVolumeSlider,
    );
  }

  resetValues = async () => {
    this.trackTime.textContent = "00:00";
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

  hidePlayer = async () => {
    if (!this.footerPlayer.classList.contains("hidden")) {
      this.footerPlayer.classList.add("hidden");
      player.clearTracks();
    }
  };

  showPlayer = async () => {
    if (this.footerPlayer.classList.contains("hidden")) {
      this.footerPlayer.classList.remove("hidden");
    }
  };

  handleLoading = async () => {
    const trackInfo = player.getTrackInfo();
    this.trackInfoTrackImg.setAttribute(
      "src",
      `${S3_BUCKETS.TRACK_IMAGES}/${trackInfo.image}`,
    );
    this.trackInfoTrackName.textContent = trackInfo.name;
    this.trackInfoTrackArtist.textContent = trackInfo.artistName;

    const duration = trackInfo.duration;
    let mins = Math.floor(duration / 60);
    mins = mins < 10 ? `0${mins}` : `${mins}`;
    let secs = Math.floor(duration - mins * 60);
    secs = secs < 10 ? `0${secs}` : `${secs}`;
    this.trackInfoTrackDuration.textContent = `${mins}:${secs}`;

    const user = userStore.storage.user;
    let isFavorite = null;
    if (user.isAuthorized) {
      isFavorite = await this.api.isFavorite(trackInfo.id);
    }

    if (user.isAuthorized && isFavorite) {
      this.likeTrackBtn.classList.add(styles['liked_footer_player']);
    } else {
      this.likeTrackBtn.classList.remove(styles['liked_footer_player']);
    }

    clearInterval(this.trackTimer);
    this.resetValues();
    this.trackTimer = setInterval(this.seekSliderUpdate, 1000);
  };

  changePlayPauseBtnImg = () => {
    if (player.isPlaying) {
      this.playPauseBtnImg.src = pauseCircleBlackIcon;
    } else {
      this.playPauseBtnImg.src = playCircleBlackIcon;
    }
  }

  handlePlayPauseBtn = async () => {
    eventBus.emit('playPauseTrack');
  };

  handleNextTrackBtn = async () => {
    eventBus.emit("nextTrack");
  };

  handlePrevTrackBtn = async () => {
    eventBus.emit("prevTrack");
  };

  handleLikeTrackBtn = async () => {
    const trackInfo = player.getTrackInfo();
    const user = userStore.storage.user;
    if (!user.isAuthorized) {
      eventBus.emit("navigate", "/signin");
      return;
    }

    const isFavorite = await this.api.isFavorite(trackInfo.id);
    if (user.isAuthorized && isFavorite) {
      this.api.deleteFavorite(trackInfo.id);
      this.likeTrackBtn.classList.remove(styles['liked_footer_player']);
    } else {
      this.api.addFavorite(trackInfo.id);
      this.likeTrackBtn.classList.add(styles['liked_footer_player']);
    }
  };

  handleAddTrackBtn = () => {
    const trackInfo = player.getTrackInfo();
    const trackInPlaylistModal = new TrackInPlaylistModal(this.parent, trackInfo.id);
    trackInPlaylistModal.render()
  }

  handleShareTrackBtn = () => {
    const trackInfo = player.getTrackInfo();
    const url = `${BASE_URL}/album/${trackInfo.albumID}/track/${trackInfo.id}`;
    const shareModal = new ShareModal(document.querySelector('#root'));
    shareModal.render(url);
  }

  handleTimerSlider = async () => {
    this.seekToTimer();
  };

  handleVolumeSlider = async () => {
    this.seekToVolume();
  };

  destructor() {
    this.deleteEvents();
    this.offEvents();
  }
}
