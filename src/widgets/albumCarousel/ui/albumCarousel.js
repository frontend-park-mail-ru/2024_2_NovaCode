import { AlbumView } from '../../../entities/album/index.js';
import { AlbumCarouselAPI } from '../api/api.js';
import { eventBus } from '../../../shared/lib/eventbus.js';
import template from './albumCarousel.hbs';
import * as styles from './albumCarousel.scss';

export class AlbumCarouselView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the AlbumView.
	 *
	 */
	constructor(parent, artistId = null) {
		this.parent = parent ? parent : document.querySelector('#root');
		this.position = 0;
		this.artistId = artistId;
	}

	/**
	 * Renders the playlist view.
	 */
	async render() {
		const albumCarouselAPI = new AlbumCarouselAPI(this.artistId);
		let albums = await albumCarouselAPI.get();

		const albumCarouselElement = document.createElement('div');
		albumCarouselElement.classList.add('album_carousel');

		let titleText;
		let showMoreHref;
		if (this.artistId) {
			showMoreHref = `/more_albums/${"artist"}/${this.artistId}`;
			titleText = "Альбомы исполнителя";
		} else {
			showMoreHref = `/more_albums/popular`;
			titleText = "Популярные альбомы";
		}
		
		albumCarouselElement.innerHTML = template({ styles, showMoreHref });
		this.parent.appendChild(albumCarouselElement);

		const albumsBlock = document.getElementById('albums-carousel');
		Array.from(albums).forEach((album) => {
			const albumCarouselElement = document.createElement('div');
			albumCarouselElement.classList.add(styles['carousel__item']);
			const albumView = new AlbumView(albumCarouselElement);
			albumView.render(album);
			albumsBlock.appendChild(albumCarouselElement);
		});

		await this.getElements();

		this.onEvents();
		this.addEvents();
		this.setTitle(titleText);
	}

	setTitle(titleText) {
		const titleBlock = document.querySelector(`.${styles['album_carousel__recommend_text']}`);
		const title = titleBlock.querySelector("h4");
		title.textContent = titleText;
	}

	onEvents() {
		eventBus.on('carousel:next', this.handleGoNext);
		eventBus.on('carousel:prev', this.handleGoPrev);
	}

	offEvents() {
		eventBus.off('carousel:next', this.handleGoNext);
		eventBus.off('carousel:prev', this.handleGoPrev);
	}

	addEvents() {
		this.nextBtn.addEventListener('click', this.handleNextBtn);
		this.prevBtn.addEventListener('click', this.handlePrevBtn);

		const links = this.parent.querySelectorAll(`.${styles['album_carousel__show_more']}`);
		links.forEach((link) => {
			link.addEventListener('click', (event) => this.handleLink(event));
		});
	}

	deleteEvents() {
		this.nextBtn.removeEventListener('click', this.handleNextBtn);
		this.prevBtn.removeEventListener('click', this.handlePrevBtn);

		const links = this.parent.querySelectorAll(`.${styles['album_carousel__show_more']}`);
		links.forEach((link) => {
			link.removeEventListener('click', (event) => this.handleLink(event));
		});
	}

	async getElements() {
		this.carouselInner = document.querySelector(`.${styles['carousel__inner']}`);
		this.carouselItems = document.querySelectorAll(`.${styles['carousel__item']}`);
		this.carouselArea = document.querySelector(`.${styles['carousel__area']}`);
		this.nextBtn = document.querySelector(`.${styles['carousel__button_next']}`);
		this.prevBtn = document.querySelector(`.${styles['carousel__button_prev']}`);

		this.itemWidth = this.carouselItems[0]?.offsetWidth ?? 0;
		this.carouselAreaWidth = this.carouselArea.offsetWidth;
		this.carouselInnerWidth = this.carouselInner.offsetWidth;

		this.maxPosition = -(this.carouselInnerWidth - this.carouselAreaWidth);
	}

	handleLink(event) {
		event.preventDefault();
		const href = event.target.getAttribute('href');
		eventBus.emit('navigate', href);
	}

	handleGoNext = () => {
		const remainingWidth =
			this.carouselInnerWidth + this.position - this.carouselAreaWidth;

		if (remainingWidth > this.itemWidth) {
			this.position -= this.itemWidth;
		} else if (remainingWidth > 0) {
			this.position -= remainingWidth;
		}

		this.carouselInner.style.transform = `translateX(${this.position}px)`;
	};

	handleGoPrev = () => {
		if (this.position < 0) {
			this.position +=
				this.position + this.itemWidth > 0 ? -this.position : this.itemWidth;
			this.carouselInner.style.transform = `translateX(${this.position}px)`;
		}
	};

	handleNextBtn = () => {
		eventBus.emit('carousel:next');
	};

	handlePrevBtn = () => {
		eventBus.emit('carousel:prev');
	};

	destructor() {
		this.deleteEvents();
		this.offEvents();
	}
}
