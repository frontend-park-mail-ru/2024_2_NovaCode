import { TrackListAPI } from "../../../widgets/trackList/index.js";
import { TrackListView } from "../../../widgets/trackList/index.js";
import { FooterPlayerView } from "../../../widgets/footerPlayer/index.js";
import { userStore } from "../../../entities/user/model/store.js";
import { player } from "../../../shared/player/model/store.js";
import template from './MoreTracks.hbs';
import './MoreTracks.scss';

export class MoreTracksPage {
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
        } else if (this.entity = "album") {
            this.albumId = this.entityId;
        }

        this.parent.innerHTML = template();

        const trackListAPI = new TrackListAPI(this.artistId, this.albumId);
        const trackListView = new TrackListView(this.parent, this.artistId, this.albumId);
        const tracks = await trackListAPI.get();
        await trackListView.render(tracks, false);

        player.setTracks(tracks);

        const footPlayerView = new FooterPlayerView(this.parent);
        const user = userStore.storage.user;
        if (user) {
          await footPlayerView.render();
        }
    }
}