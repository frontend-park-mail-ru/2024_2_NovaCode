import { eventBus } from "./eventbus.js";
import { ErrorPage } from "../../pages/error/index.js";

export class Router {
  constructor() {
    this.layout = [];
    this.routes = [];
    this.currentView = null;
    this.isRendering = false;

    this.onPopState = this.onPopState.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
  }

  /**
   * Registers a path with its corresponding view
   *
   * @param {string} path - path pattern to register.
   * @param {Function} view - view constructor associated with path
   * @param {boolean} updateLayout - update layout before rendering
   */
  registerPath(path, view, updateLayout) {
    const paramNames = [];
    const regexPath = path.replace(/\{(\w+)\}/g, (_, paramName) => {
      paramNames.push(paramName);
      return "([^/]+)";
    });
    this.routes.push({
      path: new RegExp(`^${regexPath}$`),
      view: view,
      updateLayout: updateLayout,
      paramNames: paramNames,
    });
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
    window.addEventListener("popstate", this.onPopState);
    eventBus.on("navigate", this.onNavigate); // Listen for 'navigate' events

    this.renderLayout();
    this.goTo(window.location.pathname);
  }

  /**
   * Stop listening to navigation events
   */
  stop() {
    window.removeEventListener("popstate", this.onPopState);
    eventBus.off("navigate", this.onNavigate); // Stop listening for 'navigate' events
  }

  /**
   * Popstate event handler for browser back/forward navigation
   */
  async onPopState() {
    if (this.isRendering) {
      return;
    }
    eventBus.emit("popstate", window.location.pathname);
    await this.goToImpl();
  }

  /**
   * Event handler for 'navigate' events emitted from eventBus
   *
   * @param {string} path - The path to navigate to
   */
  async onNavigate(path) {
    await this.goTo(path);
  }

   /**
   * Navigates to the specified path and updates browser history
   *
   * @param {string} path - path to navigate to
   * @returns {Promise<void>} promise that resolves when navigation is complete
   */
  async goTo(path) {
    if (this.isRendering) {
      return;
    }
    window.history.pushState({}, "", path);
    await this.goToImpl();
  }

  /**
   * Implements the navigation logic for rendering views
   *
   * @returns {Promise<void>} promise that resolves when the rendering is complete
   */
  async goToImpl() {
    this.isRendering = true;

    const currentPath = window.location.pathname;
    const targetRoute = this.findRoute(currentPath);

    this.currentView?.destructor?.();

    if (targetRoute) {
      this.currentView = new targetRoute.view(targetRoute.params);
      await this.currentView?.render();

      if (targetRoute.updateLayout) {
        this.renderLayout();
      }
    } else {
      this.currentView = new ErrorPage('Ошибка', 'Такой страницы не существует.');
      await this.currentView.render();
    }
    this.isRendering = false;
  }

  /**
   * Finds a route matching the specified path
   *
   * @param {string} path - path to match against registered routes.
   * @returns {Object|null} object containing route parameters and view or null if not found
   */
  findRoute(path) {
    for (const route of this.routes) {
      const match = route.path.exec(path);
      if (match) {
        const params = match.slice(1).reduce((acc, param, index) => {
          const paramName = route.paramNames[index];
          acc[paramName] = param;
          return acc;
        }, {});
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
