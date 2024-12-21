import template from "./shareModal.hbs";
import * as styles from "./shareModal.scss";
import tgLogo from "../../../../public/images/icons/tg_logo.svg";
import vkLogo from "../../../../public/images/icons/vk_logo.svg";

export class ShareModal {
  parent;

  constructor(parent) {
    this.parent = parent ?? document.querySelector("#root");
  }

  async render(url) {
    this.url = url;

    this.shareModal = document.createElement("div");
    this.shareModal.classList.add("share_modal");
    this.shareModal.innerHTML = template({ styles, url, tgLogo, vkLogo });
    this.parent.appendChild(this.shareModal);

    this.getElements();

    this.addEventListeners();
  }

  getElements() {
    this.cancelBtn = this.shareModal.querySelector(
      `.${styles["share_modal__btn_cancel"]}`,
    );
    this.copyLinkBtn = this.shareModal.querySelector(
      `.${styles["share_buttons__copy_link"]}`,
    );
  }

  addEventListeners() {
    this.cancelBtn.addEventListener("click", this.handleCancel);
    this.copyLinkBtn.addEventListener("click", this.handleCopyLink);
  }

  handleCancel = () => {
    this.shareModal.remove();
  };

  handleCopyLink = () => {
    navigator.clipboard.writeText(this.url);
    this.copyLinkBtn.querySelector("h4").textContent = "Ссылка скопирована";
    setTimeout(
      () =>
        (this.copyLinkBtn.querySelector("h4").textContent =
          "Копировать ссылку"),
      2000,
    );
  };

  removeEventListeners() {
    this.cancelBtn.addEventListener("click", this.handleCancel);
    this.copyLinkBtn.removeEventListener("click", this.handleCopyLink);
  }

  destructor() {
    this.removeEventListeners();
  }
}
