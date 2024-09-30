import { View } from '../../view.js';

export class PlaylistView extends View {
    #playlist

    /**
     * Initializes the PlaylistView.
     * 
     * @param {Array} playlist - Array of track objects to be rendered.
     * @param  {...any} args - Additional arguments to pass to the View superclass.
     */
    constructor(playlist, ...args) {
        super(...args);
        this.root = document.querySelector('#root');
        this.#playlist = playlist;
        this.eventListeners = [];
    }

    /**
     * Retrieves the playlist items.
     * 
     * @returns {Array} The playlist array.
     */
    get items() {
        return (this.#playlist);
    }

    /**
     * Renders the playlist view.
     */
    render() {
        const html = this.getTemplate();
        this.root.innerHTML = html;
    }

    /**
     * Generates the HTML template for the playlist using Handlebars.
     * 
     * @returns {string} The generated HTML string.
     */
    getTemplate() {
        console.log(this.items);
        const items = this.items.map(({name, artist, image}) => {
            let className = 'track-container';
            return {name, artist, image, className};
        });
        const template = Handlebars.templates['playlist.hbs'];
        return template({items});
    }
}