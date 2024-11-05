import {
  HTTP_STATUS,
  PUBLIC_ERRORS,
  eventBus,
} from "../../../shared/lib/index.js";
import { handleStatus } from "../../../shared/lib/status.js";
import { S3_URL } from "../../../shared/config/api.js";

import { signInRequest, signUpRequest, signOutRequest } from "../api/auth.js";
import { getUserRequest, updateAvatarRequest, updateUserRequest } from "../api/user.js";

class UserStore {
  constructor() {
    this.storage = {
      user: this.loadUser() || {},
      error: null,
    };
  }

  loadUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  saveUser() {
    localStorage.setItem("user", JSON.stringify(this.storage.user));
  }

  removeUser() {
    localStorage.removeItem("user");
  }

  isAuth() {
    return this.storage.user?.isAuthorized;
  }

  signIn = async (user) => {
    try {
      const response = await signInRequest(user);

      switch (response.status) {
        case HTTP_STATUS.OK:
          const userData = {
            id: response.data.user.id,
            username: response.data.user.username,
            email: response.data.user.email,
            image: `${S3_URL}/avatars/${response.data.user.image}`,
            token: response.data.token,
            isAuthorized: true,
          };
          this.storage.user = userData;
          this.saveUser();
          this.storage.error = null;
          eventBus.emit("signInSuccess", this.storage.user);
          break;

        case HTTP_STATUS.UNAUTHORIZED:
          this.storage.user = {
            isAuthorized: false,
          };
          this.storage.error = PUBLIC_ERRORS.INVALID_USERNAME_OR_PASSWORD;
          eventBus.emit("signInError", this.storage.error);
          break;

        default:
          this.storage.error = PUBLIC_ERRORS.UNKNOWN;
          eventBus.emit("signUpError", this.storage.error);
          console.error("undefined status code:", response.status);
      }
    } catch (error) {
      this.storage.error = PUBLIC_ERRORS.UNKNOWN;
      eventBus.emit("signInError", this.storage.error);
      console.error("unable to sign in: ", error);
    }
  };

  signUp = async (user) => {
    try {
      const response = await signUpRequest(user);

      switch (response.status) {
        case HTTP_STATUS.OK:
          const userData = {
            id: response.data.user.id,
            username: response.data.user.username,
            email: response.data.user.email,
            image: `${S3_URL}/avatars/${response.data.user.image}`,
            token: response.data.token,
            isAuthorized: true,
          };
          this.storage.user = userData;
          this.saveUser();
          this.storage.error = null;
          eventBus.emit("signUpSuccess", this.storage.user);
          break;

        case HTTP_STATUS.BAD_REQUEST:
          this.storage.user = {
            isAuthorized: false,
          };
          this.storage.error = PUBLIC_ERRORS.USER_EXISTS;
          eventBus.emit("signUpError", this.storage.error);
          break;

        default:
          this.storage.error = PUBLIC_ERRORS.UNKNOWN;
          eventBus.emit("signUpError", this.storage.error);
          console.error("undefined status code:", response.status);
      }
    } catch (error) {
      this.storage.error = PUBLIC_ERRORS.UNKNOWN;
      eventBus.emit("signUpError", this.storage.error);
      console.error("unable to sign up: ", error);
    }
  };

  signOut = async () => {
    try {
      const response = await signOutRequest();

      switch (response.status) {
        case HTTP_STATUS.OK:
          this.storage.user = { isAuthorized: false };
          this.removeUser();
          this.storage.error = null;
          eventBus.emit("signOutSuccess");
          break;

        default:
          this.storage.error = PUBLIC_ERRORS.UNKNOWN;
          eventBus.emit("signOutError", this.storage.error);
          console.error("undefined status code:", response.status);
      }
    } catch (error) {
      this.storage.error = PUBLIC_ERRORS.UNKNOWN;
      eventBus.emit("signOutError", this.storage.error);
      console.error("unable to sign out: ", error);
    }
  };

  getUser = async (username) => {
    try {
      const response = await getUserRequest(username);
      
      if (!response) {
        console.error("failed to retrieve user");
        return;
      }

      switch (response.status) {
        case HTTP_STATUS.OK:
          this.storage.user = { ...this.storage.user, ...response.data };
          this.storage.user.image = `${S3_URL}/avatars/${response.data.image}`;
          this.storage.error = null;
          this.saveUser();
          eventBus.emit('getUserSuccess', this.storage.user);
          return response.data;

        default:
          this.storage.error = handleStatus(response.status, 'getUserError');
      }
    } catch (error) {
      console.error("error retrieving user:", error);
    }
  };

  updateAvatar = async (userID, formData) => {
    try {
      const response = await updateAvatarRequest(userID, formData);
      
      if (!response) {
        console.error("failed to update user avatar");
        return;
      }

      switch (response.status) {
        case HTTP_STATUS.OK:
          this.storage.user.image = `${S3_URL}/avatars/${response.data.image}`,
          this.storage.error = null;
          this.saveUser();
          eventBus.emit('updateAvatarSuccess', this.storage.user);
          break;

        default:
          this.storage.error = handleStatus(response.status, 'updateAvatarError');
      }
    } catch (error) {
      console.error("error updating user avatar:", error);
    }
  };

  updateUser = async (user) => {
    try {
      const response = await updateUserRequest(user);
      
      if (!response) {
        console.error("failed to update user fields");
        return;
      }

      switch (response.status) {
        case HTTP_STATUS.OK:
          const userFields = {
            username: response.data.username,
            email: response.data.email,
          };
          this.storage.user = { ...this.storage.user, ...userFields };
          this.storage.error = null;
          this.saveUser();
          eventBus.emit('updateUserSuccess', this.storage.user);
          break;

        default:
          this.storage.error = handleStatus(response.status, 'updateUserError');
      }
    } catch (error) {
      console.error("Error updating user fields:", error);
    }
  };
}

export const userStore = new UserStore();
