export class View {
    constructor() {
        this.eventListeners = [];
    }

    render() {

    }

    destructor() {
        for (const object of this.eventListeners) {
            object.root.removeEventListener(object.event, object.listenFunc);
        }
    }
}