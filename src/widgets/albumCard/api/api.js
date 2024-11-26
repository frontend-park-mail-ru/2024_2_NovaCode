import { GET } from '../../../shared/api/index.js';
import { API_ENDPOINTS } from '../../../shared/lib/index.js';
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
    this.albumUrl = API_ENDPOINTS.GET_ALBUM(albumId);
  }

  async get() {
    try {
      const albumResponse = await GET(this.albumUrl);

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
