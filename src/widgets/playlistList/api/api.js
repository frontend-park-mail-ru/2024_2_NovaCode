import { GET } from "../../../shared/api/index.js";
import { API_ENDPOINTS } from "../../../shared/lib/index.js";

export class PlaylistListAPI {
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

  async get() {
    try {
      const response = await GET(this.url);
      if (!response.error) {
        return response.data;
      } else {
        console.log("Error during PlaylistList loading:");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getFavorite(userID) {
    try {
      const response = await GET(
        `${API_ENDPOINTS.GET_FAVORITE_PLAYLISTS}/byUser/${userID}`,
      );
      if (!response.error) {
        return response.data;
      } else {
        console.log("Error during PlaylistList loading:");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
