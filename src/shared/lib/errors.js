export class ErrorRenderCancelled extends Error {
    constructor(message) {
      super(message);
      this.name = 'ErrorRenderCancelled';
    }
}