import { View } from '../../view.js';

export class ErrorView extends View {
    constructor(...args) {
        super(...args);
        this.root = document.querySelector('#root');
    }

    render(message = 'Что-то пошло не так') {
        const template = Handlebars.templates['error.hbs'];
        this.root.innerHTML = template({ message });
        this.bindEvents();
    }

    bindEvents() {
        const refreshButton = this.root.querySelector('#refresh-button');
        const backButton = this.root.querySelector('#back-button');

        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                window.location.reload();
            });
        }

        if (backButton) {
            backButton.addEventListener('click', () => {
                window.history.back();
            });
        }
    }
}
