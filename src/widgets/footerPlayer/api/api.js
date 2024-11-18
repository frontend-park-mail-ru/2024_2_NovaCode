import { API_URL } from '../../../shared/config/index.js';
import { GET, POST, DELETE } from '../../../shared/api/index.js';

export class FooterPlayerAPI {
	/**
	 * Url path to backend api which returns tracks
	 *
	 */
	url;

	/**
	 * Initializes the FooterPlayerAPI.
	 *
	 */
	constructor() {
		this.url = `${API_URL}/api/v1/tracks/favorite`;
	}

	async addFavorite(trackID) {
		try {
			const response = await POST(`${this.url}/${trackID}`);
			if (response.error) {
				console.log('Error during add favorite track:');
			}
		} catch (error) {
			console.error(error);
		}
	}

	async deleteFavorite(trackID) {
		try {
			const response = await DELETE(`${this.url}/${trackID}`);
			if (response.error) {
				console.log('Error during delete favorite track:');
			}
		} catch (error) {
			console.error(error);
		}
	}

	async isFavorite(trackID) {
		try {
			const response = await GET(`${this.url}/${trackID}`);
			if (!response.error) {
				return response.data.exists;
			} else {
				console.log('Error during check favorite track:');
			}
		} catch (error) {
			console.error(error);
		}
	}
}
