import { View } from '../../view.js';
import { PlaylistView } from '../../components/playlist/playlist.js';
import { ArtistView } from '../../components/artist/artist.js';

export class FeedView extends View {

    /**
     * Initializes the FeedView instance with the given router.
     * 
     * @param {Router} router - The router instance used for navigation.
     */
    constructor(router) {
        super(router);
        this.root = document.querySelector('#root');
    }

    /**
     * Renders the feed view by displaying a playlist and an artist.
     * The method appends the artist view to the DOM after the playlist is rendered.
     */
    render() {
        const playlist = new PlaylistView(playlists['playlist 1']);
        playlist.render();
        const artistElement  = document.createElement('div');
        this.root.appendChild(artistElement);
        const artist = new ArtistView(artistElement, artists);
        artist.render();
    }
}
