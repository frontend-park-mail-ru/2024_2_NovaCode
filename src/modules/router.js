import { ErrorView } from "../pages/error/error.js";

export class Router {
  constructor() {
    this.layout = [];
    this.routes = [];
    this.currentView = null;
  }

  /**
   * Registers a path with its corresponding view
   *
   * @param {string} path - path pattern to register.
   * @param {Function} view - view constructor associated with path
   */
  registerPath(path, view) {
    const regexPath = path.replace(/\{(\w+)\}/g, "([^/]+)");
    this.routes.push({ path: new RegExp(`^${regexPath}$`), view: view });
  }

  /**
   * Registers layout view that will be rendered when layout is updated
   *
   * @param {Function} view - layout view constructor to register
   */
  registerLayout(view) {
    this.layout.push(new view(this));
  }

  /**
   * Renders all registered layout views
   */
  renderLayout() {
    this.layout.forEach((item) => item.render());
  }

  /**
   * Sets up event listeners for navigation
   */
  listen() {
    window.addEventListener("popstate", () => this.goToImpl());
    this.renderLayout();
    this.goTo(window.location.pathname);
  }

  /**
   * Navigates to specified path, updating browser history
   *
   * @param {string} path - path to navigate to
   * @returns {Promise<void>} promise that resolves when navigation is complete
   */
  async goTo(path) {
    window.history.pushState({}, "", path);
    await this.goToImpl();
  }

  /**
   * Implements navigation logic
   *
   * @returns {Promise<void>} promise that resolves when the rendering is complete
   */
  async goToImpl() {
    const currentPath = window.location.pathname;
    const targetRoute = this.findRoute(currentPath);

    this.currentView.destructor?.();

    if (targetRoute) {
      this.currentView = new targetRoute.view(this);

      await this.currentView.render?.();

      if (targetRoute.updateLayout) {
        this.renderLayout();
      }
    } else {
      this.currentView = new ErrorView();
      await this.currentView.render();
    }
  }

  /**
   * Finds route matching specified path
   *
   * @param {string} path - path to match against registered routes.
   * @returns {Object|null} object containing route parameters and view or nil
   */
  findRoute(path) {
    for (const route of this.routes) {
      const match = route.path.exec(path);
      if (match) {
        const params = match.slice(1);
        return {
          params: params,
          view: route.view,
          updateLayout: route.updateLayout,
        };
      }
    }
    return null;
  }
}
