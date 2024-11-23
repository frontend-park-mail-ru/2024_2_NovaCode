import template from './csatWindow.hbs';
import './csatWindow.scss';
import styles from './csatWindow.scss?inline';

export class ModalConfirmView {
    constructor(parent) {
        this.parent = parent ? parent : document.querySelector("#root");
        this.text = 'text';
    }

    render() {
        this.modalConfirmIframe = document.createElement("iframe");
        this.parent.appendChild(this.modalConfirmIframe);
        this.modalConfirmIframe.style.width = '100%';
        this.modalConfirmIframe.style.height = '100%';
        this.modalConfirmIframe.style.border = 'none';
        this.modalConfirmIframe.style.position = 'fixed';
        this.modalConfirmIframe.style.top = '0';
        this.modalConfirmIframe.style.left = '0';
        this.modalConfirmIframe.style.zIndex = '9999';

        this.modalConfirmIframe = document.querySelector('iframe');
        this.iframeDoc = this.modalConfirmIframe.contentWindow.document;

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