import { eventBus } from '../../../shared/lib/index.js';
import { SearchLineView } from '../../../widgets/searchLine/index.js';
import { ArtistListView } from '../../../widgets/artistList/index.js';
import { TrackListView } from '../../../widgets/trackList/index.js';
import { AlbumListView } from '../../../widgets/albumList/index.js';
import { ErrorView } from '../../../widgets/error/index.js';

export class SearchPage {
  /**
   * Creates an instance of the View class.
   */
  constructor() {
    this.parent = document.querySelector('#root');
    this.eventHandlers = {
      foundArtists: this.handleFoundArtists.bind(this),
      foundAlbums: this.handleFoundAlbums.bind(this),
      foundTracks: this.handleFoundTracks.bind(this),
      emptySearchResult: this.handleNotFound.bind(this)
    };
  }

  async render() {
    this.parent.innerHTML = '';

		this.pageContent = document.createElement('div');
		this.pageContent.classList.add('page_content');
		this.parent.appendChild(this.pageContent);

		const searchLine = new SearchLineView(this.pageContent);
    await searchLine.render();

    this.onEvents();
    eventBus.emit('hidePlayer');
  }
  
  onEvents() {
    Object.keys(this.eventHandlers).forEach(event => {
      eventBus.on(event, this.eventHandlers[event]);
    });
  }
  
  offEvents() {
    Object.keys(this.eventHandlers).forEach(event => {
      eventBus.off(event, this.eventHandlers[event]);
    });
  }

  async handleFoundArtists(artists) {
    const errorElement = document.querySelector('.error');
    if (errorElement) {
      errorElement.remove();
    }

    const artistsElement = document.querySelector('.artists');
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
    const errorElement = document.querySelector('.error');
    if (errorElement) {
      errorElement.remove();
    }
  
    const albumsElement = document.querySelector('.albums');
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
    const errorElement = document.querySelector('.error');
    if (errorElement) {
      errorElement.remove();
    }

    const tracksElement = document.querySelector('.tracks');
    if (tracksElement) {
      tracksElement.remove();
    }

    if (!tracks) {
      return;
    }

    const trackListView = new TrackListView(this.pageContent);
    await trackListView.render(tracks, false);
  }

  async handleNotFound() {
    const errorElement = document.querySelector('.error');
    if (errorElement) {
      errorElement.remove();
    }

    const errorView = new ErrorView(null, 'Ничего не найдено', 'Попробуйте поискать что-то другое.');
    await errorView.render();
  }

  destructor() {
    this.offEvents();
  }
}
