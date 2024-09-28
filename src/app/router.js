import { ErrorView } from '../pages/error/error.js';

/**
 * Class representing a single-page application router.
 */
export class Router {
    /**
     * Initializes the router with default settings.
     */
    constructor() {
        this.routes = [];
        this.rootPath = '/';
        this.currentPath = '';
        this.currentView = null;
        this.updateInterval = null;
    }

    /**
     * Registers a new route with its associated view.
     * @param {string} path - The route path.
     * @param {Object} view - The view instance corresponding to the route.
     */
    register(path, view) {
        const completePath = this.rootPath + path;
        this.routes.push({ path: completePath, view });
    }

    /**
     * Activates the router to start listening for path changes.
     */
    listen() {
        clearInterval(this.updateInterval);
        this.updateInterval = setInterval(async () => {
            const newPath = window.location.pathname;
            if (this.activePath !== newPath) {
                await this.navigateTo(newPath);
                this.activePath = newPath;
            }
        }, 100);

        this.navigateTo(this.activePath);
    }

    /**
     * Navigates to the specified path and renders the appropriate view.
     * @async
     * @param {string} path - The target path to navigate to.
     */
    async navigateTo(path) {
        const resolvedURL = decodeURI(this.rootPath + path);
        const matchedRoute = this.findMatchingRoute(resolvedURL);

        this.activePath = encodeURI(resolvedURL);
        
        if (matchedRoute) {
            this.currentView = matchedRoute.view;
            await matchedRoute.view.render(...matchedRoute.params);
        } else {
            this.currentView = new ErrorView();
            await this.currentView.render();
        }
        
        this.triggerNavigationEvent();
    }

    /**
     * Finds the route that matches the provided URL.
     * @param {string} url - The URL to match against registered routes.
     * @returns {Object|null} The matching route object or null if not found.
     */
    findMatchingRoute(url) {
        for (const route of this.routes) {
            const routeSegments = route.path.split('/');
            const urlSegments = url.split('/');
            const params = [];

            if (routeSegments.length !== urlSegments.length) continue;

            let matchFound = true;
            for (let i = 0; i < routeSegments.length; i++) {
                const routeSegment = routeSegments[i];
                const urlSegment = urlSegments[i];

                if (routeSegment.startsWith('{') && routeSegment.endsWith('}')) {
                    // Capture dynamic segments
                    params.push(urlSegment);
                } else if (routeSegment !== urlSegment) {
                    matchFound = false;
                    break;
                }
            }

            if (matchFound) {
                return { view: route.view, params };
            }
        }

        return null;
    }

    /**
     * Dispatches a custom event to indicate navigation has occurred.
     */
    triggerNavigationEvent() {
        const navEvent = new Event('navigationChange');
        dispatchEvent(navEvent);
    }

    /**
     * Navigates back in the history stack.
     */
    goBack() {
        window.history.back();
    }

    /**
     * Navigates forward in the history stack.
     */
    goForward() {
        window.history.forward();
    }
}
