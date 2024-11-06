import { userStore } from '../../entities/user/index.js';
import { HEADERS } from '../lib/constants/http.js';

const HTTP_METHODS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
};

/**
 * Perform a generic HTTP request.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
 * @param {string} url - The URL to request.
 * @param {Object} options - Options for the request (body, headers, etc.).
 * @returns {Object} - The response containing data or error.
 */
const request = async (method, url, options = {}) => {
	const { body = null, headers = {} } = options;

	const csrfToken = userStore.storage.user?.csrfToken;
	const csrfTokenHeader = HEADERS.CSRF_TOKEN;

	const requestOptions = {
		method,
		credentials: 'include',
		headers: {
			...(!(body instanceof FormData) && {
				'Content-Type': 'application/json; charset=utf-8',
			}),
			...(csrfToken && { [csrfTokenHeader]: csrfToken }),
			...headers,
		},
		body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
	};

	try {
		const response = await fetch(url, requestOptions);

		let data = null;
		try {
			data = await response.json();
		} catch (e) {
			data = null;
		}

		if (!response.ok) {
			return {
				status: response.status,
				data: null,
				error: data || { message: 'unknown error' },
			};
		}

    return { status: data.statusCode, data, error: null };
  } catch (err) {
    console.error("request failed:", err);
    return { status: 500, data: null, error: { message: "server error" } };
  }
};

/**
 * Perform GET request.
 * @param {string} url - The URL to request.
 * @param {Object} options - Optional headers or other settings.
 * @returns {Object} - The response containing data or error.
 */
export const GET = async (url, options = {}) =>
	request(HTTP_METHODS.GET, url, options);

/**
 * Perform POST request.
 * @param {string} url - The URL to request.
 * @param {Object} options - Options containing body and optional headers.
 * @returns {Object} - The response containing data or error.
 */
export const POST = async (url, options = {}) =>
	request(HTTP_METHODS.POST, url, options);

/**
 * Perform PUT request.
 * @param {string} url - The URL to request.
 * @param {Object} options - Options containing body and optional headers.
 * @returns {Object} - The response containing data or error.
 */
export const PUT = async (url, options = {}) =>
	request(HTTP_METHODS.PUT, url, options);

/**
 * Perform DELETE request.
 * @param {string} url - The URL to request.
 * @param {Object} options - Optional headers or other settings.
 * @returns {Object} - The response containing data or error.
 */
export const DELETE = async (url, options = {}) =>
	request(HTTP_METHODS.DELETE, url, options);
