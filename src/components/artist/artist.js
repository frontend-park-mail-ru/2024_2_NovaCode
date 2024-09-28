import { View } from '../../view.js';

export class ArtistView extends View {
    #parent
    #artist
    constructor(parent, artist, ...args) {
        super(...args);
        this.root = document.querySelector('#root');
        this.#parent = parent;
        this.#artist = artist;
        this.eventListeners = [];
    }

    get items() {
        return (this.#artist);
    }

    render() {
        const html = this.getTemplate();
        this.#parent.innerHTML = html;
    }

    getTemplate() {
        const items = this.items;
        const template = Handlebars.templates['artist.hbs'];
        return template({ items });
    }

    clear() {
        this.root.innerHTML = '';
    }
}