import { userStore } from '../../../entities/user';
import { GET } from '../../../shared/api';
import { API_ENDPOINTS } from '../../../shared/lib';

export class UserPlaylistsAPI {
  userId;
  url;

  constructor(userId = null) {
    this.userId = userId ?? userStore.storage.user.id;
    this.url = API_ENDPOINTS.GET_USER_PLAYLISTS(this.userId);
  }

  async get() {
    try {
      const response = await GET(this.url);
      if (response.error) {
        console.log('Error during adding track:', response.error);
      }
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async isMyPlaylist(playlistId) {
    const myPlaylists = await this.get();
    let isMyPlaylist = false;
    Array.from(myPlaylists).forEach((playlist) => {
      if (playlist.id == playlistId) {
        isMyPlaylist = true;
      }
    });
    return isMyPlaylist;
  }
}
