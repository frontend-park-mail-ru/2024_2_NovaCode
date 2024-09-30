import { HeaderView } from "../components/header/header.js";
import { LoginView } from "../pages/login/login.js";
import { SignupView } from "../pages/signup/signup.js";
import { FeedView } from "../pages/feed/feed.js";

// export const API_URL = "http://185.241.194.24:8080";
export const API_URL = "http://localhost:8080";

export const LAYOUT = [HeaderView];

/**
 * Define pages and their views
 */
export const PAGES = [
  {
    path: "/",
    view: FeedView,
    updateLayout: true,
  },
  {
    path: "/login",
    view: LoginView,
    updateLayout: true,
  },
  {
    path: "/signup",
    view: SignupView,
    updateLayout: true,
  },
];
