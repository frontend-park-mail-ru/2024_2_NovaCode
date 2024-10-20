import { eventBus } from '../../../shared/lib/index.js';
import { userStore } from '../../../entities/user/model/store.js';

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

	onSignInSuccess = (user) => {
		console.log('CHECK onSignInSuccess');
		this.render(user);
		eventBus.emit('navigate', '/');
	};

	onSignUpSuccess = (user) => {
		console.log('CHECK onSignUpSuccess');
		this.render(user);
		eventBus.emit('navigate', '/');
	};

	onSignOutSuccess = (user) => {
		console.log('CHECK onSignOutSuccess');
		this.render(user);
		eventBus.emit('navigate', '/signin');
	};

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

	async handleSignOut() {
		try {
			await userStore.signOut();
		} catch (error) {
			console.error('unable to sign out', error);
		}
	}

	handleSignIn() {
		eventBus.emit('navigate', '/signin');
	}

	handleSignup() {
		eventBus.emit('navigate', '/signup');
	}

	destructor() {
		this.offEvents();
	}
}
