import { serializeState } from "../helpers/serde";

export class UrlView {
  constructor(presenter) {
    this.presenter = presenter;
  }

  render(model) {
    const pako = serializeState({model});
    window.location.hash = pako
  }

  resetButtons () {}
  displaySourcecode () {}
  setLang () {}
}
