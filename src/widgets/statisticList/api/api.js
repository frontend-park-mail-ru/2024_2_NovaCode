import { GET } from '../../../shared/api/index.js';
import { API_ENDPOINTS } from '../../../shared/lib/index.js';
export class StatisticListAPI {
  /**
   * Url path to backend api which returns statistic
   *
   */
  url;

  /**
   * Initializes the StatisticListAPI.
   *
   */
  constructor() {
    this.statisticUrl = API_ENDPOINTS.GET_STAT;
  }

  async get() {
    try {
      const statisticResponse = await GET(this.statisticUrl);
      if (!statisticResponse.error) {
        return statisticResponse.data;
      } else {
        console.error(
          'Error during StatisticList loading:',
          statisticResponse.error,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
