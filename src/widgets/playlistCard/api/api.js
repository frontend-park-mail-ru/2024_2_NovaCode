import { DELETE, GET } from '../../../shared/api/index.js';
import { API_ENDPOINTS } from '../../../shared/lib/index.js';

export class PlaylistCardAPI {
  /**
   * Url path to backend api which returns playlist
   *
   */
  url;

  /**
   * Initializes the PlaylistCardAPI.
   *
   * @param {string} [playlistId] - The playlist ID (optional)
   */
  constructor(playlistId) {
    this.url = API_ENDPOINTS.GET_PLAYLIST(playlistId);
  }

  async get() {
    try {
      const response = await GET(this.url);
      if (!response.error) {
        return response.data;
      } else {
        console.log('Error during PlaylistCard loading:');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async delete() {
    try {
      const response = await DELETE(this.url);
      if (!response.error) {
        return response.data;
      } else {
        console.log('Error during PlaylistCard loading:');
      }
    } catch (error) {
      console.error(error);
    }
  }
}
