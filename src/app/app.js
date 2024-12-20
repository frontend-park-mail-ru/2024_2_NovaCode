import { userStore } from "../entities/user/index.js";
import { Router } from "../shared/lib/router.js";
import { LAYOUT, PAGES } from "./routes.js";

export class App {
  constructor() {
    this.router = new Router();
    this.registerRoutes();
    this.registerLayout();
  }

  /**
   * Starts the application by making the router listen for path changes.
   */
  async run() {
    await userStore.getCSRFToken();
    this.router.listen();
  }

  /**
   * Registers all the defined pages in the application with the router.
   */
  registerRoutes() {
    PAGES.forEach(({ path, view, updateLayout }) => {
      this.router.registerPath(path, view, updateLayout);
    });
  }
  /**
   * Registers the application's layout views with the router.
   */
  registerLayout() {
    LAYOUT.forEach((view) => this.router.registerLayout(view));
  }
}
