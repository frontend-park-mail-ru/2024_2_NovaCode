import { GET, POST, DELETE } from "../../../shared/api/index.js";
import { API_ENDPOINTS } from "../../../shared/lib/index.js";
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
        console.error("Error during AlbumCard loading:", albumResponse.error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async addFavorite(albumID) {
    try {
      const response = await POST(
        `${API_ENDPOINTS.GET_FAVORITE_ALBUMS}/${albumID}`,
      );
      if (response.error) {
        console.log("Error during add favorite album:");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteFavorite(albumID) {
    try {
      const response = await DELETE(
        `${API_ENDPOINTS.GET_FAVORITE_ALBUMS}/${albumID}`,
      );
      if (response.error) {
        console.log("Error during delete favorite album:");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async isFavorite(albumID) {
    try {
      const response = await GET(
        `${API_ENDPOINTS.GET_FAVORITE_ALBUMS}/${albumID}`,
      );
      if (!response.error) {
        return response.data.exists;
      } else {
        console.log("Error during check favorite album:");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async GetAlbumLikesCount(albumID) {
    try {
      const response = await GET(`${API_ENDPOINTS.GET_ALBUM_LIKES_COUNT(albumID)}`);
      if (!response.error) {
        return response.data;
      } else {
        console.log("Error during album likes count loading:");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
