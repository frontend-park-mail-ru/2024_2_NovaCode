import { API_CSAT_URL } from '../../../shared/config/index.js';
import { GET, POST } from '../../../shared/api/index.js';

export class CSATWindowAPI {
  /**
   * Url path to backend api which returns tracks
   *
   */
  url;

  constructor() {
    this.url = `${API_CSAT_URL}/api/v1/csat/questions`;
  }

  async getQuestions() {
    try {
      const response = await GET(this.url + '?topic=Общие');
      if (!response.error) {
        return response.data;
      } else {
        console.log('Error during questions');
        return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async addScore(questionID, score) {
    try {
      const response = await POST(`${this.url}/${questionID}/submit`, {
        body: { score: score },
      });
      if (response.error) {
        console.log('Error during add favorite track:');
      }
    } catch (error) {
      console.error(error);
    }
  }
}
