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
  GET_CSRF_TOKEN: `${API_URL}/api/v1/auth/csrf`,
  GET_USER: (username) => `${API_URL}/api/v1/users/${username}`,
  UPDATE_USER: (userID) => `${API_URL}/api/v1/users/${userID}`,
  UPLOAD_AVATAR: (userID) => `${API_URL}/api/v1/users/${userID}/image`,
  GET_ALBUM: (artistID) => `${API_URL}/api/v1/albums/byArtistId/${artistID}`,
  FIND_ARTISTS: (query) => `${API_URL}/api/v1/artists/search?query=${query}`,
  FIND_ALBUMS: (query) => `${API_URL}/api/v1/albums/search?query=${query}`,
  FIND_TRACKS: (query) => `${API_URL}/api/v1/tracks/search?query=${query}`,
};

export const S3_BUCKETS = {
  AVATAR_IMAGES: `${S3_URL}/avatars`,
  ARTIST_IMAGES: `${S3_URL}/images/artists`,
  ALBUM_IMAGES: `${S3_URL}/images/albums`,
  TRACK_IMAGES: `${S3_URL}/images/tracks`,
  PLAYLIST_IMAGES: `${S3_URL}/images/playlists`,
  TRACK_FILES: `${S3_URL}/tracks`,
};

export const HEADERS = {
  CSRF_TOKEN: "X-Csrf-Token",
};
