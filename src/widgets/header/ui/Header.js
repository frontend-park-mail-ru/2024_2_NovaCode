import { eventBus } from '../../../shared/lib/index.js';
import { userStore } from '../../../entities/user/model/store.js';
import { player } from '../../../shared/player/model/store.js';

export class Header {
	parent;

	constructor() {
		this.parent = document.querySelector('#header');
	}

	render() {
		this.parent.innerHTML = '';

		const template = Handlebars.templates['Header.hbs'];
		const user = userStore.getUser();
		this.parent.innerHTML = template({ user });

		this.bindEvents();
		this.onEvents();
	}

	bindEvents() {
		this.parent.addEventListener('click', (event) => {
			if (event.target.id === 'header_logout_button') {
				this.handleSignOut();
			} else if (event.target.id === 'header_login_button') {
				this.handleSignIn();
			} else if (event.target.id === 'header_signup_button') {
				this.handleSignup();
			}
		});
	}

	handleSignIn() {
		eventBus.emit('navigate', '/signin');
	}

	handleSignup() {
		eventBus.emit('navigate', '/signup');
	}

	async handleSignOut() {
		try {
			await userStore.signOut();
			player.clearTracks();
			eventBus.emit('navigate', '/signin');
		} catch (error) {
			console.error('unable to sign out', error);
		}
	}

	onEvents() {
		eventBus.on('signInSuccess', this.onSignInSuccess);
		eventBus.on('signUpSuccess', this.onSignUpSuccess);
		eventBus.on('signOutSuccess', this.onSignOutSuccess);
	}

	offEvents() {
		eventBus.off('signInSuccess', this.onSignInSuccess);
		eventBus.off('signUpSuccess', this.onSignUpSuccess);
		eventBus.off('signOutSuccess', this.onSignOutSuccess);
	}

	onSignInSuccess = (user) => {
		this.render(user);
	};

	onSignUpSuccess = (user) => {
		this.render(user);
	};

	onSignOutSuccess = (user) => {
		this.render(user);
	};

	destructor() {
		this.offEvents();
	}
}
