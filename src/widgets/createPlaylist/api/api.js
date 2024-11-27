import { POST } from '../../../shared/api';
import { API_ENDPOINTS } from '../../../shared/lib';

export class CreatePlaylistAPI {
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
    this.url = API_ENDPOINTS.GET_ALL_PLAYLISTS;
  }

  /**
   * Creates a new playlist by sending the name to the backend.
   *
   * @param {string} playlistName - The name of the playlist to create.
   * @returns {Promise<Object>} - The response from the backend.
   */
  async createPlaylist(playlistName) {
    try {
      const response = await POST(this.url, { body: { name: playlistName } });
      if (response.error) {
        console.log('Error during creating playlist:', response.error);
      }
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
