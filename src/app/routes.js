import { FeedPage } from 'pages/feed';
import { SignInPage, RegisterPage } from 'pages/sign-in';

export const LAYOUT = [HeaderPage];

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
		path: '/register',
		view: RegisterPage,
	},
];
