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
    } else if (args.favorite !== undefined) {
      this.url = `${API_URL}/api/v1/tracks/favorite`;
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
        console.log('Error during TrackList loading:');
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  }
}
