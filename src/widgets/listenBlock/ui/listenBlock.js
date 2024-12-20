import { eventBus } from '../../../shared/lib/eventbus.js';
import { player } from "../../../shared/player/model/store.js";
import template from './listenBlock.hbs';
import * as styles from './listenBlock.scss';
import playCircleIcon from '../../../../public/images/icons/play-circle.svg';
import pauseCircleIcon from '../../../../public/images/icons/pause-circle.svg';

export class ListenBlockView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the ListenBlockView.
	 *
	 */
	constructor(parent) {
		this.parent = parent ? parent : document.querySelector('#root');
	}

	/**
	 * Renders the listen block view.
	 */
	async render() {
		const listenBlockElement = document.createElement('div');
		listenBlockElement.classList.add('listen');
		listenBlockElement.innerHTML = template({ styles, playCircleIcon, pauseCircleIcon });
		this.parent.appendChild(listenBlockElement);

		this.getElements();

		this.addEvents();
		this.onEvents();
	}

	  async getElements() {
		this.playPauseBtn = document.querySelector(`.${styles['listen__btn_img']}`);
	}

	addEvents() {
		this.playPauseBtn.addEventListener('click', this.handlePlayPauseBtn);
	}

	deleteEvents() {
		this.playPauseBtn.removeEventListener('click', this.handlePlayPauseBtn);
	}

	onEvents() {
		eventBus.on("playPauseTrack", this.changePlayPauseBtnImg);
		eventBus.on("playById", this.changePlayPauseBtnImg);
	}
	
	offEvents() {
		eventBus.off("playPauseTrack", this.changePlayPauseBtnImg);
		eventBus.off("playById", this.changePlayPauseBtnImg);
	}

	changePlayPauseBtnImg = () => {
		if (player.isPlaying) {
			this.playPauseBtn.src = pauseCircleIcon;
		} else {
			this.playPauseBtn.src = playCircleIcon;
		}
	}

	handlePlayPauseBtn() {
		eventBus.emit('playPauseTrack');
	}

	destructor() {
		this.deleteEvents();
		this.offEvents();
	}
}
