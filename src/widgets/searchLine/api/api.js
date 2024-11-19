import { API_ENDPOINTS } from "../../../shared/lib/index.js";
import { GET } from '../../../shared/api/index.js';

export class SearchLineAPI {
	static async findArtists(query) {
		try {
			const response = await GET(API_ENDPOINTS.FIND_ARTISTS(query));
			if (!response.error) {
				return response.data;
			}
		} catch (error) {
			console.error(error);
		}
	}

    static async findAlbums(query) {
		try {
			const response = await GET(API_ENDPOINTS.FIND_ALBUMS(query));
			if (!response.error) {
				return response.data;
			}
		} catch (error) {
			console.error(error);
		}
	}

    static async findTracks(query) {
		try {
			const response = await GET(API_ENDPOINTS.FIND_TRACKS(query));
			if (!response.error) {
				return response.data;
			}
		} catch (error) {
			console.error(error);
		}
	}
}
