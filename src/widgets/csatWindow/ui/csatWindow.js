import template from './csatWindow.hbs';
import './csatWindow.scss';
import styles from './csatWindow.scss?inline';

export class CSATWindow {
	constructor(parent) {
		this.parent = parent ? parent : document.querySelector('#root');
		this.text = 'text';
	}

	render() {
		this.csatWindowIframe = document.createElement('iframe');
		this.csatWindowIframe.classList.add('csat-iframe');
		this.parent.appendChild(this.csatWindowIframe);

		this.iframeDoc = this.csatWindowIframe.contentWindow.document;

		const style = this.iframeDoc.createElement('style');
		style.innerHTML = styles;
		this.iframeDoc.head.appendChild(style);

		const div = document.createElement('div');
		div.classList.add('csat-window');
		div.innerHTML = template({ text: this.text });

		this.iframeDoc.body.appendChild(div);

		const btnNo = this.iframeDoc.documentElement.querySelector(
			'.csat-window__btn_no',
		);
		btnNo.addEventListener('click', () => alert('no works!'));

		const btnYes = this.iframeDoc.documentElement.querySelector(
			'.csat-window__btn_yes',
		);
		btnYes.addEventListener('click', () => alert('yes works!'));
	}
}
