import { TrackListAPI } from "../../../widgets/trackList/index.js";
import { AlbumListAPI } from "../../../widgets/albumList/index.js";
import { AlbumListView } from "../../../widgets/albumList/index.js";
import { FooterPlayerView } from "../../../widgets/footerPlayer/index.js";
import { userStore } from "../../../entities/user/model/store.js";
import { player } from "../../../shared/player/model/store.js";

export class MoreAlbumsPage {
    /**
     * Creates an instance of the View class.
     */
    constructor(params) {
        this.parent = document.querySelector("#root");
        this.entity = params["entity"];
        this.entityId = params["id"];
    }

    async render() {
        if (this.entity = "artist") {
            this.artistId = this.entityId;
        }
        
        const template = Handlebars.templates['MoreAlbums.hbs'];
        this.parent.innerHTML = template();

        const albumListAPI = new AlbumListAPI(this.artistId);
        const albums = await albumListAPI.get();
        const albumListView = new AlbumListView(this.parent, this.artistId);
        await albumListView.render(albums, false);
        
        const trackListAPI = new TrackListAPI(this.artistId);
        const tracks = await trackListAPI.get();
        player.setTracks(tracks);

        const footPlayerView = new FooterPlayerView(this.parent);
        const user = userStore.loadUser();
        if (user) {
          await footPlayerView.render();
        }
    }
}