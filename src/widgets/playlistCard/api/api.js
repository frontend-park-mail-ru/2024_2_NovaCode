import { GET, POST, DELETE } from "../../../shared/api/index.js";
import { API_ENDPOINTS } from "../../../shared/lib/index.js";

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
        console.log("Error during PlaylistCard loading:");
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
        console.log("Error during PlaylistCard loading:");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async addFavorite(playlistID) {
    try {
      const response = await POST(
        `${API_ENDPOINTS.GET_FAVORITE_PLAYLISTS}/${playlistID}`,
      );
      if (response.error) {
        console.log("Error during add favorite playlist:");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteFavorite(playlistID) {
    try {
      const response = await DELETE(
        `${API_ENDPOINTS.GET_FAVORITE_PLAYLISTS}/${playlistID}`,
      );
      if (response.error) {
        console.log("Error during delete favorite playlist:");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async isFavorite(playlistID) {
    try {
      const response = await GET(
        `${API_ENDPOINTS.GET_FAVORITE_PLAYLISTS}/${playlistID}`,
      );
      if (!response.error) {
        return response.data.exists;
      } else {
        console.log("Error during check favorite playlist:");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
