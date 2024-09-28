const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

export class Ajax {
    /**
     * Make a generic HTTP request
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
     * @param {string} endpoint - The endpoint to request
     * @param {Object} options - Options for the request (body, headers, etc.)
     * @returns {Object} - Response object containing status and body
     */
    static async request(method, endpoint, options = {}) {
        const { body = null, headers = {} } = options;
        
        // Build request options
        const requestOptions = {
            method,
            mode: 'cors',
            credentials: 'include', // Send credentials (cookies) with the request
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                ...headers,
            },
            body: body ? JSON.stringify(body) : null,
        };

        try {
            const response = await fetch(endpoint, requestOptions);

            let result;
            try {
                result = await response.json();
            } catch (err) {
                result = null; // Handle non-JSON responses gracefully
            }

            // Return the response with status and body
            return {
                status: response.status,
                body: result,
            };

        } catch (err) {
            console.error('Request failed:', err);
            return {
                status: 500,
                body: { error: 'Network Error' },
            };
        }
    }

    /**
     * Make a GET request
     * @param {string} endpoint - The endpoint to request
     * @param {Object} options - Optional headers or other settings
     * @returns {Object} - Response object
     */
    static async get(endpoint, options = {}) {
        return this.request(HTTP_METHODS.GET, endpoint, options);
    }

    /**
     * Make a POST request
     * @param {string} endpoint - The endpoint to request
     * @param {Object} body - The request body to send
     * @param {Object} options - Optional headers or other settings
     * @returns {Object} - Response object
     */
    static async post(endpoint, body, options = {}) {
        return this.request(HTTP_METHODS.POST, endpoint, { ...options, body });
    }

    /**
     * Make a PUT request
     * @param {string} endpoint - The endpoint to request
     * @param {Object} body - The request body to send
     * @param {Object} options - Optional headers or other settings
     * @returns {Object} - Response object
     */
    static async put(endpoint, body, options = {}) {
        return this.request(HTTP_METHODS.PUT, endpoint, { ...options, body });
    }

    /**
     * Make a DELETE request
     * @param {string} endpoint - The endpoint to request
     * @param {Object} options - Optional headers or other settings
     * @returns {Object} - Response object
     */
    static async delete(endpoint, options = {}) {
        return this.request(HTTP_METHODS.DELETE, endpoint, options);
    }
}
