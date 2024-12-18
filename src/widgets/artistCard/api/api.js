import { GET, POST, DELETE } from "../../../shared/api/index.js";
import { API_ENDPOINTS } from "../../../shared/lib/index.js";
export class ArtistCardAPI {
  /**
   * Url path to backend api which returns artist
   *
   */
  url;

  /**
   * Initializes the ArtistCardAPI.
   *
   * @param {string} [artistId] - The artist ID (optional)
   */
  constructor(artistId) {
    this.artistUrl = API_ENDPOINTS.GET_ARTIST(artistId);
    this.genresUrl = API_ENDPOINTS.GET_GENRES_BY_ARTIST(artistId);
  }

  async get() {
    try {
      const [artistResponse, genresResponse] = await Promise.all([
        GET(this.artistUrl),
        GET(this.genresUrl),
      ]);

      if (!artistResponse.error && !genresResponse.error) {
        return [artistResponse.data, genresResponse.data];
      } else {
        console.error(
          "Error during ArtistCard loading:",
          artistResponse.error || genresResponse.error,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async addFavorite(artistID) {
    try {
      const response = await POST(
        `${API_ENDPOINTS.GET_FAVORITE_ARTIST}/${artistID}`,
      );
      if (response.error) {
        console.log("Error during add favorite artist:");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteFavorite(artistID) {
    try {
      const response = await DELETE(
        `${API_ENDPOINTS.GET_FAVORITE_ARTIST}/${artistID}`,
      );
      if (response.error) {
        console.log("Error during delete favorite artist:");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async isFavorite(artistID) {
    try {
      const response = await GET(
        `${API_ENDPOINTS.GET_FAVORITE_ARTIST}/${artistID}`,
      );
      if (!response.error) {
        return response.data.exists;
      } else {
        console.log("Error during check favorite artist:");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async GetArtistLikesCount(artistID) {
    try {
      const response = await GET(`${API_ENDPOINTS.GET_ARTIST_LIKES_COUNT(artistID)}`);
      if (!response.error) {
        return response.data;
      } else {
        console.log("Error during artist likes count loading:");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
