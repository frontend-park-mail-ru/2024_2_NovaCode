import { API_URL, S3_URL } from "../../config/index.js";

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
  GET_USER: (username) => `${API_URL}/api/v1/users/${username}`,
  UPDATE_USER: (userID) => `${API_URL}/api/v1/users/${userID}`,
  UPLOAD_AVATAR: (userID) => `${API_URL}/api/v1/users/${userID}/image`,
};

export const S3_BUCKETS = {
  AVATAR_IMAGES: `${S3_URL}/avatars`,
  ARTIST_IMAGES: `${S3_URL}/images/artists`,
  ALBUM_IMAGES: `${S3_URL}/images/albums`,
  TRACK_IMAGES: `${S3_URL}/images/tracks`,
  TRACK_FILES: `${S3_URL}/tracks`,
};
