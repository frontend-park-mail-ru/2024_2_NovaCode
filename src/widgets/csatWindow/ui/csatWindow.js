import template from './csatWindow.hbs';
import './csatWindow.scss';
import styles from './csatWindow.scss?inline';

export class CSATWindow {
    constructor(parent) {
        this.parent = parent ? parent : document.querySelector("#root");
        this.text = 'text';
    }

    render() {
        this.csatWindowIframe = document.createElement("iframe");
        this.csatWindowIframe.classList.add('csat-iframe');
        this.parent.appendChild(this.csatWindowIframe);

        this.iframeDoc = this.csatWindowIframe.contentWindow.document;

        console.log(styles);
        const style = this.iframeDoc.createElement('style');
        style.innerHTML = styles;
        this.iframeDoc.head.appendChild(style);

        const div = document.createElement('div');
        div.classList.add("csat-window");
        div.innerHTML = template({ text: this.text });

        /* const btn = this.iframeDoc.querySelector('.csat-window__btn_no');
        btn.addEventListener('click', () => alert("btn works!")); */

        this.iframeDoc.body.appendChild(div);
    }
}