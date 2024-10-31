import { UserCardView } from "../../../widgets/userCard/index.js";

export class ProfilePage {
    parent;
    username;

    constructor(params) {
        this.parent = document.querySelector('#root');
        this.username = params['username'];
    }

    async render() {
        this.parent.innerHTML = '';

        const userCardView = new UserCardView(this.parent, this.username);
        await userCardView.render();
    }
}
