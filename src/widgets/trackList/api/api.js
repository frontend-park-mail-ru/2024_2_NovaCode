import { API_ENDPOINTS } from "../../../shared/lib/index.js";
import { GET } from "../../../shared/api/index.js";

export class TrackListAPI {
  /**
   * Url path to backend api which returns tracks
   *
   */
  url;

  /**
   * Initializes the TrackListAPI.
   *
   * @param {string} [artistId] - The artist ID (optional)
   * @param {string} [albumId] - The album ID (optional)
   */
  constructor(args = {}) {
    if (args.artistId !== undefined) {
      this.url = API_ENDPOINTS.GET_TRACKS_BY_ARTIST(args.artistId);
    } else if (args.albumId !== undefined) {
      this.url = API_ENDPOINTS.GET_TRACKS_BY_ALBUM(args.albumId);
    } else if (args.favorite !== undefined) {
      this.url = `${API_ENDPOINTS.GET_FAVORITE_TRACKS}/byUser/${args.userID}`;
    } else if (args.playlistId !== undefined) {
      this.url = API_ENDPOINTS.GET_TRACKS_BY_PLAYLIST(args.playlistId);
    } else {
      this.url = API_ENDPOINTS.GET_POPULAR_TRACKS;
    }
  }

  async get() {
    try {
      const response = await GET(this.url);
      if (!response.error) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  }
}
