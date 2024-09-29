import { View } from '../../view.js';
import { PlaylistView } from '../../components/playlist/playlist.js';
import { ArtistView } from '../../components/artist/artist.js';
import { Ajax } from "../../modules/ajax.js";
import { API_URL } from "../../app/config.js";

/* const playlists = {
    "playlist 1": [
        {
            name: "intro",
            artist: "dj",
        },
        {
            name: "banger",
            artist: "dj",
        },
        {
            name: "outro",
            artist: "dj",
        },
    ],
    "playlist 2": [
        {
            name: "eeny",
            artist: "mc",
        },
        {
            name: "meeny",
            artist: "mc",
        },
        {
            name: "miny",
            artist: "mc",
        },
        {
            name: "moe",
            artist: "mc",
        },
    ],
}; */

/* const artists = [
    {
        src: '/273153700_118738253861831_5906416883131394354_n.jpeg',
        name: 'artist 1'
    },
    {
        src: '/272708814_1158833634855293_1743973316352152210_n.webp.jpg',
        name: 'artist 2'
    },
    {
        src: '/272464515_147005761018515_3100264353239753904_n.webp.jpg',
        name: 'artist 3'
    },
    {
        src: '/259096143_252774593424446_3292295880799640700_n.jpeg',
        name: 'artist 4'
    },
    {
        src: '/19984805_468099790230913_7469029070697660416_n.jpeg',
        name: 'artist 5'
    },
    {
        src: '/16583858_168051673696142_846500378588479488_n.jpeg',
        name: 'artist 6'
    }
]; */

export class FeedView extends View {
    constructor(router) {
        super(router);
        this.root = document.querySelector('#root');
    }

    render() {
        const messageBox = document.createElement('div');
        messageBox.id = 'message-box';
        this.root.appendChild(messageBox);

        this.renderPlaylists(messageBox);

        this.renderArtists(messageBox);
    }

    async renderPlaylists(messageBox) {
        try {
            const response = await this.playlistsRequest();
            const playlists = this.handleLoginResponse(response, messageBox);
            const playlist = new PlaylistView(playlists[0]);
            playlist.render();
        } catch (error) {
            this.displayMessage(
                messageBox,
                "An error occurred during playlist loading. Please try again later.",
                "error",
            );
            console.error("Error during playlist loading:", error);
        }
    }

    async playlistsRequest() {
        const url = `${API_URL}/api/v1/track/all`;
        return await Ajax.get(url);
    }

    handlePlaylistsResponse(response, messageBox) {
        if (response.status === 200) {
            return (response.body);
        } else {
            this.displayMessage(
                messageBox,
                response.body.error || "Login failed",
                "error",
            );
        }
    }

    async renderArtists(messageBox) {
        try {
            const response = await this.playlistsRequest();
            const artists = this.handleLoginResponse(response, messageBox);
            const artistElement = document.createElement('div');
            this.root.appendChild(artistElement);
            const artist = new ArtistView(artistElement, artists);
            artist.render();
        } catch (error) {
            this.displayMessage(
                messageBox,
                "An error occurred during artists loading. Please try again later.",
                "error",
            );
            console.error("Error during artists loading:", error);
        }
    }

    async artistsRequest() {
        const url = `${API_URL}/api/v1/artist/all`;
        return await Ajax.get(url);
    }

    handleArtistsResponse(response, messageBox) {
        if (response.status === 200) {
            return (response.body);
        } else {
            this.displayMessage(
                messageBox,
                response.body.error || "Login failed",
                "error",
            );
        }
    }

    displayMessage(messageBox, message, type) {
        messageBox.textContent = message;
        messageBox.className =
            type === "success" ? "message-success" : "message-error";
    }

}
