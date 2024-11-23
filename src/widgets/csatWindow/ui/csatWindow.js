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
        this.parent.appendChild(this.csatWindowIframe);
        this.csatWindowIframe.style.width = 1024;
        this.csatWindowIframe.style.height = 768;
        this.csatWindowIframe.style += "-webkit-transform:scale(0.5);-moz-transform-scale(0.5)";
        this.csatWindowIframe.style.position = 'fixed';
/*         this.csatWindowIframe.style.top = '0';
        this.csatWindowIframe.style.left = '0'; */
        this.csatWindowIframe.style.zIndex = '9999';

        this.csatWindowIframe = document.querySelector('iframe');
        this.iframeDoc = this.csatWindowIframe.contentWindow.document;

        console.log(styles);
        const style = this.iframeDoc.createElement('style');
        style.innerHTML = styles;
        this.iframeDoc.head.appendChild(style);

        const div = document.createElement('div');
        div.classList.add("modal_confirm");
        div.innerHTML = template({ text: this.text });
        this.iframeDoc.body.appendChild(div);
    }
}