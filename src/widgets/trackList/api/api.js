import { API_URL } from '../../../shared/config/index.js';
import { GET } from '../../../shared/api/index.js';

export class TrackListAPI {
	/**
	 * Url path to backend api which returns tracks
	 *
	 */
	url;

	/**
	 * Initializes the TrackListAPI.
	 *
	 * @param {string} [artistId] - The artist ID (optional)
	 * @param {string} [albumId] - The album ID (optional)
	 */
	constructor(args = {}) {
		if (args.artistId !== undefined) {
			this.url = `${API_URL}/api/v1/tracks/byArtistId/${args.artistId}`;
		} else if (args.albumId !== undefined) {
			this.url = `${API_URL}/api/v1/tracks/byAlbumId/${args.albumId}`;
		} else if (args.playlistId !== undefined) {
			this.url = `${API_URL}/api/v1/playlists/${args.playlistId}/tracks`;
		}else {
			this.url = `${API_URL}/api/v1/tracks`;
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
				// 	response.body.error || 'Не удалось загрузить плейлист',
				// 	'error',
				// );
				// console.error('Error during playlist loading:', error);
				console.log('Error during TrackList loading:');
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
