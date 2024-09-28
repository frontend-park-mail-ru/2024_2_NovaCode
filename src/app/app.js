import { Router } from "../modules/router.js";
import { LAYOUT, PAGES } from "./config.js";

export class App {
  constructor() {
    this.router = new Router();
    this.registerRoutes();
    this.registerLayout();
  }

  run() {
    this.router.listen();
  }

  registerRoutes() {
    PAGES.forEach(({ path, view }) => {
      this.router.registerPath(path, view);
    });
  }

  registerLayout() {
    LAYOUT.forEach((view) => this.router.registerLayout(view));
  }
}
