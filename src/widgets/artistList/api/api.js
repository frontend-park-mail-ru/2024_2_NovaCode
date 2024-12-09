import { API_URL } from '../../../shared/config/index.js';
import { GET } from '../../../shared/api/index.js';

export class ArtistListAPI {
	/**
	 * Url path to backend api which returns artists/
	 *
	 */
	url;

	/**
	 * Initializes the ArtistListAPI.
	 *
	 */
	constructor() {
		this.url = `${API_URL}/api/v1/artists`;
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
				// console.error('Error during artists loading:', error);
				console.log('Error during ArtistList loading:');
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
