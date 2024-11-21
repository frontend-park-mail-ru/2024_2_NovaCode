import { API_URL } from '../../../shared/config/index.js';
import { GET } from '../../../shared/api/index.js';

export class AlbumListAPI {
	url;

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
				console.log('Error during AlbumList loading');
			}
		} catch (error) {
			console.error(error);
		}
	}
}
