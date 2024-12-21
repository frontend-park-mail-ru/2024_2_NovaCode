import { GET } from "../../../shared/api/index.js";
import { API_ENDPOINTS } from "../../../shared/lib/index.js";

export class GenresTableAPI {
  url;
  
  constructor() {
    this.url = API_ENDPOINTS.GET_GENRES;
  }
  
  async get() {
    try {
      const response = await GET(this.url);
      if (!response.error) {
        return response.data;
      } else {
        console.log("Error during genres loading:");
      }
    } catch (error) {
      console.error(error);
    }
  }
}