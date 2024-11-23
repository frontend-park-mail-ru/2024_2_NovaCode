import { API_URL } from '../../../shared/config/index.js';
import { GET } from '../../../shared/api/index.js';
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
	constructor(statisticId) {
		this.statisticUrl = `${API_URL}/api/v1/statistics/${statisticId}`;
	}

	async get() {
		try {
			// Выполняем оба запроса параллельно
			const statisticResponse = await GET(this.statisticUrl);

			// Проверяем, есть ли ошибки в ответах
			if (!statisticResponse.error) {
				return statisticResponse.data;
			} else {
				console.error('Error during StatisticList loading:', statisticResponse.error);
			}
		} catch (error) {
			console.error(error);
		}
	}
}