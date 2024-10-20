import {
	HTTP_STATUS,
	PUBLIC_ERRORS,
	eventBus,
} from '../../../shared/lib/index.js';
import { signInRequest, signUpRequest, signOutRequest } from '../api/api.js';

class UserStore {
	constructor() {
		this.storage = {
			user: this.getUser() || {},
			error: null,
		};
	}

	getUser() {
		const user = localStorage.getItem('user');
		return user ? JSON.parse(user) : null;
	}

	saveUser(user) {
		localStorage.setItem('user', JSON.stringify(user));
	}

	removeUser() {
		localStorage.removeItem('user');
	}

	signIn = async (user) => {
		try {
			const response = await signInRequest(user);

			switch (response.status) {
				case HTTP_STATUS.OK:
					const userData = {
						username: response.data.user.username,
						email: response.data.user.email,
						token: response.data.token,
						isAuthorized: true,
					};
					this.storage.user = userData;
					this.saveUser(userData);
					this.storage.error = null;
					eventBus.emit('signInSuccess', this.storage.user);
					break;

				case HTTP_STATUS.UNAUTHORIZED:
					this.storage.user = {
						isAuthorized: false,
					};
					this.storage.error = PUBLIC_ERRORS.INVALID_USERNAME_OR_PASSWORD;
					eventBus.emit('signInError', this.storage.error);
					break;

				default:
					this.storage.error = PUBLIC_ERRORS.UNKNOWN;
					eventBus.emit('signUpError', this.storage.error);
					console.error('undefined status code:', response.status);
			}
		} catch (error) {
			this.storage.error = PUBLIC_ERRORS.UNKNOWN;
			eventBus.emit('signInError', this.storage.error);
			console.error('unable to sign in: ', error);
		}
	};

	signUp = async (user) => {
		try {
			const response = await signUpRequest(user);

			switch (response.status) {
				case HTTP_STATUS.OK:
					const userData = {
						username: response.data.user.username,
						email: response.data.user.email,
						token: response.data.token,
						isAuthorized: true,
					};
					this.storage.user = userData;
					this.saveUser(userData);
					this.storage.error = null;
					eventBus.emit('signUpSuccess', this.storage.user);
					break;

				case HTTP_STATUS.BAD_REQUEST:
					this.storage.user = {
						isAuthorized: false,
					};
					this.storage.error = PUBLIC_ERRORS.USER_EXISTS;
					eventBus.emit('signUpError', this.storage.error);
					break;

				default:
					this.storage.error = PUBLIC_ERRORS.UNKNOWN;
					eventBus.emit('signUpError', this.storage.error);
					console.error('undefined status code:', response.status);
			}
		} catch (error) {
			this.storage.error = PUBLIC_ERRORS.UNKNOWN;
			eventBus.emit('signUpError', this.storage.error);
			console.error('unable to sign up: ', error);
		}
	};

	signOut = async () => {
		try {
			const response = await signOutRequest();

			switch (response.status) {
				case HTTP_STATUS.OK:
					this.storage.user = { isAuthorized: false };
					this.removeUser();
					this.storage.error = null;
					eventBus.emit('signOutSuccess');
					break;

				default:
					this.storage.error = PUBLIC_ERRORS.UNKNOWN;
					eventBus.emit('signOutError', this.storage.error);
					console.error('undefined status code:', response.status);
			}
		} catch (error) {
			this.storage.error = PUBLIC_ERRORS.UNKNOWN;
			eventBus.emit('signOutError', this.storage.error);
			console.error('unable to sign out: ', error);
		}
	};
}

export const userStore = new UserStore();
