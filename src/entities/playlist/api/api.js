import { eventBus, HTTP_STATUS } from '../../../shared/lib/index.js';
import { handleStatus } from '../../../shared/lib/status.js';
import {
    updatePlaylistImageRequest
} from './requests.js';

class PlaylistAPI {
    error;

    constructor() {
        this.error = null;
    }

	updateImage = async (playlistID, formData) => {
		try {
			const response = await updatePlaylistImageRequest(playlistID, formData);

			if (!response) {
				console.error('failed to update playlist image');
				return;
			}

			switch (response.status) {
				case HTTP_STATUS.OK:
					this.error = null;
					eventBus.emit('uploadPlaylistImageSuccess');
					break;

				default:
					this.error = handleStatus(
						response.status,
						'uploadPlaylistImageError',
					);
			}
		} catch (error) {
			console.error('error while updating playlist image:', error);
		}
	};
}

export const playlistAPI = new PlaylistAPI();
