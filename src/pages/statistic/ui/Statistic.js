import { eventBus } from '../../../shared/lib/eventbus.js';
import { StatisticListView } from '../../../widgets/statisticList/index.js';
import template from './Statistic.hbs';
import * as styles from './Statistic.scss';

export class StatisticPage {
  /**
   * Creates an instance of the View class.
   */
  constructor() {
    this.parent = document.querySelector('#root');
  }

  async render() {
    this.parent.innerHTML = '';

    this.parent.innerHTML = template({styles});

    const statisticListView = new StatisticListView();
    await statisticListView.render();

    eventBus.emit('hidePlayer');
  }
}
