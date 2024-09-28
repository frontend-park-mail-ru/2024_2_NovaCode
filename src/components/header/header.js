import { View } from '../../view.js';

export class HeaderView extends View {
    constructor(...args) {
        super(...args);
        this.root = document.querySelector('#header');
        this.eventListeners = [];
    }

    render() {
        const user = this.getCurrentUser();
        const html = this.getTemplate(user);
        this.root.innerHTML = html;
        this.bindEvents();
    }

    getTemplate(user) {
        const template = Handlebars.templates['header.hbs'];
        return template({ user });
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    bindEvents() {
        const playlistsButton = this.root.querySelector('#navbar_playlists_button');
        const loginButton = this.root.querySelector('#navbar_login_button');
        const signupButton = this.root.querySelector('#navbar_signup_button');
        const logoutButton = this.root.querySelector('#navbar_logout_button');

        if (playlistsButton) {
            this.addEventListener(playlistsButton, 'click', (event) => {
                event.preventDefault();
                history.pushState(null, null, '/playlists');
            });
        }
    
        if (loginButton) {
            this.addEventListener(loginButton, 'click', (event) => {
                event.preventDefault();
                history.pushState(null, null, '/login');
            });
        }
    
        if (signupButton) {
            this.addEventListener(signupButton, 'click', (event) => {
                event.preventDefault();
                history.pushState(null, null, '/signup');
            });
        }
    
        if (logoutButton) {
            this.addEventListener(logoutButton, 'click', (event) => {
                event.preventDefault();
                localStorage.removeItem('user'); // Clear user data on logout
                const headerView = new HeaderView();
                headerView.render(); // Re-render header without user data
                history.pushState(null, null, '/'); // Redirect to home
            });
        }
    }

    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.eventListeners.push({ element, event, handler });
    }

    removeEventListeners() {
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
    }

    clear() {
        this.removeEventListeners();
        this.root.innerHTML = '';
    }
}
