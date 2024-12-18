import { UploadAvatarView } from '../../../widgets/uploadAvatar/index.js';
import { EditUserView } from '../../../widgets/editUser/index.js';
import { userStore } from '../../../entities/user/index.js';
import { PUBLIC_ERRORS } from '../../../shared/lib/index.js';
import { eventBus } from '../../../shared/lib/index.js';
import { player } from '../../../shared/player/model/store.js';

export class EditProfilePage {
	parent;
	username;

	constructor(params) {
		this.parent = document.querySelector('#root');
		this.username = params['username'];
	}

	async render() {
		this.parent.innerHTML = '';

		await userStore.checkAuth();
		if (!userStore.isAuth()) {
			console.error(PUBLIC_ERRORS.UNAUTHORIZED);
			return;
		}

		const user = userStore.storage.user;

		if (user.username != this.username) {
			console.error(PUBLIC_ERRORS.FORBIDDEN);
			eventBus.emit('navigate', '/');
			return;
		}

		this.pageContent = document.createElement('div');
		this.pageContent.classList.add('page_content');
		this.parent.appendChild(this.pageContent);

		const uploadAvatarView = new UploadAvatarView(this.pageContent, user.id);
		await uploadAvatarView.render();

		const editUserView = new EditUserView(this.pageContent, user.id);
		await editUserView.render();

		if (userStore.storage.user.isAuthorized && player.isReady()) {
			eventBus.emit('showPlayer');
		} else {
			eventBus.emit('hidePlayer');
		}
	}
}
