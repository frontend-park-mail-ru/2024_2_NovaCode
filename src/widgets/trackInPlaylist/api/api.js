import { userStore } from "../../../entities/user";
import { DELETE, POST } from "../../../shared/api";
import { API_URL } from "../../../shared/config";

export class TrackInPlaylistAPI {
    url;

    constructor(playlistId) {
        this.playlistId = playlistId;
        this.url = `${ API_URL }/api/v1/playlists/${ playlistId }/tracks`;
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
