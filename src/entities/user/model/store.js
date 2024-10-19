import { STATUS_CODES } from "../../../shared/lib/index.js";
import { eventBus } from "../../../shared/lib/index.js";
import { signInRequest, signUpRequest, signOutRequest } from "../api/api.js";

class UserStore {
    constructor() {
        this.storage = {
            user: this.getUser() || {},
            error: null,
        };
    }

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    removeUser() {
        localStorage.removeItem('user');
    }

    signIn = async (user) => {
        try {
            const response = await signInRequest(user);
            
            switch (response.status) {
                case STATUS_CODES.OK:
                    const userData = {
                        username: response.data.user.username,
                        email: response.data.user.email,
                        token: response.data.token,
                        isAuthorized: true,
                    };
                    this.storage.user = userData;
                    this.saveUser(userData);
                    this.storage.error = null;
                    eventBus.emit('signInSuccess', this.storage.user);
                    break;
    
                case STATUS_CODES.UNAUTHORIZED:
                    this.storage.user = {
                        isAuthorized: false,
                    };
                    this.storage.error = response.error;
                    eventBus.emit('signInError', this.storage.error);
                    break;
                    
                default:
                    console.error('undefined status code:', response.status);
            }
        } catch (error) {
            this.storage.error = error;
            eventBus.emit('signInError', error);
            console.error('unable to sign in: ', error);
        }
    };
    

    signUp = async (user) => {
        try {
            const response = await signUpRequest(user);
            
            switch (response.status) {
                case STATUS_CODES.OK:
                    const userData = {
                        username: response.data.user.username,
                        email: response.data.user.email,
                        token: response.data.token,
                        isAuthorized: true,
                    };
                    this.storage.user = userData;
                    this.saveUser(userData);
                    this.storage.error = null;
                    eventBus.emit('signUpSuccess', this.storage.user);
                    break;
    
                case STATUS_CODES.UNAUTHORIZED:
                    this.storage.user = {
                        isAuthorized: false,
                    };
                    this.storage.error = response.error;
                    eventBus.emit('signUpError', this.storage.error);
                    break;
                    
                default:
                    console.error('undefined status code:', response.status);
            }
        } catch (error) {
            this.storage.error = error;
            eventBus.emit('signUpError', error);
            console.error('unable to sign up: ', error);
        }
    };
    

    signOut = async () => {
        try {
            const response = await signOutRequest();

            switch (response.status) {
                case STATUS_CODES.OK:
                    this.storage.user = { isAuthorized: false };
                    this.removeUser();
                    this.storage.error = null;
                    eventBus.emit('signOutSuccess');
                    break;
                
                default:
                    console.error('undefined status code:', response.status);
            }
        } catch (error) {
            this.storage.error = error;
            eventBus.emit('signOutError', error);
            console.error('unable to connect to server: ', error);
        }
    };
};

export const userStore = new UserStore();