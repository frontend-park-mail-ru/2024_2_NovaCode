const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export class Ajax {
  /**
   * Perform generic http request
   * @param {string} method - http method (GET, POST, PUT, DELETE, etc.)
   * @param {string} url - url to request
   * @param {Object} options - options for the request (body, headers, etc.)
   * @returns {Object} - response object containing status and body
   */
  static async request(method, url, options = {}) {
    const { body = null, headers = {} } = options;

    const requestOptions = {
      method,
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    };

    try {
      const response = await fetch(url, requestOptions);

      let result;
      try {
        result = await response.json();
      } catch (err) {
        result = null;
      }

      return {
        status: response.status,
        body: result,
      };
    } catch (err) {
      console.error("request failed:", err);
      return {
        status: 500,
        body: { error: "Network Error" },
      };
    }
  }

  /**
   * Perform GET request
   * @param {string} url - url to request
   * @param {Object} options - optional headers or other settings
   * @returns {Object} - response object
   */
  static async get(url, options = {}) {
    return this.request(HTTP_METHODS.GET, url, options);
  }

  /**
   * Perform POST request
   * @param {string} url - url to request
   * @param {Object} body - request body to send
   * @param {Object} options - optional headers or other settings
   * @returns {Object} - response object
   */
  static async post(url, body, options = {}) {
    return this.request(HTTP_METHODS.POST, url, { ...options, body });
  }

  /**
   * Perform PUT request
   * @param {string} url - url to request
   * @param {Object} body - request body to send
   * @param {Object} options - optional headers or other settings
   * @returns {Object} - response object
   */
  static async put(url, body, options = {}) {
    return this.request(HTTP_METHODS.PUT, url, { ...options, body });
  }

  /**
   * Perform DELETE request
   * @param {string} url - url to request
   * @param {Object} options - optional headers or other settings
   * @returns {Object} - response object
   */
  static async delete(url, options = {}) {
    return this.request(HTTP_METHODS.DELETE, url, options);
  }
}
