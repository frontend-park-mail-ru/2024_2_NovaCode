import { userStore } from '../../../entities/user/index.js';
import { handleLink, S3_BUCKETS } from '../../../shared/lib/index.js';
import template from './userCard.hbs';
import * as styles from './userCard.scss';

export class UserCardView {
	parent;
	username;

	constructor(parent, username) {
		this.parent = parent ? parent : document.querySelector('#root');
		this.username = username;
	}

	async render() {
		let user = await userStore.getUser(this.username);

		if (user.image) {
			user.image = `${S3_BUCKETS.AVATAR_IMAGES}/${user.image}`;
		}

		const currentUser = userStore.storage.user;
		const isCurrentUser = currentUser.username === this.username;
		const userCardElement = document.createElement('div');
		userCardElement.classList.add('user_card');
		userCardElement.innerHTML = template({ styles, user, isCurrentUser });
		this.parent.appendChild(userCardElement);

		this.bindEvents();
	}

	bindEvents() {
		const links = this.parent.querySelectorAll('.link');
		links.forEach((link) => {
			link.addEventListener('click', handleLink);
		});
	}
}
