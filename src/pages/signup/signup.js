import { View } from '../../view.js';
import { HeaderView } from '../../components/header/header.js';
import { Ajax } from '../../modules/ajax.js';
import { API_URL } from '../../modules/config.js';

export class SignupView extends View {
    constructor(...args) {
        super(...args);
        this.root = document.querySelector('#root');
    }

    render() {
        const template = Handlebars.templates['signup.hbs'];
        this.root.innerHTML = template();
        this.bindEvents();
    }

    bindEvents() {
        const form = this.root.querySelector('#signup-form');
        const messageBox = this.root.querySelector('#message-box');
        
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            messageBox.innerHTML = '';
    
            const formData = new FormData(form);
            const user = this.getFormData(formData);
    
            try {
                const response = await this.registerUser(user);
    
                if (response.status === 200) {
                    delete user.password;
                    localStorage.setItem('user', JSON.stringify(user));
    
                    this.displayMessage(messageBox, 'Registration successful', 'success');
    
                    // Update the header view after successful registration
                    const headerView = new HeaderView();
                    headerView.render();
    
                    history.pushState(null, null, '/');
                } else {
                    this.displayMessage(messageBox, response.body.error || 'Registration failed', 'error');
                }
            } catch (error) {
                this.displayMessage(messageBox, 'An error occurred during registration. Please try again.', 'error');
                console.error('Error during registration:', error);
            }
        });
    }

    /**
     * Extracts user data from form
     * @param {FormData} formData
     * @returns {Object} User data
     */
    getFormData(formData) {
        return {
            email: formData.get('email'),
            username: formData.get('username'),
            password: formData.get('password'),
        };
    }

    /**
     * Sends registration request to the server
     * @param {Object} user - User data to be registered
     * @returns {Object} Response from API
     */
    async registerUser(user) {
        const url = `${API_URL}/api/v1/auth/register`;
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
