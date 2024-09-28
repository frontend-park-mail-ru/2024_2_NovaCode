import { View } from '../../view.js';

export class PlaylistView extends View {
    #playlist
    constructor(playlist, ...args) {
        super(...args);
        this.root = document.querySelector('#root');
        this.#playlist = playlist;
        this.eventListeners = [];
    }

    get items() {
        return (this.#playlist);
    }

    render() {
        const html = this.getTemplate();
        this.root.innerHTML = html;
    }

    getTemplate() {
        const items = this.items.map(({name, artist}) => {
            var className = 'track-container';

            return {name, artist, className};
        });
        const template = Handlebars.templates['playlist.hbs'];
        return template({items});
    }

    clear() {
        this.root.innerHTML = '';
    }
}