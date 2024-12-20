import { API_ENDPOINTS } from "../../../shared/lib/index.js";
import { POST } from "../../../shared/api/index.js";

/**
 * Sends an image update request to the server for the specified playlist.
 * @param {string} userID - Playlist's unique identifier
 * @param {FormData} formData - Form data containing the image file
 * @returns {Promise<Object>} response from the server
 */
export const updatePlaylistImageRequest = async (playlistID, formData) => {
  const url = API_ENDPOINTS.UPLOAD_PLAYLIST_IMAGE(playlistID);
  return await POST(url, { body: formData });
};
