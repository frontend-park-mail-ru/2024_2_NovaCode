import { Header } from '../widgets/header/index.js';
import { FeedPage } from '../pages/feed/index.js';
import { SignUpPage } from '../pages/sign-up/index.js';
import { SignInPage } from '../pages/sign-in/index.js';
import { ArtistPage } from '../pages/artist/index.js';
import { AlbumPage } from '../pages/album/index.js';
import { ProfilePage } from '../pages/profile/index.js';
import { EditProfilePage } from '../pages/edit-profile/index.js';
import { MoreTracksPage } from '../pages/more-tracks/index.js';
import { MoreAlbumsPage } from '../pages/more-albums/index.js';
import { MoreArtistsPage } from '../pages/more-artists/index.js';
import { SearchPage } from '../pages/search/index.js';
import { StatisticPage } from '../pages/statistic/index.js';
import { MorePlaylistsPage } from '../pages/more-playlists/index.js';
import { PlaylistPage } from '../pages/playlist/index.js';
import { FooterPlayerView } from '../widgets/footerPlayer/index.js';

export const LAYOUT = [Header, FooterPlayerView];

/**
 * Define pages and their views
 */
export const PAGES = [
  {
    path: '/',
    view: FeedPage,
  },
  {
    path: '/signin',
    view: SignInPage,
  },
  {
    path: '/signup',
    view: SignUpPage,
  },
  {
    path: '/artist/{artistId}',
    view: ArtistPage,
  },
  {
    path: '/album/{albumId}',
    view: AlbumPage,
  },
  {
    path: '/playlist/{playlistId}',
    view: PlaylistPage,
  },
  {
    path: '/profiles/{username}',
    view: ProfilePage,
  },
  {
    path: '/profiles/{username}/edit',
    view: EditProfilePage,
  },
  {
    path: '/more_tracks/{type}',
    view: MoreTracksPage,
  },
  {
    path: '/more_tracks/{entity}/{id}',
    view: MoreTracksPage,
  },
  {
    path: '/more_albums/{type}',
    view: MoreAlbumsPage,
  },
  {
    path: '/more_albums/{entity}/{id}',
    view: MoreAlbumsPage,
  },
  {
    path: '/more_artists/{type}',
    view: MoreArtistsPage,
  },
  {
    path: '/search',
    view: SearchPage,
  },
  {
    path: '/statistic',
    view: StatisticPage,
  },
  {
    path: '/more_playlists/popular',
    view: MorePlaylistsPage,
  },
];
