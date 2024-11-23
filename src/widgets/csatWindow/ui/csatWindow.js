import template from './csatWindow.hbs';
import './csatWindow.scss';
import styles from './csatWindow.scss?inline';
import { CSATWindowAPI } from '../api/api';

export class CSATWindow {
	constructor(parent) {
		this.parent = parent ? parent : document.querySelector('#root');
		this.text = 'text';
		this.api = new CSATWindowAPI();
	}

	async render() {
		this.csatWindowIframe = document.createElement('iframe');
		this.csatWindowIframe.classList.add('csat-iframe');
		this.parent.appendChild(this.csatWindowIframe);

		this.iframeDoc = this.csatWindowIframe.contentWindow.document;

		const style = this.iframeDoc.createElement('style');
		style.innerHTML = styles;
		this.iframeDoc.head.appendChild(style);
		
		await this.getQuestions();
		console.log(this.questions);

		const div = document.createElement('div');
		div.classList.add('csat_window');
		div.innerHTML = template({ question: this.questions[this.current_question].question });

		this.iframeDoc.body.appendChild(div);

	}

	async getQuestions() {
		this.current_question = 0;
		this.questions = await this.api.getQuestions();
	}
}
