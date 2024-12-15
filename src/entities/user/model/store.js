import {
	HTTP_STATUS,
	PUBLIC_ERRORS,
	eventBus,
} from '../../../shared/lib/index.js';
import { handleStatus } from '../../../shared/lib/status.js';
import {
	signInRequest,
	signUpRequest,
	signOutRequest,
	getCSRFTokenRequest,
	checkAuthRequest,
} from '../api/auth.js';
import {
	getUserRequest,
	updateAvatarRequest,
	updateUserRequest,
} from '../api/user.js';
import { Storage } from '../../../shared/lib/storage.js';

class UserStore {
	constructor() {
		this.storage = {
			user: Storage.load('user') || {},
			error: null,
		};
		this.csrfToken = null;
	}

	isAuth = () => {
		return this.storage.user?.isAuthorized;
	};

	checkAuth = async () => {
		try {
			const response = await checkAuthRequest();

			switch (response.status) {
				case HTTP_STATUS.OK:
					this.storage.error = null;

					await this.getCSRFToken();

					eventBus.emit('checkAuthSuccess');
					break;

				case HTTP_STATUS.UNAUTHORIZED:
					this.storage.user = {
						isAuthorized: false,
					};
					Storage.save('user', this.storage.user);
					this.storage.error = PUBLIC_ERRORS.UNAUTHORIZED;
					eventBus.emit('navigate', '/signin');
					break;

				default:
					this.storage.error = PUBLIC_ERRORS.UNKNOWN;
					eventBus.emit('checkAuthError', this.storage.error);
					console.error('undefined status code:', response.status);
					break;
			}
		} catch (error) {
			this.storage.error = PUBLIC_ERRORS.UNKNOWN;
			eventBus.emit('checkAuthError', this.storage.error);
			console.error('unable to check authorization: ', error);
		}
	};

	signIn = async (user) => {
		try {
			const response = await signInRequest(user);
			let userData;

			switch (response.status) {
				case HTTP_STATUS.OK:
					userData = {
						id: response.data.user.id,
						username: response.data.user.username,
						email: response.data.user.email,
						image: response.data.user.image,
						isAuthorized: true,
					};
					this.storage.user = userData;
					this.storage.error = null;
					Storage.save('user', this.storage.user);

					await this.getCSRFToken();

					eventBus.emit('signInSuccess', this.storage.user);
					break;

				case HTTP_STATUS.UNAUTHORIZED:
					this.storage.user = {
						isAuthorized: false,
					};
					Storage.save('user', this.storage.user);
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
			let userData;

			switch (response.status) {
				case HTTP_STATUS.OK:
					userData = {
						id: response.data.user.id,
						username: response.data.user.username,
						email: response.data.user.email,
						image: response.data.user.image,
						isAuthorized: true,
					};
					this.storage.user = userData;
					this.storage.error = null;
					Storage.save('user', this.storage.user);

					await this.getCSRFToken();

					eventBus.emit('signUpSuccess', this.storage.user);
					break;

				case HTTP_STATUS.BAD_REQUEST:
					this.storage.user = {
						isAuthorized: false,
					};
					Storage.save('user', this.storage.user);
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
					this.storage.error = null;
					Storage.save('user', this.storage.user);

					this.csrfToken = null;
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

	getUser = async (username) => {
		try {
			const response = await getUserRequest(username);

			if (!response) {
				console.error('failed to retrieve user');
				return;
			}

			switch (response.status) {
				case HTTP_STATUS.OK:
					// this.storage.user = { ...this.storage.user, ...response.data };
					// this.storage.error = null;
					//
					// eventBus.emit('getUserSuccess', this.storage.user);
					return response.data;

				default:
					this.storage.error = handleStatus(response.status, 'getUserError');
			}
		} catch (error) {
			console.error('error retrieving user:', error);
		}
	};

	updateAvatar = async (userID, formData) => {
		try {
			const response = await updateAvatarRequest(userID, formData);

			if (!response) {
				console.error('failed to update user avatar');
				return;
			}

			switch (response.status) {
				case HTTP_STATUS.OK:
					this.storage.user.image = response.data.image;
					this.storage.error = null;
					Storage.save('user', this.storage.user);

					eventBus.emit('updateAvatarSuccess', this.storage.user);
					break;

				default:
					this.storage.error = handleStatus(
						response.status,
						'updateAvatarError',
					);
			}
		} catch (error) {
			console.error('error updating user avatar:', error);
		}
	};

	updateUser = async (user) => {
		try {
			const response = await updateUserRequest(user);

			if (!response) {
				console.error('failed to update user fields');
				return;
			}

			let userFields;

			switch (response.status) {
				case HTTP_STATUS.OK:
					userFields = {
						username: response.data.username,
						email: response.data.email,
					};
					this.storage.user = { ...this.storage.user, ...userFields };
					this.storage.error = null;
					Storage.save('user', this.storage.user);

					eventBus.emit('updateUserSuccess', this.storage.user);
					break;

				default:
					this.storage.error = handleStatus(response.status, 'updateUserError');
			}
		} catch (error) {
			console.error('Error updating user fields:', error);
		}
	};

	getCSRFToken = async () => {
		try {
			const response = await getCSRFTokenRequest();

			if (!response) {
				console.error('failed to get csrf token');
				return;
			}

			switch (response.status) {
				case HTTP_STATUS.OK:
					this.csrfToken = response.data.csrf;
					this.storage.error = null;

					eventBus.emit('updateUserSuccess', this.csrfToken);
					break;
				default:
					this.storage.error = handleStatus(
						response.status,
						'getCSRFTokenError',
					);
			}
		} catch (error) {
			console.error('error getting user csrf token:', error);
		}
	};
}

export const userStore = new UserStore();
