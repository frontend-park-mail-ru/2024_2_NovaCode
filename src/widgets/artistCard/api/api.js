import { API_URL } from '../../../shared/config/index.js';
import { GET } from '../../../shared/api/index.js';
export class ArtistCardAPI {
	/**
	 * Url path to backend api which returns artist
	 *
	 */
	url;

	/**
	 * Initializes the ArtistCardAPI.
	 *
	 * @param {string} [artistId] - The artist ID (optional)
	 */
	constructor(artistId) {
		this.artistUrl = `${API_URL}/api/v1/artists/${artistId}`;
		this.genresUrl = `${API_URL}/api/v1/genres/byArtistId/${artistId}`;
	}

	async get() {
		try {
			// Выполняем оба запроса параллельно
			const [artistResponse, genresResponse] = await Promise.all([
				GET(this.artistUrl),
				GET(this.genresUrl)
			]);

			// Проверяем, есть ли ошибки в ответах
			if (!artistResponse.error && !genresResponse.error) {
				return [artistResponse.data, genresResponse.data];
			} else {
				console.error('Error during ArtistCard loading:', artistResponse.error || genresResponse.error);
			}
		} catch (error) {
			console.error(error);
		}
	}
}