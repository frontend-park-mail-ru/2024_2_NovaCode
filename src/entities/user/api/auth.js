import { API_ENDPOINTS } from "../../../shared/lib/index.js";
import { GET, POST } from "../../../shared/api/index.js";

/**
 * Sends sign in request to the server using user data
 *
 * @param {Object} user - user data (username and password)
 * @returns {Promise<Object>} response from the server
 */
export const signInRequest = async (user) => {
  return await POST(API_ENDPOINTS.SIGN_IN, { body: user });
};

/**
 * Sends sign up request to server using user data
 *
 * @param {Object} user - user data to register (email, username, password)
 * @returns {Promise<Object>} response from the server
 */
export const signUpRequest = async (user) => {
  return await POST(API_ENDPOINTS.SIGN_UP, { body: user });
};

/**
 * Sends sign out request to server using user data
 *
 * @returns {Promise<Object>} response from the server
 */
export const signOutRequest = async () => {
  return await POST(API_ENDPOINTS.SIGN_OUT);
};

export const getCSRFTokenRequest = async () => {
  return await GET(API_ENDPOINTS.GET_CSRF_TOKEN);
};
