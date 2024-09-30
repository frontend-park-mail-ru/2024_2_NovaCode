import { Router } from "../modules/router.js";
import { LAYOUT, PAGES } from "./config.js";

export class App {
  constructor() {
    this.router = new Router();
    this.registerRoutes();
    this.registerLayout();
  }

  /**
   * Starts the application by making the router listen for path changes.
   */
  run() {
    this.router.listen();
  }

  /**
   * Registers all the defined pages in the application with the router.
   */
  registerRoutes() {
    PAGES.forEach(({ path, view }) => {
      this.router.registerPath(path, view);
    });
  }
  /**
   * Registers the application's layout views with the router.
   */
  registerLayout() {
    LAYOUT.forEach((view) => this.router.registerLayout(view));
  }
}
