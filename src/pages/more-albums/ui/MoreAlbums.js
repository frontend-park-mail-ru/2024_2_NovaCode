import { AlbumListAPI } from '../../../widgets/albumList/index.js';
import { AlbumListView } from '../../../widgets/albumList/index.js';

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
		this.parent.innerHTML = '';

		if (this.entity === 'artist') {
			this.artistId = this.entityId;
		}

		const albumListAPI = new AlbumListAPI(this.artistId);
		const albums = await albumListAPI.get();
		const albumListView = new AlbumListView(this.parent, this.artistId);
		await albumListView.render(albums, false);
	}
}
