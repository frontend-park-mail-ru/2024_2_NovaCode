import { View } from '../../view.js';
import { PlaylistView } from '../../components/playlist/playlist.js';
import { ArtistView } from '../../components/artist/artist.js';

const playlists = {
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
};

const artists = [
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
];

export class FeedView extends View {
    constructor(router) {
        super(router);
        this.root = document.querySelector('#root');
    }

    render() {
        const playlist = new PlaylistView(playlists['playlist 1']);
        playlist.render();
        const artistElement  = document.createElement('div');
        this.root.appendChild(artistElement);
        const artist = new ArtistView(artistElement, artists);
        artist.render();
    }
}
