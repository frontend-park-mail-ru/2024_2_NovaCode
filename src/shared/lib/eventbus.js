class EventBus {
	events;

	constructor() {
		this.events = {};
	}

	on(event, callback) {
		if (!this.events[event]) {
			this.events[event] = new Set();
		}
		this.events[event].add(callback);
	}

	off(event, callback) {
		if (!this.events.has(event)) return;
		this.events[event].delete(callback);
	}

	emit(event, ...args) {
		if (!this.events.has(event)) return;
		this.events[event].forEach((callback) => {
			callback(...args);
		});
	}
}

export default new EventBus();
