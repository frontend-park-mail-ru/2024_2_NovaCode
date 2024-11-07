import { AlbumListAPI } from '../../../widgets/albumList/index.js';
import { AlbumListView } from '../../../widgets/albumList/index.js';
import template from './MoreAlbums.hbs';
import './MoreAlbums.scss';

export class MoreAlbumsPage {
	/**
	 * Creates an instance of the View class.
	 */
	constructor(params) {
		this.parent = document.querySelector('#root');
		this.entity = params['entity'];
		this.entityId = params['id'];
	}

	async render() {
		if (this.entity === 'artist') {
			this.artistId = this.entityId;
		}

		this.parent.innerHTML = template();

		const albumListAPI = new AlbumListAPI(this.artistId);
		const albums = await albumListAPI.get();
		const albumListView = new AlbumListView(this.parent, this.artistId);
		await albumListView.render(albums, false);
	}
}
