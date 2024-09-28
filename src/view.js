export class View {
    constructor(router) {
        this.router = router;
        this.eventListeners = [];
    }

    render() {}

    destructor() {
        for (const object of this.eventListeners) {
            object.element.removeEventListener(object.event, object.listenFunc);
        }
        this.eventListeners = [];
    }

    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.eventListeners.push({ element, event, listenFunc: handler });
    }
}