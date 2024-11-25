import { API_URL } from '../../../shared/config/index.js';
import { GET } from '../../../shared/api/index.js';
export class AlbumCardAPI {
	/**
	 * Url path to backend api which returns album
	 *
	 */
	url;

	/**
	 * Initializes the AlbumCardAPI.
	 *
	 * @param {string} [albumId] - The album ID (optional)
	 */
	constructor(albumId) {
		this.albumUrl = `${API_URL}/api/v1/albums/${albumId}`;
	}

	async get() {
		try {
			// Выполняем оба запроса параллельно
			const albumResponse = await GET(this.albumUrl);

			// Проверяем, есть ли ошибки в ответах
			if (!albumResponse.error) {
				return albumResponse.data;
			} else {
				console.error('Error during AlbumCard loading:', albumResponse.error);
			}
		} catch (error) {
			console.error(error);
		}
	}
}