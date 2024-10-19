import { API_URL } from "../config/index.js";

export const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

export const API_ENDPOINTS = {
    SIGN_IN: `${API_URL}/api/v1/auth/login`,
    SIGN_UP: `${API_URL}/api/v1/auth/register`,
    SIGN_OUT: `${API_URL}/api/v1/auth/logout`,
};