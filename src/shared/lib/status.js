import { PUBLIC_ERRORS } from "./constants/errors.js";
import { HTTP_STATUS } from "./constants/http.js";
import { eventBus } from "./eventbus.js";

export const handleStatus = (status, errorEvent) => {
    const message = null;
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        message = PUBLIC_ERRORS.UNAUTHORIZED;
        eventBus.emit(errorEvent, message);
        break;
      case HTTP_STATUS.FORBIDDEN:
        message = PUBLIC_ERRORS.FORBIDDEN;
        eventBus.emit(errorEvent, message);
        break;
      default:
        message = PUBLIC_ERRORS.UNKNOWN;
        eventBus.emit(errorEvent, message);
        break;
    }
};