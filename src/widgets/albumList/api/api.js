import { GET } from '../../../shared/api/index.js';
import { API_ENDPOINTS } from '../../../shared/lib/index.js';

export class AlbumListAPI {
  url;

  constructor(artistId = null) {
    if (artistId) {
      this.url = API_ENDPOINTS.GET_ALBUMS_BY_ARTIST(artistId);
    } else {
      this.url = API_ENDPOINTS.GET_ALL_ALBUMS;
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
