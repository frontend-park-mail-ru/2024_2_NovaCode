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
   * @param {boolean} [favorite] - Are the tracks favorite (optional)
   */
  constructor(artistId = null, albumId = null, favorite = false) {
    if (artistId) {
      this.url = `${API_URL}/api/v1/tracks/byArtistId/${artistId}`;
    } else if (albumId) {
      this.url = `${API_URL}/api/v1/tracks/byAlbumId/${albumId}`;
    } else if (favorite) {
      this.url = `${API_URL}/api/v1/tracks/favorite`;
    } else {
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
