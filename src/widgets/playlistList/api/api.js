import { API_URL } from '../../../shared/config/index.js';
import { GET } from '../../../shared/api/index.js';

export class PlaylistListAPI {
	/**
	 * Url path to backend api which returns playlists
	 *
	 */
	url;

	/**
	 * Initializes the PlaylistListAPI.
	 *
	 */
	constructor() {
		this.url = `${API_URL}/api/v1/playlists`;
	}

	async get() {
		try {
			const response = await GET(this.url);
			if (!response.error) {
				return response.data;
			} else {
				console.log('Error during PlaylistList loading:');
			}
		} catch (error) {
			console.error(error);
		}
	}
}
