import template from './csatWindow.hbs';
import './csatWindow.scss';
import inlineStyles from './csatWindow.scss?inline';
import { CSATWindowAPI } from '../api/api';
import * as styles from './csatWindow.scss';

export class CSATWindow {
	constructor(parent) {
		this.parent = parent ? parent : document.querySelector('#root');
		this.text = 'text';
		this.api = new CSATWindowAPI();
		this.current_question = -1;
		this.csatWindowIframe = null;
		this.iframeDoc = null;
	}

	async render() {
		if (this.current_question === -1) {
			await this.getQuestions();
			if (this.questions.length == 0) {
				return;
			}
		}
		
		if (!this.csatWindowIframe) {
			this.csatWindowIframe = document.createElement('iframe');
			this.csatWindowIframe.classList.add(styles['csat-iframe']);
			this.parent.appendChild(this.csatWindowIframe);

			this.iframeDoc = this.csatWindowIframe.contentWindow.document;

			this.iframeDoc.head.innerHTML += `<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap" rel="stylesheet">`;

			const style = this.iframeDoc.createElement('style');
			style.innerHTML = inlineStyles;
			this.iframeDoc.head.appendChild(style);
		}

		const div = this.iframeDoc.createElement('div');
		div.classList.add('csat_window');
		div.innerHTML = template({ styles, question: this.questions[this.current_question].question });

		this.iframeDoc.body.innerHTML = '';
		this.iframeDoc.body.appendChild(div);

		this.bindEvents();
		this.addEvents();
	}

	async getQuestions() {
		this.questions = await this.api.getQuestions();
		this.current_question = 0;
	}

	bindEvents() {
		const csatButtons = this.iframeDoc.body.querySelectorAll(`.${styles['rating_cast__block']}`);
		csatButtons.forEach((btn) => {
			btn.addEventListener("click", this.handleRatingClick.bind(this));
		});

		const submitButton = this.iframeDoc.body.querySelector(`.${styles['csat_window__submit']}`);
		submitButton.addEventListener("click", this.handleSubmit.bind(this));
	}

	handleRatingClick(event) {
		this.selectedScore = parseInt(event.target.dataset.value);
		this.highlightSelectedRating();
	}

	highlightSelectedRating() {
		const csatButtons = this.iframeDoc.body.querySelectorAll(`.${styles['rating_cast__block']}`);
		csatButtons.forEach((btn) => {
			btn.classList.remove(styles['rating_cast__block_active']);
		});

		if (this.selectedScore) {
			const selectedButton = Array.from(csatButtons).find(btn => parseInt(btn.dataset.value) === this.selectedScore);
            selectedButton.classList.add(styles['rating_cast__block_active']);
		}
	}

	async handleSubmit() {
		if (!this.selectedScore) {
			alert("Перед ответом нужно выбрать оценку!");
			return;
		}

		if (this.questions[this.current_question]) {
			const questionID = this.questions[this.current_question].id;
			await this.api.addScore(questionID, this.selectedScore);

			this.current_question++;

			if (this.current_question < this.questions.length) {
				this.render();
			}
            else {
                this.csatWindowIframe.remove();
            }
		}
	}

	handleClose() {
        this.csatWindowIframe.remove();
    }

	addEvents() {
        const btnClose = this.iframeDoc.body.querySelector(`.${styles['csat_window__btn_close']}`);
        btnClose.addEventListener('click', this.handleClose.bind(this));
    }

    removeEvents() {
        const btnClose = this.iframeDoc.body.querySelector(`.${styles['csat_window__btn_close']}`);
        btnClose.removeEventListener('click', this.handleClose);
    }

    destructor() {
        this.removeEvents();
    }
}
