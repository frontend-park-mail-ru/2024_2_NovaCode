import { GET } from '../../../shared/api/index.js';
import { API_ENDPOINTS } from '../../../shared/lib/index.js';

export class ArtistListAPI {
  /**
   * Url path to backend api which returns artists/
   *
   */
  url;

  /**
   * Initializes the ArtistListAPI.
   *
   */
  constructor() {
    this.url = API_ENDPOINTS.GET_ALL_ARTISTS;
  }

  async get() {
    try {
      const response = await GET(this.url);
      if (!response.error) {
        return response.data;
      } else {
        console.log('Error during ArtistList loading:');
      }
    } catch (error) {
      console.error(error);
    }
  }
}
