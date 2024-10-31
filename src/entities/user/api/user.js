import { API_ENDPOINTS } from "../../../shared/lib/index.js";
import { GET, POST, PUT } from "../../../shared/api/index.js";
import { API_URL } from "../../../shared/config/index.js";

/**
 * Fetches user data from the server for the specified username.
 * @param {string} username - User's unique username
 * @returns {Promise<Object|null>} User data or null if an error occurs
 */
export const getUserRequest = async (username) => {
  const url = API_ENDPOINTS.GET_USER(username);
  return await GET(url);
};

/**
 * Sends an avatar update request to the server for the specified user.
 * @param {string} userID - User's unique identifier
 * @param {FormData} formData - Form data containing the avatar image file
 * @returns {Promise<Object>} response from the server
 */
export const updateAvatarRequest = async (userID, formData) => {
  const url = API_ENDPOINTS.UPLOAD_AVATAR(userID);
  return await POST(url, { body: formData });
};

/**
 * Sends user with updated fields to the server.
 * @param {Object} user - User data (username, email)
 * @returns {Promise<Object>} response from the server
 */
export const updateUserRequest = async (user) => {
  const url = API_ENDPOINTS.UPDATE_USER(user.id);
  return await PUT(url, { body: user });
};
