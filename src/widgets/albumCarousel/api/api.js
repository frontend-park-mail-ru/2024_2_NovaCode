import { API_URL } from '../../../shared/config/index.js';
import { GET } from '../../../shared/api/index.js';

export class AlbumCarouselAPI {
	/**
	 * Url path to backend api which returns albums/
	 *
	 */
	url;

	/**
	 * Initializes the AlbumCarouselAPI.
	 *
	 */
	constructor(artistId = null) {
		if (artistId) {
			this.url = `${API_URL}/api/v1/albums/byArtistId/${artistId}`;
		} else {
			this.url = `${API_URL}/api/v1/albums`;
		}
	}

	async get() {
		try {
			const response = await GET(this.url);
			if (!response.error) {
				return response.data;
			} else {
				// this.displayMessage(
				// 	messageBox,
				// 	response.body.error || 'Не удалось загрузить музыкантов',
				// 	'error',
				// );
				// console.error('Error during albums loading:', error);
				console.log('Error during AlbumCarousel loading:');
			}
		} catch (error) {
			// this.displayMessage(
			// 	messageBox,
			// 	'Возникла ошибка при загрузке плейлиста. Попробуйте позже.',
			// 	'error',
			// );
			console.error(error);
		}
	}
}
