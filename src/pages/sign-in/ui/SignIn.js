import { eventBus } from '../../../shared/lib/index.js';
import { validate, VALIDATION_RULES } from '../../../shared/lib/index.js';
import { userStore } from '../../../entities/user/model/store.js';
import template from './SignIn.hbs';
import * as styles from './SignIn.scss';

export class SignInPage {
  parent;

  constructor() {
    this.parent = document.querySelector('#root');

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSignInSuccess = this.handleSignInSuccess.bind(this);
    this.handleSignInError = this.handleSignInError.bind(this);
  }

  render() {
    this.parent.innerHTML = '';

		this.pageContent = document.createElement('div');
		this.pageContent.classList.add('page_content');
		this.parent.appendChild(this.pageContent);

		const loginBlock = document.createElement('div');
		loginBlock.classList.add('login');
		loginBlock.innerHTML = template({ styles });
		this.pageContent.appendChild(loginBlock);

		this.bindEvents();
		this.onEvents();
    eventBus.emit('hidePlayer');
	}

  bindEvents() {
    const form = document.querySelector('#login-form');
    const links = this.parent.querySelectorAll('.link');

    if (form) {
      form.addEventListener('submit', this.handleSubmit);
    }
    links.forEach((link) => {
      link.addEventListener('click', (event) => this.handleLink(event));
    });
  }

  handleLink(event) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    eventBus.emit('navigate', href);
  }

  async handleSubmit(event) {
    event.preventDefault();

    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    let validationErrors = this.inputValidation(username, password);
    console.log(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      this.handleSignInError(validationErrors);
      return;
    }

    const user = { username, password };
    await userStore.signIn(user);
  }

  onEvents() {
    eventBus.on('signInSuccess', this.handleSignInSuccess);
    eventBus.on('signInError', this.handleSignInError);
  }

  offEvents() {
    eventBus.off('signInSuccess', this.handleSignInSuccess);
    eventBus.off('signInError', this.handleSignInError);
  }

  handleSignInSuccess() {
    eventBus.emit('navigate', '/');
  }

  handleSignInError(error) {
    document.querySelector('#login__username-error').textContent = '';
    document.querySelector('#login__password-error').textContent = '';
    document.querySelector('#login__general-error').textContent = '';
    document.querySelector('#username').classList.remove(styles['login__input-error']);
    document.querySelector('#password').classList.remove(styles['login__input-error']);

    if (error.username) {
      document.querySelector('#username').classList.add(styles['login__input_error']);
      document.querySelector('#login__username-error').textContent =
        error.username;
    }

    if (error.password) {
      document.querySelector('#password').classList.add(styles['login__input_error']);
      document.querySelector('#login__password-error').textContent =
        error.password;
    }

    if (typeof error === 'string') {
      document.querySelector('#login__general-error').textContent = error;
    }
  }

  inputValidation(username, password) {
    let validationErrors = {};

    const usernameError = validate(username, VALIDATION_RULES.username);
    if (usernameError) {
      validationErrors.username = usernameError;
    }

    const passwordError = validate(password, VALIDATION_RULES.password);
    if (passwordError) {
      validationErrors.password = passwordError;
    }

    console.log(validationErrors);
    return validationErrors;
  }

  destructor() {
    this.offEvents();
    const form = document.querySelector('#login-form');
    if (form) {
      form.removeEventListener('submit', this.handleSubmit);
    }
  }
}
