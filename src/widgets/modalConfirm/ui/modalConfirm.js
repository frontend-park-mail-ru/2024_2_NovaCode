import template from './modalConfirm.hbs';
import './modalConfirm.scss';

export class ModalConfirmView {;
    constructor(parent, text, onConfirm, onCancel) {
        this.parent = parent ? parent : document.querySelector("#root");
        this.text = text;
        this.onConfirm = onConfirm;
        this.onCancel = onCancel;
    }

    render() {
        this.modalConfirmElement = document.createElement("div");
        this.modalConfirmElement.classList.add("modal_confirm");
        this.modalConfirmElement.innerHTML = template({ text: this.text });
        this.parent.appendChild(this.modalConfirmElement);

        this.addEvents();
    }

    addEvents() {
        this.confirmBtn = this.modalConfirmElement.querySelector('.modal_confirm__btn_yes');
        this.confirmBtn.addEventListener('click', this.handleConfirm.bind(this));

        this.cancelBtn = this.modalConfirmElement.querySelector('.modal_confirm__btn_no');
        this.cancelBtn.addEventListener('click', this.handleCancel.bind(this));
    }

    handleConfirm() {
        if (this.onConfirm) {
            this.onConfirm();
        }
        this.modalConfirmElement.remove();
    }

    handleCancel() {
        if (this.onCancel) {
            this.onCancel();
        }
        this.modalConfirmElement.remove();
    }

    deleteEvents() {
        this.confirmBtn.removeEventListener('click', this.handleConfirm.bind(this));
        this.cancelBtn.removeEventListener('click', this.handleCancel.bind(this));
    }
}
