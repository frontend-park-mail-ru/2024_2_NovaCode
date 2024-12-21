import { GET } from "../../../shared/api/index.js";
import { API_ENDPOINTS } from "../../../shared/lib/index.js";

export class GenreTracksAPI {
  url;

  constructor() {
    this.url = API_ENDPOINTS.GET_TRACKS_BY_GENRE;
  }

  async get(genreID) {
    try {
      const response = await GET(`${this.url}/${genreID}`);
      if (!response.error) {
        return response.data;
      } else if (response.status === 404) {
        return [];
      }
    } catch (error) {
      if (response.status === 404) {
        return [];
      }
      console.error(error);
    }
  }
}
