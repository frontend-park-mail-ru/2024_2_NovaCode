import { GET } from '../../../shared/api/index.js';
import { API_ENDPOINTS } from '../../../shared/lib/index.js';

export class UserCardAPI {
  userID;

  constructor(userId = null) {
    this.userId = userId ?? userStore.storage.user.id;
  }

  // async get() {
  //   try {
  //     const response = await GET(this.url);
  //     if (!response.error) {
  //       return response.data;
  //     } else {
  //       console.log('Error during AlbumList loading');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async getFavoriteAlbumsCount() {
    try {
      const response = await GET(`${API_ENDPOINTS.GET_FAVORITE_ALBUMS_COUNT(this.userId)}`);
      if (!response.error) {
        return response.data;
      } else {
        console.log("Error during favorite favorite albums count loading:");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getFavoriteArtistsCount() {
    try {
      const response = await GET(`${API_ENDPOINTS.GET_FAVORITE_ARTISTS_COUNT(this.userId)}`);
      if (!response.error) {
        return response.data;
      } else {
        console.log("Error during favorite favorite artists count loading:");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getFavoritePlaylistsCount() {
    try {
      const response = await GET(`${API_ENDPOINTS.GET_FAVORITE_PLAYLISTS_COUNT(this.userId)}`);
      if (!response.error) {
        return response.data;
      } else {
        console.log("Error during favorite favorite playlists count loading:");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getFavoriteTracksCount() {
    try {
      const response = await GET(`${API_ENDPOINTS.GET_FAVORITE_TRACKS_COUNT(this.userId)}`);
      if (!response.error) {
        return response.data;
      } else {
        console.log("Error during favorite favorite tracks count loading:");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
