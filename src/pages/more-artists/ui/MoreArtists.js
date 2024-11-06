import { TrackListAPI } from "../../../widgets/trackList/index.js";
import { ArtistListAPI } from "../../../widgets/artistList/index.js";
import { ArtistListView } from "../../../widgets/artistList/index.js";
import { FooterPlayerView } from "../../../widgets/footerPlayer/index.js";
import { userStore } from "../../../entities/user/model/store.js";
import { player } from "../../../shared/player/model/store.js";

export class MoreArtistsPage {
    /**
     * Creates an instance of the View class.
     */
    constructor() {
        this.parent = document.querySelector("#root");
    }

    async render() {
        const template = Handlebars.templates['MoreArtists.hbs'];
        this.parent.innerHTML = template();

        const artistListAPI = new ArtistListAPI();
        const artists = await artistListAPI.get();
        const artistListView = new ArtistListView(this.parent);
        await artistListView.render(artists, false);
        
        const trackListAPI = new TrackListAPI();
        const tracks = await trackListAPI.get();
        player.setTracks(tracks);

        const footPlayerView = new FooterPlayerView(this.parent);
        const user = userStore.loadUser();
        if (user) {
          await footPlayerView.render();
        }
    }
}