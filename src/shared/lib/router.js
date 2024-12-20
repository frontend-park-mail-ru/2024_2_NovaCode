import { eventBus } from "./eventbus.js";
import { ErrorPage } from "../../pages/error/index.js";
import { ErrorRenderCancelled } from "./index.js"
import { AbortController } from "./abortController.js"

export class Router {
  constructor() {
    this.layout = [];
    this.routes = [];
    this.currentView = null;
    // this.isRendering = false;
    this.abortController = null;

    this.onPopState = this.onPopState.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.prevCount = 1;
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
    // if (this.isRendering) {
    //   return;
    // }
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
    // if (this.isRendering) {
    //   return;
    // }
    window.history.pushState({}, "", path);
    await this.goToImpl();
  }

  async goToImpl() {
    if (this.abortController) {
      this.abortController.abort('Cancelled due to new navigation');
    }
    this.abortController = new AbortController();

    const currentPath = window.location.pathname;
    const targetRoute = this.findRoute(currentPath);

    this.currentView?.destructor?.();

    if (targetRoute) {
      this.currentView = new targetRoute.view(targetRoute.params);
      await this.renderWithAbort(this.currentView.render());

      if (targetRoute.updateLayout) {
        this.renderLayout();
      }
    } else {
      this.currentView = new ErrorPage('Ошибка', 'Такой страницы не существует.');
      await this.renderWithAbort(this.currentView.render());
    }

    this.abortController = null;
  }

  async renderWithAbort(promise) {
    try {
      await promise;
    } catch (e) {
      if (e.name === 'AbortError') {
        console.log('Rendering aborted:', e.message);
      } else {
        throw e;
      }
    }
  }

  // /**
  //  * Implements the navigation logic for rendering views
  //  *
  //  * @returns {Promise<void>} promise that resolves when the rendering is complete
  //  */
  // async goToImpl() {
  //   const currentPath = window.location.pathname;
  //   const targetRoute = this.findRoute(currentPath);

  //   this.currentView?.destructor?.();

  //   if (targetRoute) {
  //     this.currentView = new targetRoute.view(targetRoute.params);
  //     await this.currentView?.render();

  //     if (targetRoute.updateLayout) {
  //       this.renderLayout();
  //     }
  //   } else {
  //     this.currentView = new ErrorPage('Ошибка', 'Такой страницы не существует.');
  //     await this.currentView.render();
  //   }
  // }

  // /**
  //  * Implements the navigation logic for rendering views
  //  *
  //  * @returns {Promise<void>} promise that resolves when the rendering is complete
  //  */
  // async goToImpl() {
  //   // this.isRendering = true;
  //   console.log(this.currentRenderPromise);
  //   if (this.currentRenderPromise) {
  //     this.currentRenderPromise.cancel();
  //   }
  
  //   const currentPath = window.location.pathname;
  //   const targetRoute = this.findRoute(currentPath);
  
  //   // Если есть текущий view, очищаем его
  //   this.currentView?.destructor?.();
  
  //   if (targetRoute) {
  //     this.currentView = new targetRoute.view(targetRoute.params);
  //     this.currentRenderPromise = this.currentView?.render();
  
  //     // Добавляем cancel в новое обещание рендера
  //     this.currentRenderPromise.cancel = () => {
  //       // return Promise.reject(new ErrorRenderCancelled('Рендер был отменен'));
  //       throw new ErrorRenderCancelled('Рендер был отменен');
  //     };
  
  //     if (targetRoute.updateLayout) {
  //       this.renderLayout();
  //     }
  //   } else {
  //     this.currentView = new ErrorPage('Ошибка', 'Такой страницы не существует.');
  //     this.currentRenderPromise = this.currentView.render();
  
  //     // Добавляем cancel в новое обещание рендера для ошибки
  //     this.currentRenderPromise.cancel = () => {
  //       // return Promise.reject(new ErrorRenderCancelled('Рендер был отменен'));
  //       throw new ErrorRenderCancelled('Рендер был отменен');
  //     };
  //   }

  //   // this.currentRenderPromise
  //   // .catch((e) => {
  //   //   console.log("Рендер отменен!!!!");
  //   //   console.log(this.currentRenderPromise);
  //   //   console.log(e);
  //   //   return Promise.reject(new ErrorRenderCancelled('Рендер был отменен!!!!'));
  //   // })
  //   // .finally(() => (this.currentRenderPromise = null));
  
  //   try {
  //     // Ожидаем завершения рендера
  //     await this.currentRenderPromise;
  //   } finally {
  //     console.log('finally');
  //     this.currentRenderPromise = null;
  //   }
  
  //   // this.isRendering = false;
  // }

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
