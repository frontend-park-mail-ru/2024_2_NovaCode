export class AbortController {
    constructor() {
      this.signal = new AbortSignal(this);
      this.aborted = false;
      this.reason = null;
    }
  
    abort(reason = 'Aborted') {
      if (!this.aborted) {
        this.aborted = true;
        this.reason = reason;
        this.signal.dispatchEvent(new AbortEvent('abort', { reason }));
      }
    }
}
  
export class AbortSignal extends EventTarget {
    constructor(controller) {
      super();
      this.controller = controller;
    }
  
    get aborted() {
      return this.controller.aborted;
    }
  
    get reason() {
      return this.controller.reason;
    }
  }
  
  class AbortEvent extends Event {
    constructor(type, { reason }) {
      super(type);
      this.reason = reason;
    }
}
  
  