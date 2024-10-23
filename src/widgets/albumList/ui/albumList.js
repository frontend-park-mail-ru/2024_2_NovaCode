import { AlbumView } from '../../../entities/album/index.js';
import { AlbumListAPI } from '../api/api.js';

export class AlbumListView {
	/**
	 * The parent HTML element.
	 * @type {HTMLElement}
	 */
	parent;

	/**
	 * Initializes the AlbumListView.
	 *
	 */
	constructor(parent, artistId) {
		this.parent = parent ? parent : document.querySelector('#root');
		this.artistId = artistId;
	}

	/**
	 * Renders the album view.
	 */
	async render() {
		const albumListAPI = new AlbumListAPI(this.artistId);
		let albums = await albumListAPI.get();

		const template = Handlebars.templates['albumList.hbs'];
		const albumListElement = document.createElement('div');
		albumListElement.innerHTML = template({}); 
		this.parent.appendChild(albumListElement);

		const albumsBlock = document.getElementById('albums');
		Array.from(albums).forEach((albums) => {
			const albumView = new AlbumView(albumsBlock);
			albumView.render(albums);
		});
	}
}
