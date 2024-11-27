import { userStore } from '../../../entities/user';
import { DELETE, POST } from '../../../shared/api';
import { API_ENDPOINTS } from '../../../shared/lib';

export class TrackInPlaylistAPI {
  url;

  constructor(playlistId) {
    this.playlistId = playlistId;
    this.url = API_ENDPOINTS.ADD_DELETE_PLAYLIST(playlistId);
  }

  async addTrack(trackId) {
    /* const user = userStore.storage.user;
        if (!user.isAuth()) return; */
    try {
      const response = await POST(this.url, { body: { track_id: trackId } });
      if (response.error) {
        console.log('Error during adding track:', response.error);
      }
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteTrack(trackId) {
    try {
      const response = await DELETE(this.url, { body: { track_id: trackId } });
      if (response.error) {
        console.log('Error during adding track:', response.error);
      }
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
