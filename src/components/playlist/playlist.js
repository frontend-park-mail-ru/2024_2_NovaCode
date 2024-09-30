import { View } from '../../view.js';

/**
 * Generates the HTML template for the playlist using Handlebars.
 *
 * @returns {string} The generated HTML string.
 */
function convertDuration(duration) {
	const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export class PlaylistView extends View {
	#playlist;

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
		return this.#playlist;
	}

	/**
	 * Renders the playlist view.
	 */
	render() {
		const html = this.getTemplate();
		this.root.innerHTML = html;
	}

<<<<<<< HEAD
	/**
	 * Generates the HTML template for the playlist using Handlebars.
	 *
	 * @returns {string} The generated HTML string.
	 */
	getTemplate() {
		const items = this.items.map(({ name, artist, image, duration }) => {
			let className = 'track-container';
			duration = convertDuration(duration);

			return { name, artist, image, className, duration };
		});
		const template = Handlebars.templates['playlist.hbs'];
		return template({ items });
	}
=======
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
>>>>>>> main
}