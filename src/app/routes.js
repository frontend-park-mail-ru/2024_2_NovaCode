import { Header } from '../widgets/header/index.js';
import { FeedPage } from '../pages/feed/index.js';
import { SignUpPage } from '../pages/sign-up/index.js';
import { SignInPage } from '../pages/sign-in/index.js';
import { ArtistPage } from '../pages/artist/index.js';

export const LAYOUT = [Header];

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
];
