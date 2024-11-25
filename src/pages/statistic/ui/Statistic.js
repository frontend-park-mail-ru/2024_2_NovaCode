// import { FooterPlayerView } from '../../../widgets/footerPlayer/index.js';
// import { userStore } from '../../../entities/user/model/store.js';
// import { player } from '../../../shared/player/model/store.js';
import { StatisticListView } from '../../../widgets/statisticList/index.js'
import template from './Statistic.hbs';
import './Statistic.scss';

export class StatisticPage {
	/**
	 * Creates an instance of the View class.
	 */
	constructor() {
		this.parent = document.querySelector('#root');
	}

	async render() {
		this.parent.innerHTML = '';

		this.parent.innerHTML = template();

        const statisticListView = new StatisticListView();
        await statisticListView.render();
	}
}
