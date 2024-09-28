import { HeaderView } from "../components/header/header.js";
import { SignupView } from "../pages/signup/signup.js";
import { LoginView } from "../pages/login/login.js";
import { FeedView } from "../pages/feed/feed.js";
import { Router } from "./router.js";

export class App {
    constructor() {
        this.headerView = new HeaderView();
        //this.feedView = new FeedView();
        this.router = new Router();
        this.initializeRoutes();
    }

    /**
     * Initializes application by rendering the header, feed and setting up routes.
     */
    start() {
        this.renderStart();
        this.router.listen();
    }

    /**
     * Renders the header and feed views on start page.
     */
    renderStart() {
        this.headerView.render();
        //this.feedView.render();
    }

    /**
     * Sets up the application routes.
     */
    initializeRoutes() {
        this.router.register('/', new FeedView());
        this.router.register('/login', new LoginView());
        this.router.register('/signup', new SignupView());
    }
}
