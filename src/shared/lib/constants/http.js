import {
  API_ALBUM_URL,
  API_ARTIST_URL,
  API_CSAT_URL,
  API_GENRE_URL,
  API_PLAYLIST_URL,
  API_TRACK_URL,
  API_USER_URL,
  S3_URL,
} from "../../config/index.js";

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const API_ENDPOINTS = {
  SIGN_IN: `${API_USER_URL}/api/v1/auth/login`,
  SIGN_UP: `${API_USER_URL}/api/v1/auth/register`,
  SIGN_OUT: `${API_USER_URL}/api/v1/auth/logout`,
  IS_AUTH: `${API_USER_URL}/api/v1/auth/health`,
  GET_CSRF_TOKEN: `${API_USER_URL}/api/v1/auth/csrf`,
  GET_USER: (username) => `${API_USER_URL}/api/v1/users/${username}`,
  UPDATE_USER: (userID) => `${API_USER_URL}/api/v1/users/${userID}`,
  UPLOAD_AVATAR: (userID) => `${API_USER_URL}/api/v1/users/${userID}/image`,

  GET_ALL_TRACKS: `${API_TRACK_URL}/api/v1/tracks`,
  GET_FAVORITE_TRACKS: `${API_TRACK_URL}/api/v1/tracks/favorite`,
  GET_TRACKS_BY_PLAYLIST: (playlistID) =>
    `${API_TRACK_URL}/api/v1/tracks/byPlaylistId/${playlistID}`,
  GET_TRACKS_BY_ALBUM: (albumID) =>
    `${API_TRACK_URL}/api/v1/tracks/byAlbumId/${albumID}`,
  GET_TRACKS_BY_ARTIST: (artistID) =>
    `${API_TRACK_URL}/api/v1/tracks/byArtistId/${artistID}`,
  FIND_TRACKS: (query) =>
    `${API_TRACK_URL}/api/v1/tracks/search?query=${query}`,

  GET_ALL_PLAYLISTS: `${API_PLAYLIST_URL}/api/v1/playlists`,
  GET_PLAYLIST: (playlistID) =>
    `${API_PLAYLIST_URL}/api/v1/playlists/${playlistID}`,
  ADD_DELETE_PLAYLIST: (playlistID) =>
    `${API_PLAYLIST_URL}/api/v1/playlists/${playlistID}/tracks`,
  GET_USER_PLAYLISTS: (userID) =>
    `${API_PLAYLIST_URL}/api/v1/playlists/${userID}/allPlaylists`,

  GET_ALL_ALBUMS: `${API_ALBUM_URL}/api/v1/albums`,
  GET_ALBUM: (albumID) => `${API_ALBUM_URL}/api/v1/albums/${albumID}`,
  GET_ALBUMS_BY_ARTIST: (artistID) =>
    `${API_ALBUM_URL}/api/v1/albums/byArtistId/${artistID}`,
  FIND_ALBUMS: (query) =>
    `${API_ALBUM_URL}/api/v1/albums/search?query=${query}`,

  GET_ALL_ARTISTS: `${API_ARTIST_URL}/api/v1/artists`,
  GET_ARTIST: (artistID) => `${API_ARTIST_URL}/api/v1/artists/${artistID}`,
  FIND_ARTISTS: (query) =>
    `${API_ARTIST_URL}/api/v1/artists/search?query=${query}`,

  GET_GENRES_BY_ARTIST: (artistID) =>
    `${API_GENRE_URL}/api/v1/genres/byArtistId/${artistID}`,

  GET_STAT: `${API_CSAT_URL}/api/v1/csat/stat`,
};

export const S3_BUCKETS = {
  AVATAR_IMAGES: `${S3_URL}/avatars`,
  ARTIST_IMAGES: `${S3_URL}/images/artists`,
  ALBUM_IMAGES: `${S3_URL}/images/albums`,
  PLAYLIST_IMAGES: `${S3_URL}/playlists`,
  TRACK_IMAGES: `${S3_URL}/images/tracks`,
  TRACK_FILES: `${S3_URL}/tracks`,
};

export const HEADERS = {
  CSRF_TOKEN: "X-Csrf-Token",
};
