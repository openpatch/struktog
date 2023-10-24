import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export class ImportExport {
  constructor(presenter, domRoot) {
    this.presenter = presenter;
    this.domRoot = domRoot;
    this.printHeight = 32;

    this.preRender();
  }

  render(model) {}

  preRender() {
    const importDiv = document.createElement("div");
    importDiv.classList.add(
      "options-element",
      "uploadIcon",
      "tooltip",
      "tooltip-bottom",
      "hand"
    );
    importDiv.setAttribute("data-tooltip", "Laden");
    const importInput = document.createElement("input");
    importInput.setAttribute("type", "file");
    importInput.addEventListener("change", (e) => this.presenter.readFile(e));
    importDiv.addEventListener("click", () => importInput.click());
    const webdriverImportInput = document.createElement("input");
    webdriverImportInput.classList.add("webdriver-input");
    webdriverImportInput.setAttribute("type", "file");
    webdriverImportInput.addEventListener("change", (e) =>
      this.presenter.readFile(e)
    );
    webdriverImportInput.style.display = "none";
    document.getElementById("optionButtons").appendChild(webdriverImportInput);
    document.getElementById("optionButtons").appendChild(importDiv);

    const saveDiv = document.createElement("div");
    saveDiv.classList.add(
      "options-element",
      "saveIcon",
      "tooltip",
      "tooltip-bottom",
      "hand"
    );
    saveDiv.setAttribute("data-tooltip", "Speichern");
    saveDiv.addEventListener("click", () => this.presenter.saveDialog());
    document.getElementById("optionButtons").appendChild(saveDiv);

    // right now only png export exists, in the future a dialog should be opened
    const exportDiv = document.createElement("div");
    exportDiv.classList.add(
      "options-element",
      "exportIcon",
      "tooltip",
      "tooltip-bottom",
      "hand"
    );
    exportDiv.setAttribute("data-tooltip", "Bildexport");
    exportDiv.addEventListener("click", () =>
      this.exportAsPng(this.presenter.getModelTree())
    );
    document.getElementById("optionButtons").appendChild(exportDiv);
    
    // add a new button to export as pdf
    const exportPdfDiv = document.createElement("div");
    exportPdfDiv.classList.add(
      "options-element",
      "exportIcon",
      "tooltip",
      "tooltip-bottom",
      "hand"
    );
    exportPdfDiv.setAttribute("data-tooltip", "PDF-Export");
    exportPdfDiv.addEventListener("click", () => this.exportAsPdf());
    document.getElementById("optionButtons").appendChild(exportPdfDiv);
  }

  /**
   * Create a PNG file of the current model and append a button for downloading
   */
  async exportAsPng() {
    const node = document.getElementById("structogram");

    // The background svg images are not loaded on the first render.
    // We render the image multiple times to be "sure" that they will be loaded and included in the final image.
    // See https://github.com/bubkoo/html-to-image/issues/361
    await toPng(node);
    await toPng(node);
    await toPng(node);
    await toPng(
      node,
      {
        filter: function (node) {
          if (node.classList) {
            return !node.classList.contains("optionContainer");
          } else {
            return true;
          }
        },
        pixelRatio: 2
      }
    ).then(function (dataURL) {
      // define filename

      const exportFileDefaultName =
        "struktog_" + new Date(Date.now()).toJSON().substring(0, 10) + ".png";

      // create button / anker element
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataURL);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    });
  }

  async exportAsPdf() {
    const node = document.getElementById("structogram");

    await toPng(node);
    await toPng(node);
    await toPng(node);

    const structogramSize = node.getBoundingClientRect();
    
    // Create a new jsPDF object
    const doc = new jsPDF('p', 'px', [structogramSize.width, structogramSize.height], false, false, 16, 1.0, ["px_scaling"]);

    // Add the structogram to the PDF
    doc.addImage(await toPng(node, {
      filter: function (node) {
        if (node.classList) {
          return !node.classList.contains("optionContainer");
        } else {
          return true;
        }
      },
      pixelRatio: 1
    }), "PNG", 0, 0, structogramSize.width, structogramSize.height);


    // Save the PDF
    doc.save("struktog_" + new Date(Date.now()).toJSON().substring(0, 10) + ".pdf");
  }

  resetButtons() {}
  displaySourcecode() {}
  setLang() {}
}
