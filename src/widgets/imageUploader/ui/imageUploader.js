import { eventBus } from "../../../shared/lib/index.js";
import template from "./imageUploader.hbs";
import * as styles from "./imageUploader.scss";

export class ImageUploaderView {
  parent;
  onSuccessEvent;
  inputID;
  formID;
  uploadFunction;
  navigateUrl;
  boundHandleSubmit;

  constructor({
    parent = document.querySelector("#root"),
    onSuccessEvent,
    uploadFunction,
    inputID = "image_upload",
    formID = "image_upload_form",
    navigateUrl = null,
  }) {
    if (!uploadFunction || typeof uploadFunction !== "function") {
      throw new Error("uploadFunction must be a valid function");
    }
    this.parent = parent;
    this.onSuccessEvent = onSuccessEvent;
    this.uploadFunction = uploadFunction;
    this.inputID = inputID;
    this.formID = formID;
    this.navigateUrl = navigateUrl;

    this.boundHandleSubmit = this.handleSubmit.bind(this);
    this.boundHandleFileChange = this.handleFileChange.bind(this);
  }

  async render() {
    const uploaderElement = document.createElement("div");
    uploaderElement.classList.add("image_uploader");
    uploaderElement.innerHTML = template({
      styles,
      inputID: this.inputID,
      formID: this.formID,
    });
    this.parent.appendChild(uploaderElement);

    this.bindEvents();
    this.onEvents();
  }

  onEvents() {
    if (this.onSuccessEvent) {
      eventBus.on(this.onSuccessEvent, () => {
        if (this.navigateUrl) {
          window.location.href = this.navigateUrl;
        }
      });
    }
  }

  offEvents() {
    if (this.onSuccessEvent) {
      eventBus.off(this.onSuccessEvent);
    }
  }

  destructor() {
    this.offEvents();
    const form = document.querySelector(`#${this.formID}`);
    if (form) {
      form.removeEventListener("submit", this.boundHandleSubmit);
    }
    const fileInput = document.querySelector(`#${this.inputID}`);
    if (fileInput) {
      fileInput.removeEventListener("change", this.boundHandleFileChange);
    }
    const uploaderElement = document.querySelector(".image_uploader");
    if (uploaderElement) {
      uploaderElement.remove();
    }
  }

  bindEvents() {
    const form = document.querySelector(`#${this.formID}`);
    if (form) {
      form.addEventListener("submit", this.boundHandleSubmit);
    }

    const fileInput = document.querySelector(`#${this.inputID}`);
    if (fileInput) {
      fileInput.addEventListener("change", this.boundHandleFileChange);
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const form = document.querySelector(`#${this.formID}`);
    if (!form) {
      console.error("Form not found");
      return;
    }

    const formData = new FormData(form);

    try {
      await this.uploadFunction(formData);
      if (this.onSuccessEvent) {
        eventBus.emit(this.onSuccessEvent);
      }
    } catch (error) {
      console.error("Failed to upload form data:", error);
    }
  }

  handleFileChange() {
    const form = document.querySelector(`#${this.formID}`);
    if (form) {
      form.requestSubmit();
    }
  }
}
