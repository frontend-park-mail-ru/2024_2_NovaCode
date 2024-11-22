import { eventBus } from '../../../shared/lib/eventbus.js';
import { validate, VALIDATION_RULES } from '../../../shared/lib/index.js';
import { userStore } from '../../../entities/user/model/store.js';
import template from './SignUp.hbs';
import './SignUp.scss';

export class SignUpPage {
	parent;

	constructor() {
		this.parent = document.querySelector('#root');

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSignUpSuccess = this.handleSignUpSuccess.bind(this);
		this.handleSignUpError = this.handleSignUpError.bind(this);
	}

	render() {
		this.parent.innerHTML = '';

		this.parent.innerHTML = template();
		this.bindEvents();
		this.onEvents();
	}

	bindEvents() {
		const form = document.querySelector('#signup-form');
		const links = this.parent.querySelectorAll('.link');

		if (form) {
			form.addEventListener('submit', this.handleSubmit);
		}
		links.forEach(link => {
			link.addEventListener('click', (event) => this.handleLink(event));
	  	});
	}

	handleLink(event) {
		event.preventDefault();
		const href = event.target.getAttribute('href')
		eventBus.emit('navigate', href);
	}

	async handleSubmit(event) {
		event.preventDefault();

		const username = document.querySelector('#username').value;
		const email = document.querySelector('#email').value;
		const password = document.querySelector('#password').value;

		let validationErrors = {};

		const usernameError = validate(username, VALIDATION_RULES.username);
		if (usernameError) {
			validationErrors.username = usernameError;
		}

		const emailError = validate(email, VALIDATION_RULES.email);
		if (emailError) {
			validationErrors.email = emailError;
		}

		const passwordError = validate(password, VALIDATION_RULES.password);
		if (passwordError) {
			validationErrors.password = passwordError;
		}

		if (Object.keys(validationErrors).length > 0) {
			this.handleSignUpError(validationErrors);
			return;
		}

		const user = { username, email, password };
		await userStore.signUp(user);
	}

	onEvents() {
		eventBus.on('signUpSuccess', this.handleSignUpSuccess);
		eventBus.on('signUpError', this.handleSignUpError);
	}

	offEvents() {
		eventBus.off('signUpSuccess', this.handleSignUpSuccess);
		eventBus.off('signUpError', this.handleSignUpError);
	}

	handleSignUpSuccess() {
		eventBus.emit('navigate', '/');
	}

	handleSignUpError(error) {
		document.querySelector('#register__username-error').textContent = '';
		document.querySelector('#register__email-error').textContent = '';
		document.querySelector('#register__password-error').textContent = '';
		document.querySelector('#register__general-error').textContent = '';
		document.querySelector('#username').classList.remove('register__input_error');
		document.querySelector('#email').classList.remove('register__input_error');
		document.querySelector('#password').classList.remove('register__input_error');

		if (error.username) {
			document.querySelector('#username').classList.add('register__input_error');
			document.querySelector('#register__username-error').textContent =
				error.username;
		}

		if (error.email) {
			document.querySelector('#email').classList.add('register__input_error');
			document.querySelector('#register__email-error').textContent =
				error.email;
		}

		if (error.password) {
			document.querySelector('#password').classList.add('register__input_error');
			document.querySelector('#register__password-error').textContent =
				error.password;
		}

		if (typeof error === 'string') {
			document.querySelector('#register__general-error').textContent = error;
		}
	}

	destructor() {
		this.offEvents();
		const form = document.querySelector('#signup-form');
		if (form) {
			form.removeEventListener('submit', this.handleSubmit);
		}
	}
}
