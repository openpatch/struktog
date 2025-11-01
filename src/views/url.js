import { serializeState } from "../helpers/serde";

export class UrlView {
  constructor(presenter) {
    this.presenter = presenter;
  }

  render(model) {
    const pako = serializeState({
      origin: "https://struktog.openpatch.org",
      version: 1,
      model: model.getTree(),
      settings: model.getSettings(),
    });
    window.location.hash = pako;
  }

  resetButtons() {}
  displaySourcecode() {}
  setLang() {}
}
