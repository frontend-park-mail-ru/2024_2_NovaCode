import { eventBus } from "../../../shared/lib/index.js";
import { SearchLineView } from '../../../widgets/searchLine/index.js';
import { ArtistListView } from '../../../widgets/artistList/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { AlbumListView } from '../../../widgets/albumList/index.js';

export class SearchPage {
	/**
	 * Creates an instance of the View class.
	 */
	constructor() {
		this.parent = document.querySelector("#root");
	}

	async render() {
		this.parent.innerHTML = "";

		this.pageContent = document.createElement('div');
		this.pageContent.classList.add('page_content');
		this.parent.appendChild(this.pageContent);

		const searchLine = new SearchLineView(this.pageContent);
        await searchLine.render();

		this.onEvents();
	}

	onEvents() {
		eventBus.on("foundArtists", this.handleFoundArtists.bind(this));
		eventBus.on("foundAlbums", this.handleFoundAlbums.bind(this));
		eventBus.on("foundTracks", this.handleFoundTracks.bind(this));
	}

	offEvents() {
		eventBus.off("foundArtists", this.handleFoundArtists.bind(this));
		eventBus.off("foundAlbums", this.handleFoundAlbums.bind(this));
		eventBus.off("foundTracks", this.handleFoundTracks.bind(this));
	}

	async handleFoundArtists(artists) {
		const artistsElement = document.querySelector(".artists");
		if (artistsElement) {
			artistsElement.remove();
		}

		if (!artists) {
			return;
		}

		const artistListView = new ArtistListView(this.pageContent);
		await artistListView.render(artists);
	}

	async handleFoundAlbums(albums) {
		const albumsElement = document.querySelector(".albums");
		if (albumsElement) {
			albumsElement.remove();
		}

		if (!albums) {
			return;
		}

		const albumListView = new AlbumListView(this.pageContent);
		await albumListView.render(albums);
	}

	async handleFoundTracks(tracks) {
		const tracksElement = document.querySelector(".tracks");
		if (tracksElement) {
			tracksElement.remove();
		}

		if (!tracks) {
			return;
		}

		const trackListView = new TrackListView(this.pageContent);
		await trackListView.render(tracks, false);
	}

	destructor() {
		this.offEvents();
	}
}