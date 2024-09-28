export class Router {
  constructor() {
    this.layout = [];
    this.routes = [];
    this.currentView = null;
  }

  registerPath(path, view) {
    const regexPath = path.replace(/\{(\w+)\}/g, "([^/]+)");
    this.routes.push({ path: new RegExp(`^${regexPath}$`), view: view });
  }

  registerLayout(view) {
    this.layout.push(new view(this));
  }

  renderLayout() {
    this.layout.forEach((item) => item.render());
  }

  listen() {
    window.addEventListener("popstate", () => this.goToImpl());
    this.renderLayout();
    this.goTo(window.location.pathname);
  }

  async goTo(path) {
    window.history.pushState({}, "", path);
    await this.goToImpl();
  }

  async goToImpl() {
    const currentPath = window.location.pathname;
    const targetRoute = this.findRoute(currentPath);

    if (this.currentView && typeof this.currentView.destructor === "function") {
      this.currentView.destructor();
    }

    if (targetRoute) {
      this.currentView = new targetRoute.view(this);

      if (typeof this.currentView.render !== "function") {
        console.error("target view does not have render method");
      }

      await this.currentView.render();

      if (targetRoute.updateLayout) {
        this.renderLayout();
      }
    } else {
      this.currentView = new ErrorView();
      await this.currentView.render();
    }
  }

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
