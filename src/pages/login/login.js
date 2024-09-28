import { View } from '../../view.js';
import { HeaderView } from '../../components/header/header.js';
import { Ajax } from '../../modules/ajax.js';
import { API_URL } from '../../modules/config.js';

export class LoginView extends View {
    constructor(...args) {
        super(...args);
        this.root = document.querySelector('#root');
    }

    render() {
        const template = Handlebars.templates['login.hbs'];
        this.root.innerHTML = template();
        this.bindEvents();
    }

    bindEvents() {
        const form = this.root.querySelector('#login-form');
        const messageBox = this.root.querySelector('#message-box');
        
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            messageBox.innerHTML = ''; // Clear previous messages

            const user = this.getFormData(form);

            try {
                const response = await this.loginUser(user);

                if (response.status === 200) {
                    delete user.password;
                    localStorage.setItem('user', JSON.stringify(user));

                    const headerView = new HeaderView();
                    headerView.render();

                    this.displayMessage(messageBox, 'Login successful!', 'success');
                    history.pushState(null, null, '/');
                } else {
                    this.displayMessage(messageBox, response.body.error || 'Login failed', 'error');
                }
            } catch (error) {
                this.displayMessage(messageBox, 'An error occurred during login. Please try again.', 'error');
                console.error('Error during login:', error);
            }
        });
    }

    /**
     * Extracts user data from the form
     * @param {HTMLFormElement} form
     * @returns {Object} User data
     */
    getFormData(form) {
        const formData = new FormData(form);
        return {
            username: formData.get('username'),
            password: formData.get('password'),
        };
    }

    /**
     * Sends login request to the server
     * @param {Object} user - User credentials
     * @returns {Object} Response from API
     */
    async loginUser(user) {
        const url = `${API_URL}/api/v1/auth/login`;
        return await Ajax.post(url, user);
    }

    /**
     * Displays a message to the user
     * @param {HTMLElement} messageBox - The DOM element to display the message
     * @param {string} message - The message to display
     * @param {string} type - Type of message ('success' or 'error')
     */
    displayMessage(messageBox, message, type) {
        messageBox.textContent = message;
        messageBox.className = type === 'success' ? 'message-success' : 'message-error';
    }
}
