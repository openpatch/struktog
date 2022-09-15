import { serializeState } from "../helpers/serde";

export class UrlView {
  constructor(presenter) {
    this.presenter = presenter;
  }

  render(model) {
    const node = document.getElementById("structogram");
    const pako = serializeState({ model, height: node.clientHeight, width: node.clientWidth });
    window.location.hash = pako;
  }

  resetButtons() {}
  displaySourcecode() {}
  setLang() {}
}
