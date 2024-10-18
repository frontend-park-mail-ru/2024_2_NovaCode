export class Page {
  /**
   * Creates an instance of the View class.
   *
   * @param {Object} router - The router instance responsible for navigating between views.
   */
  constructor(router) {
    this.router = router;
    this.eventListeners = [];
  }

  /**
   * Renders the view.
   * This method should be overridden by subclasses to provide specific rendering logic.
   */
  render() {}

  /**
   * Cleans up the view by removing all event listeners and resetting internal state.
   */
  destructor() {
    for (const object of this.eventListeners) {
      object.element.removeEventListener(object.event, object.listenFunc);
    }
    this.eventListeners = [];
  }

  /**
   * Adds an event listener to the specified element and tracks it for cleanup.
   *
   * @param {HTMLElement} element - The DOM element to attach the event listener to.
   * @param {string} event - The event type to listen for (e.g., 'click', 'input').
   * @param {Function} handler - The function to handle the event when triggered.
   */
  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.eventListeners.push({ element, event, listenFunc: handler });
  }
}

