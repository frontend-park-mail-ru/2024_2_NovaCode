import { GET } from "../../../shared/api/index.js";
import { API_ENDPOINTS } from "../../../shared/lib/index.js";

export class PlaylistCarouselAPI {
  /**
   * Url path to backend api which returns playlists
   *
   */
  url;

  /**
   * Initializes the PlaylistCarouselAPI.
   *
   */
  constructor(args) {
    this.favorite = args?.favorite;
    this.userId = args?.userId;
    if (this.favorite && this.userId) {
      this.url = `${API_ENDPOINTS.GET_FAVORITE_PLAYLISTS}/byUser/${this.userId}`;
    } else if (this.userId) {
      this.url = API_ENDPOINTS.GET_USER_PLAYLISTS(this.userId)
    } else {
      this.url = API_ENDPOINTS.GET_POPULAR_PLAYLISTS;
    }
  }

  async get() {
    try {
      const response = await GET(this.url);
      if (!response.error) {
        return response.data;
      } else {
        console.log("Error during PlaylistCarousel loading:");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getFavorite() {
    try {
      const response = await GET(`${API_ENDPOINTS.GET_FAVORITE_PLAYLISTS}`);
      if (!response.error) {
        return response.data;
      } else {
        console.log("Error during PlaylistCarousel loading:");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
