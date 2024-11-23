import { StatisticListAPI } from '../api/api.js';
import template from './statisticList.hbs';
import './statisticList.scss';

export class StatisticListView {
  /**
   * The parent HTML element.
   * @type {HTMLElement}
   */
  parent;

  /**
   * Initializes the StatisticListView.
   *
   */
  constructor(parent) {
    this.parent = parent ? parent : document.querySelector("#root");
  }

  /**
   * Renders the playlist view.
   */
  async render() {
    const statisticListAPI = new StatisticListAPI();
    const statisticsResponse = await statisticListAPI.get();

    let statistics = [];
    let prev = {topic: null, topicStat: []};
    let topicStats = [];
    let topic;
    statisticsResponse.forEach((response, i) => {
        topic = response.topic;
        if (prev.topic != topic && i != 0) {
            statistics.push({
                topic: topic,
                topic_stat: topicStats
            });
            topicStats = [];
        }
        topicStats.push({
            question: response.question,
            average_score: response.average_score

        });
        prev = response;
    });
    statistics.push({
        topic: topic,
        topic_stat: topicStats
    });

    const statisticListElement = document.createElement("div");
    statisticListElement.classList.add("statistic_list");
    statisticListElement.innerHTML = template({ statistics });
    this.parent.appendChild(statisticListElement);
    
    const stats = statisticListElement.querySelectorAll('.statistic__stats');
    
    stats.forEach((stat) => {
        let ratingContainers = stat.querySelectorAll('.rating__container');
        let questionStats = stat.querySelectorAll('.statistic__question_stat');
        questionStats.forEach((questionStat, i) => {
            this.updateRating(questionStat.dataset.averageScore, ratingContainers[i]);
        });
    });
  }

  updateRating(rating, ratingContainer) {
    const ratingBlocks = ratingContainer.querySelectorAll('.rating__block');
    ratingBlocks.forEach((block, index) => {
      if (index < Math.floor(rating)) {
        block.classList.add('rating__block_active');
      } else {
        block.classList.remove('rating__block_active');
      }
    });
  }
}