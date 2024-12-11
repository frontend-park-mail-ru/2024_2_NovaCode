import { eventBus } from '../../../shared/lib/eventbus.js';
import template from './listenBlock.hbs';
import * as styles from './listenBlock.scss';
import playCircleIcon from '../../../../public/images/icons/play-circle.svg';

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
		listenBlockElement.innerHTML = template({ styles, playCircleIcon });
		this.parent.appendChild(listenBlockElement);

		this.playPauseBtn = document.querySelector(`.${styles['listen__btn_img']}`);
		this.addEvents();
	}

	addEvents() {
		this.playPauseBtn.addEventListener('click', this.handlePlayPauseBtn);
	}

	deleteEvents() {
		this.playPauseBtn.removeEventListener('click', this.handlePlayPauseBtn);
	}

	handlePlayPauseBtn() {
		eventBus.emit('playPauseTrack');
	}

	destructor() {
		this.deleteEvents();
	}
}
