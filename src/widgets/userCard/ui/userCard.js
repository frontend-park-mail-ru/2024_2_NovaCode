import { userStore } from '../../../entities/user/index.js';
import { handleLink, S3_BUCKETS } from '../../../shared/lib/index.js';

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

		const isCurrentUser = userStore.storage.user.username === this.username;
		const template = Handlebars.templates['userCard.hbs'];
		const userCardElement = document.createElement('div');
		userCardElement.classList.add('user_card');
		userCardElement.innerHTML = template({ user, isCurrentUser });
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