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

		const div = document.createElement('div');
		div.classList.add('csat_window');
		div.innerHTML = template({ question: this.questions[this.current_question].question });

		this.iframeDoc.body.appendChild(div);

		this.bindEvents();
	}

	async getQuestions() {
		this.current_question = 0;
		this.questions = await this.api.getQuestions();
	}

	bindEvents() {
		const csatButtons = this.iframeDoc.body.querySelectorAll(".rating_cast__block");
		csatButtons.forEach((btn) => {
			btn.addEventListener("click", this.handleRatingClick.bind(this));
		});

		const submitButton = this.iframeDoc.body.querySelector(".csat_window__submit");
		submitButton.addEventListener("click", this.handleSubmit.bind(this));
	}

	handleRatingClick(event) {
		this.selectedScore = parseInt(event.target.dataset.value);
		this.highlightSelectedRating();
		console.log('clicked');
	}

	highlightSelectedRating() {
		const csatButtons = this.iframeDoc.body.querySelectorAll(".rating_cast__block");
		csatButtons.forEach((btn) => {
			btn.classList.remove("rating_cast__block_active");
		});

		if (this.selectedScore) {
			const selectedButton = Array.from(csatButtons).find(btn => parseInt(btn.dataset.value) === this.selectedScore);
			selectedButton.classList.add("rating_cast__block_active");
		}
	}

	async handleSubmit() {
		if (!this.selectedScore) {
			alert("Перед ответом нужно выбрать оценку!");
			return;
		}

		const questionID = this.questions[this.current_question].id;

		await this.api.addScore(questionID, this.selectedScore);

		this.current_question++;

		if (this.current_question < this.questions.length) {
			this.render();
		}
	}
}
