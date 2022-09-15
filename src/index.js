import "./assets/favicons/favicons";
import { model } from "./model/main";
import { Presenter } from "./presenter/main";
import { Structogram } from "./views/structogram";
import { deserializeState } from "./helpers/serde";
import { CodeView } from "./views/code";
import { UrlView } from "./views/url";
import { ImportExport } from "./views/importExport";
import { generateHtmltree, generateInfoButton } from "./helpers/generator";

import "./assets/scss/structog.scss";

window.onload = function () {
  generateHtmltree();
  // create presenter object
  const presenter = new Presenter(model);
  // TODO: this should not be necessary, but some functions depend on moveId and nextInsertElement
  model.setPresenter(presenter);

  // create our view objects
  const structogram = new Structogram(
    presenter,
    document.getElementById("editorDisplay")
  );
  presenter.addView(structogram);
  const code = new CodeView(
    presenter,
    document.getElementById("editorDisplay")
  );
  presenter.addView(code);
  const importExport = new ImportExport(
    presenter,
    document.getElementById("Export")
  );
  presenter.addView(importExport);
  const urlView = new UrlView(presenter);
  presenter.addView(urlView);

  presenter.init();
};
