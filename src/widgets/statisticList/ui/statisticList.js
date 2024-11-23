import { eventBus } from '../../../shared/lib/eventbus.js';
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
    // const statisticListAPI = new StatisticListAPI();

    // let stats = await statisticListAPI.get();
    let stats = [
        {topic: "Общие", score: 5},
        {topic: "Особые", score: 4.5}
    ]

    const statisticListElement = document.createElement("div");
    statisticListElement.classList.add("statistic_list");
    statisticListElement.innerHTML = template({ stats });
    this.parent.appendChild(statisticListElement);

    const ratingContainers = statisticListElement.querySelectorAll('.rating__container');
    stats.forEach((stat, index) => {
      this.updateRating(stat.score, ratingContainers[index]);
    });

    // this.playPauseBtn = document.querySelector('.buttons__listen');
	// 	this.addEvents();
  }

  updateRating(rating, ratingContainer) {
    const ratingBlocks = ratingContainer.querySelectorAll('.rating__block');
    ratingBlocks.forEach((block, index) => {
      if (index < Math.floor(rating)) {
        block.classList.add('rating__block_active');
      } else {
        block.classList.remove('rating__block_active');
      }
      block.textContent = block.dataset.value;
    });
  }

//   addEvents() {
// 		this.playPauseBtn.addEventListener('click', this.handlePlayPauseBtn);
// 	}

// 	deleteEvents() {
// 		this.playPauseBtn.addEventListener('click', this.handlePlayPauseBtn);
// 	}

// 	handlePlayPauseBtn() {
// 		eventBus.emit('playPauseTrack');
// 	}

// 	destructor() {
// 		this.deleteEvents();
// 	}
}
