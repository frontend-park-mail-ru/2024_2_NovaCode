import { API_URL } from '../../../shared/config/index';
import { GET } from '../../../shared/api/index';

export class TrackListAPI {
	/**
	 * Url path to backend api which returns tracks
	 *
	 */
	url;

	/**
	 * Initializes the TrackListAPI.
	 *
	 */
	constructor() {
		this.url = `${API_URL}/api/v1/tracks`;
	}

	async get() {
		try {
			const response = await GET(this.url);
			if (response.status === 200) {
				return response.body;
			} else {
				// this.displayMessage(
				// 	messageBox,
				// 	response.body.error || 'Не удалось загрузить плейлист',
				// 	'error',
				// );
				console.error('Error during playlist loading:', error);
			}
		} catch (error) {
			// this.displayMessage(
			// 	messageBox,
			// 	'Возникла ошибка при загрузке плейлиста. Попробуйте позже.',
			// 	'error',
			// );
			console.error('Error during playlist loading:', error);
		}
	}
}
