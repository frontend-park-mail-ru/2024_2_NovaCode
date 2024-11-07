import { API_URL } from '../../../shared/config/index.js';
import { GET } from '../../../shared/api/index.js';

export class AlbumListAPI {
	/**
	 * Url path to backend api which returns artist albums.
	 *
	 */
	url;

	/**
	 * Initializes the AlbumListAPI.
	 *
	 * @param {string} [artistId] - The artist ID (optional)
	 */
	constructor(artistId) {
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
				// 	response.body.error || 'Не удалось загрузить альбомы',
				// 	'error',
				// );
				// console.error('Error during albums loading:', error);
				console.log('Error during AlbumList loading:');
			}
		} catch (error) {
			// this.displayMessage(
			// 	messageBox,
			// 	'Возникла ошибка при загрузке альбомов. Попробуйте позже.',
			// 	'error',
			// );
			console.error(error);
		}
	}
}
