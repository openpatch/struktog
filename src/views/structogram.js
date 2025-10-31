import { config } from "../config.js";
import { generateResetButton } from "../helpers/generator";
import { newElement } from "../helpers/domBuilding";

export class Structogram {
  constructor(presenter, domRoot) {
    this.presenter = presenter;
    this.domRoot = domRoot;
    this.fontSize = 1;
    this.buttonList = [
      "InputNode",
      "OutputNode",
      "TaskNode",
      "CountLoopNode",
      "HeadLoopNode",
      "FootLoopNode",
      "BranchNode",
      "CaseNode",
      "TryCatchNode",
      "FunctionNode",
    ];

    this.preRender();
  }

  preRender() {
    const divInsert = document.createElement("div");
    divInsert.classList.add("columnEditorFull");
    const divHeader = document.createElement("div");
    // divHeader.classList.add('elementButtonColumns');
    const spanHeader = document.createElement("strong");
    spanHeader.classList.add("margin-small");
    spanHeader.appendChild(document.createTextNode("Element wählen:"));
    divHeader.appendChild(spanHeader);
    divInsert.appendChild(divHeader);

    const divButtons = document.createElement("div");
    divButtons.classList.add("container", "justify-center");
    for (const item of this.buttonList) {
      if (config.get()[item].use) {
        divButtons.appendChild(this.createButton(item));
      }
    }
    divInsert.appendChild(divButtons);

    const divEditorHeadline = document.createElement("div");
    divEditorHeadline.classList.add("columnEditorFull", "headerContainer");
    const editorHeadline = document.createElement("strong");
    editorHeadline.classList.add("margin-small", "floatBottom");
    editorHeadline.appendChild(document.createTextNode("Editor:"));
    // Create plus and minus buttons for font size adjustment
    const fontSizeControls = document.createElement("span");
    fontSizeControls.style.marginLeft = "1em";
    // Minus button
    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    minusBtn.classList.add("fontSizeBtn", "hand");
    minusBtn.style.marginRight = "0.3em";
    minusBtn.title = "Decrease font size";
    minusBtn.addEventListener("click", () => this.decreaseFontSize());
    fontSizeControls.appendChild(minusBtn);
    // Plus button
    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.classList.add("fontSizeBtn", "hand");
    plusBtn.title = "Increase font size";
    plusBtn.addEventListener("click", () => this.increaseFontSize());
    fontSizeControls.appendChild(plusBtn);
    editorHeadline.appendChild(fontSizeControls);
    divEditorHeadline.appendChild(editorHeadline);

    const optionsContainer1 = document.createElement("div");
    optionsContainer1.id = "struktoOptions1";
    optionsContainer1.classList.add("struktoOptions1");
    divEditorHeadline.appendChild(optionsContainer1);

    this.createStrukOptions(optionsContainer1);

    const divEditorContent = document.createElement("div");
    divEditorContent.classList.add("vcontainer", "columnEditorStructogram");

    const divEditorContentSplitTop = document.createElement("div");
    divEditorContentSplitTop.classList.add("columnAuto", "container");

    const divEditorContentSplitBottom = document.createElement("div");
    divEditorContentSplitBottom.classList.add("columnAuto-6");

    const divFixRightBorder = document.createElement("div");
    divFixRightBorder.classList.add("borderWidth", "frameLeft");

    const divWorkingArea = document.createElement("div");
    divWorkingArea.classList.add("columnAuto");
    divWorkingArea.id = "structogram";

    divEditorContent.appendChild(divEditorContentSplitTop);
    divEditorContentSplitTop.appendChild(divWorkingArea);
    divEditorContentSplitTop.appendChild(divFixRightBorder);
    divEditorContent.appendChild(divEditorContentSplitBottom);

    this.domRoot.appendChild(divInsert);
    this.domRoot.appendChild(divEditorHeadline);
    this.domRoot.appendChild(divEditorContent);

    const codeAndOptions = document.createElement("div");
    codeAndOptions.classList.add("columnEditorCode", "container");
    this.domRoot.appendChild(codeAndOptions);

    const optionsContainer2 = document.createElement("div");
    optionsContainer2.id = "struktoOptions2";
    optionsContainer2.classList.add(
      "columnFull",
      "container",
      "struktoOptions2",
    );
    codeAndOptions.appendChild(optionsContainer2);

    this.createStrukOptions(optionsContainer2);

    const sourcecode = document.createElement("div");
    sourcecode.id = "SourcecodeDisplay";
    sourcecode.classList.add("fullWidth", "fullHeight", "vcontainer");
    sourcecode.style.display = "none";
    codeAndOptions.appendChild(sourcecode);

    this.domRoot = document.getElementById("structogram");
  }

  createStrukOptions(domNode) {
    this.generateUndoRedoButtons(this.presenter, domNode);
    generateResetButton(this.presenter, domNode);
  }

  generateUndoRedoButtons(presenter, domNode) {
    const undo = document.createElement("div");
    undo.classList.add(
      "struktoOption",
      "undoIcon",
      "tooltip",
      "tooltip-bottom",
      "hand",
    );
    undo.setAttribute("data-tooltip", "Undo");
    domNode.appendChild(undo);
    const undoOverlay = document.createElement("div");
    undoOverlay.classList.add(
      "fullWidth",
      "fullHeight",
      "UndoIconButtonOverlay",
      "disableIcon",
    );
    undoOverlay.addEventListener("click", () => presenter.undo());
    undo.appendChild(undoOverlay);

    const redo = document.createElement("div");
    redo.classList.add(
      "struktoOption",
      "redoIcon",
      "tooltip",
      "tooltip-bottom",
      "hand",
    );
    redo.setAttribute("data-tooltip", "Redo");
    domNode.appendChild(redo);
    const redoOverlay = document.createElement("div");
    redoOverlay.classList.add(
      "fullWidth",
      "fullHeight",
      "RedoIconButtonOverlay",
      "disableIcon",
    );
    redoOverlay.addEventListener("click", () => presenter.redo());
    redo.appendChild(redoOverlay);
  }

  createButton(button) {
    const div = document.createElement("div");
    div.classList.add("columnInput", "insertButton", "hand");
    div.style.backgroundColor = config.get()[button].color;
    div.id = config.get()[button].id;
    div.draggable = "true";
    div.addEventListener("click", (event) =>
      this.presenter.insertNode(config.get()[button].id, event),
    );
    div.addEventListener("dragstart", (event) =>
      this.presenter.insertNode(config.get()[button].id, event),
    );
    div.addEventListener("dragend", () => this.presenter.resetDrop());
    const spanText = document.createElement("span");
    spanText.appendChild(document.createTextNode(config.get()[button].text));
    const divIcon = document.createElement("div");
    divIcon.classList.add(config.get()[button].icon, "buttonLogo");

    div.append(divIcon);
    div.append(spanText);
    return div;
  }

  render(tree) {
    // remove content
    while (this.domRoot.hasChildNodes()) {
      this.domRoot.removeChild(this.domRoot.lastChild);
    }
    
    // Create SVG container for the entire structogram
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.style.display = "block";
    svg.style.minHeight = "100px";
    
    // Calculate structure and render to SVG
    const renderResult = this.renderElementToSVG(
      tree,
      0,
      0,
      800, // default width, will be adjusted
      false,
      false,
      this.presenter.getSettingFunctionMode()
    );
    
    if (renderResult.group) {
      svg.appendChild(renderResult.group);
    }
    
    // Set SVG height based on content
    const totalHeight = renderResult.height + 4;
    svg.setAttribute("height", totalHeight);
    svg.setAttribute("viewBox", `0 0 ${renderResult.width} ${totalHeight}`);
    
    // Store reference to SVG for later use
    this.svgElement = svg;
    
    this.domRoot.appendChild(svg);
  }

  /**
   * @param    divContainer         div containing the function parameters
   * @param    pos                  position in the function header-div
   * @param    fieldSize            size of the input field (only int values)
   * @param    uid                  id of the function node inside the model
   * @param    content              text of the param element
   * @returns  HTMLElement (Input Field)
   */
  createFunctionHeaderTextEl(
    divContainer,
    pos,
    fieldSize,
    placeHolder,
    uid,
    content = null,
  ) {
    // add text from input field as span-element to the header-div
    const textNodeSpan = document.createElement("span");
    textNodeSpan.classList.add("func-header-text-div");

    if (content === null || content === "") {
      textNodeSpan.appendChild(document.createTextNode(placeHolder));
    } else {
      textNodeSpan.appendChild(document.createTextNode(content));
    }

    const textNodeDiv = document.createElement("div");
    textNodeDiv.classList.add("function-elem");
    textNodeDiv.style.display = "flex";
    textNodeDiv.style.flexDirection = "row";
    textNodeDiv.appendChild(textNodeSpan);

    // delete option for parameters
    if (!divContainer.classList.contains("func-box-header")) {
      const removeParamBtn = document.createElement("button");
      removeParamBtn.classList.add(
        "trashcan",
        "optionIcon",
        "hand",
        "tooltip",
        "tooltip-bottoml",
      );
      removeParamBtn.style.minWidth = "1.2em";
      removeParamBtn.style.border = "none";
      removeParamBtn.setAttribute("data-tooltip", "Entfernen");
      removeParamBtn.addEventListener("click", () => {
        this.presenter.removeParamFromParameters(pos);
      });

      textNodeSpan.addEventListener("mouseover", () => {
        textNodeSpan.parentElement.appendChild(removeParamBtn);
      });

      textNodeSpan.parentElement.addEventListener("mouseleave", () => {
        removeParamBtn.remove();
      });
    }

    // text can be clicked and afterwards can be changed
    textNodeSpan.addEventListener("click", () => {
      textNodeDiv.remove();

      // div containing input field and field option
      const inputDiv = document.createElement("div");
      inputDiv.style.display = "flex";
      inputDiv.style.flexDirection = "row";

      // create Input Field
      const inputElement = newElement(
        "input",
        ["function-elem", "func-header-input"],
        inputDiv,
      );
      inputElement.contentEditable = true;
      inputElement.style.border = "solid 1px black";
      inputElement.style.margin = "0 0 0 0";
      inputElement.style.width = fieldSize + "ch";
      inputElement.size = fieldSize;
      inputElement.type = "text";
      inputElement.placeholder = placeHolder;
      inputElement.value = content;

      // function for creating the text node (function name or parameter name)
      const createTextNode = () => {
        const textNodeDiv = document.createElement("div");
        textNodeDiv.classList.add("function-elem");

        // add text from input field as span-element to the header-div
        const textNodeSpan = newElement(
          "span",
          ["func-header-text-div"],
          textNodeDiv,
        );
        textNodeSpan.appendChild(document.createTextNode(inputElement.value));

        // text can be clicked and afterwards can be changed
        textNodeSpan.addEventListener("click", () => {
          textNodeDiv.remove();
          divContainer.insertBefore(inputDiv, divContainer.childNodes[pos]);
        });

        inputElement.remove();
        divContainer.insertBefore(textNodeDiv, divContainer.childNodes[pos]);
      };

      // button to save function or parameter name
      const inputAccept = newElement("div", ["acceptIcon", "hand"], inputDiv);
      inputAccept.style.minWidth = "1.4em";
      inputAccept.style.marginLeft = "0.2em";
      inputAccept.addEventListener("click", () => {
        // update function name and function parameters in the model tree
        if (divContainer.classList.contains("func-box-header")) {
          this.presenter.editElement(uid, inputElement.value, "funcname|");
        } else {
          this.presenter.editElement(
            uid,
            inputElement.value,
            String(pos) + "|",
          );
        }

        // change function name also in the model (tree)
        this.presenter.renderAllViews();
        createTextNode();
      });

      const inputClose = newElement("div", ["deleteIcon", "hand"], inputDiv);
      inputClose.style.minWidth = "1.4em";
      inputClose.style.marginLeft = "0.2em";
      inputClose.addEventListener("click", () =>
        this.presenter.renderAllViews(),
      );
      divContainer.insertBefore(inputDiv, divContainer.childNodes[pos]);

      const listenerFunction = (event) => {
        if (event.code === "Enter" || event.type === "blur") {
          // remove the blur event listener in case of pressing-enter-event to avoid DOM exceptions
          if (event.code === "Enter") {
            inputElement.removeEventListener("blur", listenerFunction);
          }

          // update function name and function parameters in the model tree
          if (divContainer.classList.contains("func-box-header")) {
            this.presenter.editElement(uid, inputElement.value, "funcname|");
          } else {
            this.presenter.editElement(
              uid,
              inputElement.value,
              String(pos) + "|",
            );
          }

          // change function name also in the model (tree)
          this.presenter.renderAllViews();
          createTextNode();
        }
      };

      // observed events (to change input field size)
      const events = "keyup,keypress,focus,blur,change,input".split(",");

      for (const e of events) {
        inputElement.addEventListener(e, listenerFunction);
      }
    });

    return textNodeDiv;
  }

  /**
   * Create some spacing
   */
  createSpacing(spacingSize) {
    // spacing between elements
    const spacing = document.createElement("div");
    spacing.style.marginRight = spacingSize + "ch";

    return spacing;
  }

  /**
   * @param   countParam              count of variables inside the paramter div
   * @param   fpSize                  size for the input field
   * @param   paramDiv                div containing the function parameters
   * @param   spacingSize             spacing div between two DOM-elements
   * @param   uid                     id of the function node inside the model
   * create and append a interactable variable to the parameters div
   */
  renderParam(countParam, paramDiv, spacingSize, fpSize, uid, content = null) {
    const paramPos = 3 * countParam;
    // if there is already a function parameter, add some ", " before the next parameter
    if (countParam !== 0) {
      paramDiv.appendChild(document.createTextNode(","));
      paramDiv.appendChild(this.createSpacing(spacingSize));
    }
    countParam += 1;
    paramDiv.appendChild(
      this.createFunctionHeaderTextEl(
        paramDiv,
        paramPos,
        fpSize,
        "par " + countParam,
        uid,
        content,
      ),
    );
  }

  /**
   * @param    uid                id of the function node inside the model (tree)
   * @param    content            function name given from the model
   * @param    funcParams         variable names of the function paramers
   * Return a function header with function name and parameters for editing
   */
  renderFunctionBox(uid, content, funcParams) {
    // field attributes... ff: function name... fp: parameter name
    // size is field length
    const ffSize = 15;
    const fpSize = 5;
    const spacingSize = 1;

    // box header containing all elements describing the function header
    const functionBoxHeaderDiv = document.createElement("div");
    functionBoxHeaderDiv.classList.add(
      "input-group",
      "fixedHeight",
      "func-box-header",
      "padding",
    );
    functionBoxHeaderDiv.style.display = "flex";
    functionBoxHeaderDiv.style.flexDirection = "row";
    functionBoxHeaderDiv.style.paddingTop = "6.5px";

    // header containing all param elements
    const paramDiv = document.createElement("div");
    paramDiv.classList.add("input-group");
    paramDiv.style.display = "flex";
    paramDiv.style.flexDirection = "row";
    paramDiv.style.flex = "0 0 " + spacingSize + "ch";

    let countParam = 0;
    for (const param of funcParams) {
      this.renderParam(
        countParam,
        paramDiv,
        spacingSize,
        fpSize,
        uid,
        param.parName,
      );
      countParam += 1;
    }

    // append a button for adding new parameters at the end of the param div
    const addParamBtn = document.createElement("button");
    addParamBtn.classList.add(
      "addCaseIcon",
      "hand",
      "caseOptionsIcons",
      "tooltip",
      "tooltip-bottom",
    );
    addParamBtn.style.marginTop = "auto";
    addParamBtn.style.marginBottom = "auto";
    addParamBtn.setAttribute("data-tooltip", "Parameter hinzufügen");
    addParamBtn.addEventListener("click", () => {
      addParamBtn.remove();
      const countParam =
        document.getElementsByClassName("function-elem").length - 1;
      this.renderParam(countParam, paramDiv, spacingSize, fpSize, uid);
    });

    // show adding-parameters-button when hovering
    functionBoxHeaderDiv.addEventListener("mouseover", () => {
      paramDiv.appendChild(addParamBtn);
    });

    functionBoxHeaderDiv.addEventListener("mouseleave", () => {
      addParamBtn.remove();
    });

    // add all box header elements
    functionBoxHeaderDiv.appendChild(document.createTextNode("function"));
    functionBoxHeaderDiv.appendChild(this.createSpacing(2 * spacingSize));
    functionBoxHeaderDiv.appendChild(
      this.createFunctionHeaderTextEl(
        functionBoxHeaderDiv,
        2,
        ffSize,
        "func name",
        uid,
        content,
      ),
    );
    functionBoxHeaderDiv.appendChild(document.createTextNode("("));
    functionBoxHeaderDiv.appendChild(paramDiv);
    functionBoxHeaderDiv.appendChild(document.createTextNode(")"));
    functionBoxHeaderDiv.appendChild(this.createSpacing(spacingSize));
    functionBoxHeaderDiv.appendChild(document.createTextNode("{"));
    const spacer = document.createElement("div");
    spacer.style.marginRight = "auto";
    functionBoxHeaderDiv.appendChild(spacer);

    return functionBoxHeaderDiv;
  }

  renderElement(subTree, parentIsMoving, noInsert, renderInsertNode = false) {
    const elemArray = [];
    if (subTree === null) {
      return elemArray;
    } else {
      if (
        !(this.presenter.getMoveId() === null) &&
        subTree.id === this.presenter.getMoveId()
      ) {
        parentIsMoving = true;
        noInsert = true;
      }

      const container = document.createElement("div");
      if (subTree.id) {
        container.id = subTree.id;
      }
      container.classList.add("vcontainer", "frameTopLeft", "columnAuto");
      container.style.backgroundColor = config.get()[subTree.type].color;
      // container.style.margin = '0 .75px';
      // const element = document.createElement('div');
      // element.classList.add('column', 'vcontainer', 'frameTop');
      // container.appendChild(element);

      switch (subTree.type) {
        case "InsertNode":
          if (parentIsMoving) {
            return this.renderElement(subTree.followElement, false, false);
          } else {
            if (noInsert) {
              return this.renderElement(subTree.followElement, false, true);
            } else {
              // inserting any other object instead of a function block
              if (this.presenter.getInsertMode()) {
                if (!this.presenter.getSettingFunctionMode()) {
                  const div = document.createElement("div");
                  div.classList.add(
                    "container",
                    "fixedHalfHeight",
                    "symbol",
                    "hand",
                    "text-center",
                  );
                  container.addEventListener("dragover", function (event) {
                    event.preventDefault();
                  });
                  container.addEventListener("drop", (event) => {
                    event.preventDefault();
                    this.presenter.appendElement(subTree.id);
                  });
                  container.addEventListener("click", () =>
                    this.presenter.appendElement(subTree.id),
                  );

                  if (
                    this.presenter.getMoveId() &&
                    subTree.followElement &&
                    subTree.followElement.id === this.presenter.getMoveId()
                  ) {
                    const bold = document.createElement("strong");
                    bold.classList.add("moveText");
                    bold.appendChild(
                      document.createTextNode("Verschieben abbrechen"),
                    );
                    div.appendChild(bold);
                  } else {
                    const symbol = document.createElement("div");
                    symbol.classList.add("insertIcon", "symbolHeight");
                    div.appendChild(symbol);
                  }
                  container.appendChild(div);
                  elemArray.push(container);

                  if (
                    subTree.followElement === null ||
                    subTree.followElement.type === "Placeholder"
                  ) {
                    return elemArray;
                  } else {
                    return elemArray.concat(
                      this.renderElement(
                        subTree.followElement,
                        false,
                        noInsert,
                      ),
                    );
                  }
                } else {
                  // container.classList.add('line');
                  if (renderInsertNode) {
                    const div = document.createElement("div");
                    div.classList.add(
                      "container",
                      "fixedHalfHeight",
                      "symbol",
                      "hand",
                      "text-center",
                    );
                    container.addEventListener("dragover", function (event) {
                      event.preventDefault();
                    });
                    container.addEventListener("drop", (event) => {
                      event.preventDefault();
                      this.presenter.appendElement(subTree.id);
                    });
                    container.addEventListener("click", () =>
                      this.presenter.appendElement(subTree.id),
                    );

                    if (
                      this.presenter.getMoveId() &&
                      subTree.followElement &&
                      subTree.followElement.id === this.presenter.getMoveId()
                    ) {
                      const bold = document.createElement("strong");
                      bold.classList.add("moveText");
                      bold.appendChild(
                        document.createTextNode("Verschieben abbrechen"),
                      );
                      div.appendChild(bold);
                    } else {
                      const symbol = document.createElement("div");
                      symbol.classList.add("insertIcon", "symbolHeight");
                      div.appendChild(symbol);
                    }
                    container.appendChild(div);
                    elemArray.push(container);

                    if (
                      subTree.followElement === null ||
                      subTree.followElement.type === "Placeholder"
                    ) {
                      return elemArray;
                    } else {
                      return elemArray.concat(
                        this.renderElement(
                          subTree.followElement,
                          false,
                          noInsert,
                        ),
                      );
                    }
                  } else {
                    return this.renderElement(
                      subTree.followElement,
                      false,
                      noInsert,
                    );
                  }
                }
              } else {
                return this.renderElement(
                  subTree.followElement,
                  parentIsMoving,
                  noInsert,
                );
              }
            }
          }
        case "Placeholder": {
          const div = document.createElement("div");
          div.classList.add("container", "fixedHeight");
          const symbol = document.createElement("div");
          symbol.classList.add("placeholder", "symbolHeight", "symbol");
          div.appendChild(symbol);
          container.appendChild(div);
          elemArray.push(container);
          return elemArray;
        }
        case "InsertCase": {
          container.classList.remove("frameTopLeft", "columnAuto");
          container.classList.add("frameLeft", "fixedHeight");
          const divTaskNode = document.createElement("div");
          divTaskNode.classList.add("fixedHeight", "container");

          const textDiv = this.createTextDiv(
            subTree.type,
            subTree.text,
            subTree.id,
          );
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
          divTaskNode.appendChild(textDiv);
          divTaskNode.appendChild(optionDiv);

          // container.classList.add('line');
          container.appendChild(divTaskNode);
          elemArray.push(container);

          return elemArray.concat(
            this.renderElement(subTree.followElement, parentIsMoving, noInsert),
          );
        }
        case "InputNode":
        case "OutputNode":
        case "TaskNode": {
          const divTaskNode = document.createElement("div");
          divTaskNode.classList.add("fixedHeight", "container");

          const textDiv = this.createTextDiv(
            subTree.type,
            subTree.text,
            subTree.id,
          );
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
          divTaskNode.appendChild(textDiv);
          divTaskNode.appendChild(optionDiv);

          // container.classList.add('line');
          container.appendChild(divTaskNode);
          elemArray.push(container);

          return elemArray.concat(
            this.renderElement(subTree.followElement, parentIsMoving, noInsert),
          );
        }
        case "BranchNode": {
          // //container.classList.add('fix');
          const divBranchNode = document.createElement("div");
          divBranchNode.classList.add("columnAuto", "vcontainer");

          const divHead = document.createElement("div");
          divHead.classList.add(
            "vcontainer",
            "fixedDoubleHeight",
          );
          divHead.style.position = "relative";

          // Create inline SVG for the triangular split instead of CSS background
          const svgTriangle = this.createBranchSplitSVG();
          svgTriangle.style.position = "absolute";
          svgTriangle.style.top = "0";
          svgTriangle.style.left = "0";
          svgTriangle.style.width = "100%";
          svgTriangle.style.height = "100%";
          svgTriangle.style.pointerEvents = "none";
          svgTriangle.style.zIndex = "0";
          divHead.appendChild(svgTriangle);

          const divHeadTop = document.createElement("div");
          divHeadTop.classList.add("fixedHeight", "container");
          divHeadTop.style.position = "relative";
          divHeadTop.style.zIndex = "1";

          const textDiv = this.createTextDiv(
            subTree.type,
            subTree.text,
            subTree.id,
          );
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
          divHeadTop.appendChild(textDiv);
          divHeadTop.appendChild(optionDiv);

          const divHeadBottom = document.createElement("div");
          divHeadBottom.classList.add("fixedHeight", "container", "padding");
          divHeadBottom.style.position = "relative";
          divHeadBottom.style.zIndex = "1";

          const divHeaderTrue = document.createElement("div");
          divHeaderTrue.classList.add(
            "columnAuto",
            "text-left",
            "bottomHeader",
          );
          divHeaderTrue.appendChild(document.createTextNode("Wahr"));

          const divHeaderFalse = document.createElement("div");
          divHeaderFalse.classList.add(
            "columnAuto",
            "text-right",
            "bottomHeader",
          );
          divHeaderFalse.appendChild(document.createTextNode("Falsch"));

          divHeadBottom.appendChild(divHeaderTrue);
          divHeadBottom.appendChild(divHeaderFalse);

          divHead.appendChild(divHeadTop);
          divHead.appendChild(divHeadBottom);
          divBranchNode.appendChild(divHead);

          const divChildren = document.createElement("div");
          divChildren.classList.add("columnAuto", "container");
          divChildren.style.position = "relative";

          // Create inline SVG for the center separator line instead of CSS background
          const svgCenter = this.createBranchCenterSVG();
          svgCenter.style.position = "absolute";
          svgCenter.style.top = "0";
          svgCenter.style.left = "0";
          svgCenter.style.width = "100%";
          svgCenter.style.height = "100%";
          svgCenter.style.pointerEvents = "none";
          svgCenter.style.zIndex = "0";
          divChildren.appendChild(svgCenter);

          const divTrue = document.createElement("div");
          divTrue.classList.add("columnAuto", "vcontainer", "ov-hidden");
          divTrue.style.position = "relative";
          divTrue.style.zIndex = "1";
          for (const elem of this.renderElement(
            subTree.trueChild,
            false,
            noInsert,
          )) {
            this.applyCodeEventListeners(elem);
            divTrue.appendChild(elem);
          }

          const divFalse = document.createElement("div");
          divFalse.classList.add("columnAuto", "vcontainer", "ov-hidden");
          divFalse.style.position = "relative";
          divFalse.style.zIndex = "1";
          for (const elem of this.renderElement(
            subTree.falseChild,
            false,
            noInsert,
          )) {
            this.applyCodeEventListeners(elem);
            divFalse.appendChild(elem);
          }

          divChildren.appendChild(divTrue);
          divChildren.appendChild(divFalse);
          divBranchNode.appendChild(divChildren);
          container.appendChild(divBranchNode);
          elemArray.push(container);

          return elemArray.concat(
            this.renderElement(subTree.followElement, parentIsMoving, noInsert),
          );
        }
        case "TryCatchNode": {
          const divTryCatchNode = newElement(
            "div",
            ["columnAuto", "vcontainer", "tryCatchNode"],
            container,
          );
          const divTry = newElement(
            "div",
            ["container", "fixedHeight", "padding"],
            divTryCatchNode,
          );
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
          divTry.appendChild(optionDiv);
          const textTry = newElement("div", ["symbol"], divTry);
          textTry.appendChild(document.createTextNode("Try"));

          const divTryContent = newElement(
            "div",
            ["columnAuto", "container", "loopShift"],
            divTryCatchNode,
          );
          const divTryContentBody = newElement(
            "div",
            ["loopWidth", "frameLeft", "vcontainer"],
            divTryContent,
          );
          for (const elem of this.renderElement(
            subTree.tryChild,
            false,
            noInsert,
          )) {
            this.applyCodeEventListeners(elem);
            divTryContentBody.appendChild(elem);
          }

          // container for the vertical line to indent it correctly
          const vertLineContainer = newElement(
            "div",
            ["container", "columnAuto", "loopShift"],
            divTryCatchNode,
          );
          const vertLine2 = newElement(
            "div",
            ["loopWidth", "vcontainer"],
            vertLineContainer,
          );
          const vertLine = newElement("div", ["frameLeftBottom"], vertLine2);
          vertLine.style.flex = "0 0 3px";

          const divCatch = newElement(
            "div",
            ["container", "fixedHeight", "padding", "tryCatchNode"],
            divTryCatchNode,
          );
          const textCatch = newElement("div", ["symbol"], divCatch);
          textCatch.appendChild(document.createTextNode("Catch"));

          const textDiv = this.createTextDiv(
            subTree.type,
            subTree.text,
            subTree.id,
          );
          divCatch.appendChild(textDiv);

          const divCatchContent = newElement(
            "div",
            ["columnAuto", "container", "loopShift"],
            divTryCatchNode,
          );
          const divCatchContentBody = newElement(
            "div",
            ["loopWidth", "frameLeft", "vcontainer"],
            divCatchContent,
          );
          for (const elem of this.renderElement(
            subTree.catchChild,
            false,
            noInsert,
          )) {
            this.applyCodeEventListeners(elem);
            divCatchContentBody.appendChild(elem);
          }

          elemArray.push(container);

          return elemArray.concat(
            this.renderElement(subTree.followElement, parentIsMoving, noInsert),
          );
        }
        case "HeadLoopNode":
        case "CountLoopNode": {
          const div = document.createElement("div");
          div.classList.add("columnAuto", "vcontainer");

          const divHead = document.createElement("div");
          divHead.classList.add("container", "fixedHeight");

          const textDiv = this.createTextDiv(
            subTree.type,
            subTree.text,
            subTree.id,
          );
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
          divHead.appendChild(textDiv);
          divHead.appendChild(optionDiv);
          div.appendChild(divHead);

          const divChild = document.createElement("div");
          divChild.classList.add("columnAuto", "container", "loopShift");

          const divLoop = document.createElement("div");
          divLoop.classList.add("loopWidth", "frameLeft", "vcontainer");

          for (const elem of this.renderElement(
            subTree.child,
            false,
            noInsert,
          )) {
            this.applyCodeEventListeners(elem);
            divLoop.appendChild(elem);
          }

          divChild.appendChild(divLoop);
          div.appendChild(divChild);
          container.appendChild(div);
          elemArray.push(container);

          return elemArray.concat(
            this.renderElement(subTree.followElement, parentIsMoving, noInsert),
          );
        }
        case "FunctionNode": {
          const innerDiv = document.createElement("div");
          innerDiv.classList.add("columnAuto", "vcontainer");

          const divFunctionHeader = this.renderFunctionBox(
            subTree.id,
            subTree.text,
            subTree.parameters,
          );

          const divHead = document.createElement("div");
          divHead.classList.add("container", "fixedHeight");

          const funcOptionDiv = this.createOptionDiv(subTree.type, subTree.id);
          divHead.appendChild(funcOptionDiv);
          divFunctionHeader.appendChild(divHead);

          const divChild = document.createElement("div");
          divChild.classList.add("columnAuto", "container", "loopShift");

          // creates the inside of the functionf
          const divFunctionBody = document.createElement("div");
          divFunctionBody.classList.add("loopWidth", "frameLeft", "vcontainer");

          for (const elem of this.renderElement(
            subTree.child,
            false,
            noInsert,
          )) {
            this.applyCodeEventListeners(elem);
            divFunctionBody.appendChild(elem);
          }
          divChild.appendChild(divFunctionBody);

          const divFuncFoot = document.createElement("div");
          divFuncFoot.classList.add("container", "fixedHeight", "padding");

          const textNode = document.createElement("div");
          textNode.classList.add("symbol");
          textNode.appendChild(document.createTextNode("}"));
          divFuncFoot.appendChild(textNode);

          const vertLine = document.createElement("div");
          vertLine.classList.add("frameLeftBottom");
          vertLine.style.flex = "0 0 3px";

          // container for the vertical line to indent it correctly
          const vertLineContainer = document.createElement("div");
          vertLineContainer.classList.add(
            "container",
            "columnAuto",
            "loopShift",
          );

          const vertLine2 = document.createElement("div");
          vertLine2.classList.add("loopWidth", "vcontainer");

          vertLine2.appendChild(vertLine);
          vertLineContainer.appendChild(vertLine2);

          innerDiv.appendChild(divFunctionHeader);
          innerDiv.appendChild(divChild);
          innerDiv.appendChild(vertLineContainer);
          innerDiv.appendChild(divFuncFoot);
          container.appendChild(innerDiv);
          elemArray.push(container);

          return elemArray.concat(
            this.renderElement(subTree.followElement, parentIsMoving, noInsert),
          );
        }
        case "FootLoopNode": {
          const div = document.createElement("div");
          div.classList.add("columnAuto", "vcontainer");

          const divChild = document.createElement("div");
          divChild.classList.add("columnAuto", "container", "loopShift");

          const divLoop = document.createElement("div");
          divLoop.classList.add("loopWidth", "frameLeftBottom", "vcontainer");

          for (const elem of this.renderElement(
            subTree.child,
            false,
            noInsert,
          )) {
            this.applyCodeEventListeners(elem);
            divLoop.appendChild(elem);
          }
          // Fix for overlapped bottom line
          const lastLine = document.createElement("div");
          lastLine.classList.add("borderHeight");
          divLoop.appendChild(lastLine);

          divChild.appendChild(divLoop);
          div.appendChild(divChild);

          const divFoot = document.createElement("div");
          divFoot.classList.add("container", "fixedHeight");

          const textDiv = this.createTextDiv(
            subTree.type,
            subTree.text,
            subTree.id,
          );
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
          divFoot.appendChild(textDiv);
          divFoot.appendChild(optionDiv);
          div.appendChild(divFoot);

          container.appendChild(div);
          elemArray.push(container);

          return elemArray.concat(
            this.renderElement(subTree.followElement, parentIsMoving, noInsert),
          );
        }
        case "CaseNode": {
          const div = document.createElement("div");
          div.classList.add("columnAuto", "vcontainer");

          const divHead = document.createElement("div");
          divHead.classList.add("vcontainer", "fixedHeight");
          divHead.style.position = "relative";

          // Create inline SVG for case triangles instead of CSS background
          const svgCaseHead = this.createCaseHeadSVG(subTree.cases.length, subTree.defaultOn);
          svgCaseHead.style.position = "absolute";
          svgCaseHead.style.top = "0";
          svgCaseHead.style.left = "0";
          svgCaseHead.style.width = "100%";
          svgCaseHead.style.height = "100%";
          svgCaseHead.style.pointerEvents = "none";
          svgCaseHead.style.zIndex = "0";
          divHead.appendChild(svgCaseHead);

          let nrCases = subTree.cases.length;
          if (!subTree.defaultOn) {
            nrCases = nrCases + 2;
          }
          const textDiv = this.createTextDiv(
            subTree.type,
            subTree.text,
            subTree.id,
            nrCases,
          );
          textDiv.style.position = "relative";
          textDiv.style.zIndex = "1";
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
          optionDiv.style.position = "relative";
          optionDiv.style.zIndex = "1";
          divHead.appendChild(textDiv);
          divHead.appendChild(optionDiv);
          div.appendChild(divHead);

          const divChildren = document.createElement("div");
          divChildren.classList.add("columnAuto", "container");
          divChildren.style.position = "relative";

          // Create inline SVG for case body separators
          const svgCaseBody = this.createCaseBodySVG(subTree.cases.length, subTree.defaultOn);
          svgCaseBody.style.position = "absolute";
          svgCaseBody.style.top = "0";
          svgCaseBody.style.left = "0";
          svgCaseBody.style.width = "100%";
          svgCaseBody.style.height = "100%";
          svgCaseBody.style.pointerEvents = "none";
          svgCaseBody.style.zIndex = "0";
          divChildren.appendChild(svgCaseBody);

          for (const caseElem of subTree.cases) {
            const divCase = document.createElement("div");
            divCase.classList.add("columnAuto", "vcontainer", "ov-hidden");
            divCase.style.position = "relative";
            divCase.style.zIndex = "1";

            for (const elem of this.renderElement(caseElem, false, noInsert)) {
              this.applyCodeEventListeners(elem);
              divCase.appendChild(elem);
            }
            divChildren.appendChild(divCase);
          }

          if (subTree.defaultOn) {
            const divCase = document.createElement("div");
            divCase.classList.add("columnAuto", "vcontainer", "ov-hidden");
            divCase.style.position = "relative";
            divCase.style.zIndex = "1";
            for (const elem of this.renderElement(
              subTree.defaultNode,
              false,
              noInsert,
            )) {
              this.applyCodeEventListeners(elem);
              divCase.appendChild(elem);
            }
            divChildren.appendChild(divCase);
          }

          div.appendChild(divChildren);
          container.appendChild(div);
          elemArray.push(container);

          return elemArray.concat(
            this.renderElement(subTree.followElement, parentIsMoving, noInsert),
          );
        }
      }
    }
  }

  /**
   * Reset the buttons after an insert or false drop
   */
  resetButtons() {
    // remove color of buttons
    for (const button of this.buttonList) {
      if (config.get()[button].use) {
        document
          .getElementById(config.get()[button].id)
          .classList.remove("boldText");
      }
    }
  }

  /**
   * Increase the size of the working area
   */
  increaseFontSize() {
    this.fontSize = this.fontSize + 0.1;

    const elem = document.getElementsByClassName("columnEditorStructogram")[0];
    elem.style.fontSize = this.fontSize + "em";
  }

  /**
   * Decrease the size of the working area
   */
  decreaseFontSize() {
    const newFontSize = this.fontSize - 0.1;
    if (newFontSize < 0.05) {
      return;
    }

    this.fontSize = newFontSize;

    const elem = document.getElementsByClassName("columnEditorStructogram")[0];
    elem.style.fontSize = this.fontSize + "em";
  }

  /**
   * Create a HTML wrapper around a div element, to fully work with the flexbox grid
   *
   * @param    div          the HTML structure to be wrapped
   * @param    inserting    identifies the div as InsertNode
   * @param    moving       identifies the div as the original position while moving
   * @return   div          completly wrapped HTML element
   */
  addCssWrapper(div, inserting, moving) {
    const innerDiv = document.createElement("div");
    innerDiv.classList.add("column");
    innerDiv.classList.add("col-12");
    innerDiv.classList.add("lineTop");

    const box = document.createElement("div");
    box.classList.add("row");

    // element is a InsertNode
    if (inserting) {
      box.classList.add("bg-secondary");
      box.classList.add("simpleBorder");
    }
    // element is original InsertNode while moving a block
    if (moving) {
      box.classList.add("bg-primary");
      box.classList.add("simpleBorder");
    }

    innerDiv.appendChild(div);
    box.appendChild(innerDiv);

    return box;
  }

  openCaseOptions(uid) {
    const content = document.getElementById("modal-content");
    const footer = document.getElementById("modal-footer");
    while (content.hasChildNodes()) {
      content.removeChild(content.lastChild);
    }
    while (footer.hasChildNodes()) {
      footer.removeChild(footer.lastChild);
    }
    const element = this.presenter.getElementByUid(uid);

    const title = document.createElement("strong");
    title.appendChild(
      document.createTextNode(
        "Einstellungen der " + config.get().CaseNode.text + ": ",
      ),
    );
    content.appendChild(title);
    const elementText = document.createElement("div");
    elementText.classList.add("caseTitle", "boldText");
    elementText.appendChild(document.createTextNode(element.text));
    content.appendChild(elementText);

    const list = document.createElement("dl");
    list.classList.add("container");
    content.appendChild(list);
    const caseNumberTitle = document.createElement("dt");
    caseNumberTitle.classList.add("dtItem");
    caseNumberTitle.appendChild(document.createTextNode("Anzahl der Fälle:"));
    list.appendChild(caseNumberTitle);
    const caseNumber = document.createElement("dd");
    caseNumber.classList.add("ddItem", "container");
    list.appendChild(caseNumber);
    const caseNr = document.createElement("div");
    caseNr.classList.add("text-center", "shortenOnMobile");
    caseNr.appendChild(document.createTextNode(element.cases.length));
    caseNumber.appendChild(caseNr);
    const addCase = document.createElement("div");
    addCase.classList.add(
      "addCaseIcon",
      "hand",
      "caseOptionsIcons",
      "tooltip",
      "tooltip-bottom",
    );
    addCase.addEventListener("click", () => {
      this.presenter.addCase(uid);
      this.openCaseOptions(uid);
    });
    addCase.setAttribute("data-tooltip", "Fall hinzufügen");
    caseNumber.appendChild(addCase);

    const defaultOnTitle = document.createElement("dt");
    defaultOnTitle.classList.add("dtItem");
    defaultOnTitle.appendChild(
      document.createTextNode("Sonst Zweig einschalten:"),
    );
    list.appendChild(defaultOnTitle);
    const defaultOn = document.createElement("dd");
    defaultOn.classList.add("ddItem", "container");
    defaultOn.addEventListener("click", () => {
      this.presenter.switchDefaultState(uid);
      this.openCaseOptions(uid);
    });
    list.appendChild(defaultOn);
    const defaultNo = document.createElement("div");
    defaultNo.classList.add("text-center", "shortenOnMobile");
    defaultNo.setAttribute("data-abbr", "N");
    defaultOn.appendChild(defaultNo);
    const defaultNoText = document.createElement("span");
    defaultNoText.appendChild(document.createTextNode("Nein"));
    defaultNo.appendChild(defaultNoText);
    const switchDefault = document.createElement("div");
    switchDefault.classList.add("hand", "caseOptionsIcons");
    if (element.defaultOn) {
      switchDefault.classList.add("switchOn");
    } else {
      switchDefault.classList.add("switchOff");
    }
    defaultOn.appendChild(switchDefault);
    const defaultYes = document.createElement("div");
    defaultYes.classList.add("text-center", "shortenOnMobile");
    defaultYes.setAttribute("data-abbr", "J");
    defaultOn.appendChild(defaultYes);
    const defaultYesText = document.createElement("span");
    defaultYesText.appendChild(document.createTextNode("Ja"));
    defaultYes.appendChild(defaultYesText);

    const cancelButton = document.createElement("div");
    cancelButton.classList.add("modal-buttons", "hand");
    cancelButton.appendChild(document.createTextNode("Schließen"));
    cancelButton.addEventListener("click", () =>
      document.getElementById("IEModal").classList.remove("active"),
    );
    footer.appendChild(cancelButton);

    document.getElementById("IEModal").classList.add("active");
  }

  /**
   * Create option elements and add them to the displayed element
   *
   * @param    type   type of the element
   * @param    uid    id of the current struktogramm element
   * @return   div    complete HTML structure of the options for the element
   */
  createOptionDiv(type, uid) {
    // create the container for all options
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("optionContainer");

    // case nodes have additional options
    if (type === "CaseNode") {
      const caseOptions = document.createElement("div");
      caseOptions.classList.add(
        "gearIcon",
        "optionIcon",
        "hand",
        "tooltip",
        "tooltip-bottoml",
      );
      caseOptions.setAttribute("data-tooltip", "Einstellung");
      caseOptions.addEventListener("click", () => this.openCaseOptions(uid));
      optionDiv.appendChild(caseOptions);
    }

    // all elements can be moved, except InsertCases they are bind to the case node
    if (type !== "InsertCase" && type !== "FunctionNode") {
      const moveElem = document.createElement("div");
      moveElem.classList.add("moveIcon");
      moveElem.classList.add("optionIcon");
      moveElem.classList.add("hand");
      moveElem.classList.add("tooltip");
      moveElem.classList.add("tooltip-bottoml");
      moveElem.setAttribute("data-tooltip", "Verschieben");
      moveElem.addEventListener("click", () => this.presenter.moveElement(uid));
      optionDiv.appendChild(moveElem);
    }

    // every element can be deleted
    const deleteElem = document.createElement("div");
    deleteElem.classList.add("trashcan");
    deleteElem.classList.add("optionIcon");
    deleteElem.classList.add("hand");
    deleteElem.classList.add("tooltip");
    deleteElem.classList.add("tooltip-bottoml");
    deleteElem.setAttribute("data-tooltip", "Entfernen");
    deleteElem.addEventListener("click", () =>
      this.presenter.removeElement(uid),
    );
    optionDiv.appendChild(deleteElem);

    return optionDiv;
  }

  /**
   * Create the displayed text and edit input field
   *
   * @param    type      type of the element
   * @param    content   displayed text
   * @param    uid       id of the element
   * @return   div       complete build HTML structure
   */
  createTextDiv(type, content, uid, nrCases = null) {
    // create the parent container
    const textDiv = document.createElement("div");
    textDiv.classList.add("columnAuto", "symbol");

    // this div contains the hidden inputfield
    const editDiv = document.createElement("div");
    editDiv.classList.add("input-group", "editField");
    editDiv.style.display = "none";

    if (type === "FootLoopNode") {
      editDiv.classList.add(uid);
    }

    // inputfield with eventlisteners
    const editText = document.createElement("input");
    editText.type = "text";
    editText.value = content;
    // TODO: move to presenter
    editText.addEventListener("keyup", (event) => {
      if (event.keyCode === 13) {
        this.presenter.editElement(uid, editText.value);
      }
      if (event.keyCode === 27) {
        this.presenter.renderAllViews();
      }
    });

    // add apply button
    const editApply = document.createElement("div");
    editApply.classList.add("acceptIcon", "hand");
    editApply.addEventListener("click", () =>
      this.presenter.editElement(uid, editText.value),
    );

    // add dismiss button
    const editDismiss = document.createElement("div");
    editDismiss.classList.add("deleteIcon", "hand");
    editDismiss.addEventListener("click", () =>
      this.presenter.renderAllViews(),
    );

    // some types need additional text or a different position
    switch (type) {
      case "InputNode":
        content = "E: " + content;
        break;
      case "OutputNode":
        content = "A: " + content;
        break;
      case "BranchNode":
      case "InsertCase":
        textDiv.classList.add("text-center");
        break;
    }

    // add displayed text when not in editing mode
    const innerTextDiv = document.createElement("div");
    // innerTextDiv.classList.add('column');
    // innerTextDiv.classList.add('col-12');
    // special handling for the default case of case nodes
    if (!(type === "InsertCase" && content === "Sonst")) {
      innerTextDiv.classList.add("padding");
      if (!this.presenter.getInsertMode()) {
        innerTextDiv.classList.add("hand", "fullHeight");
      }
      innerTextDiv.addEventListener("click", () => {
        this.presenter.renderAllViews();
        this.presenter.switchEditState(uid);
      });
    }

    // insert text
    const textSpan = document.createElement("span");
    if (type === "CaseNode") {
      textSpan.style.marginLeft =
        "calc(" + (nrCases / (nrCases + 1)) * 100 + "% - 2em)";
    }
    const text = document.createTextNode(content);

    editDiv.appendChild(editText);
    editDiv.appendChild(editApply);
    editDiv.appendChild(editDismiss);

    textSpan.appendChild(text);
    innerTextDiv.appendChild(textSpan);
    textDiv.appendChild(innerTextDiv);
    textDiv.appendChild(editDiv);

    return textDiv;
  }

  /**
   * Render element tree to SVG
   * Returns {group, width, height}
   */
  renderElementToSVG(subTree, x, y, maxWidth, parentIsMoving, noInsert, renderInsertNode = false) {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const baseHeight = 32; // Height of a single row
    const fontSize = 14;
    
    if (subTree === null) {
      return { group: null, width: maxWidth, height: 0 };
    }

    // Check if this is the element being moved
    if (!(this.presenter.getMoveId() === null) && subTree.id === this.presenter.getMoveId()) {
      parentIsMoving = true;
      noInsert = true;
    }

    const group = document.createElementNS(SVG_NS, "g");
    if (subTree.id) {
      group.setAttribute("data-id", subTree.id);
    }
    
    let currentY = y;
    let totalHeight = 0;
    
    switch (subTree.type) {
      case "InsertNode":
        if (parentIsMoving) {
          return this.renderElementToSVG(subTree.followElement, x, y, maxWidth, false, false, renderInsertNode);
        } else if (noInsert) {
          return this.renderElementToSVG(subTree.followElement, x, y, maxWidth, false, true, renderInsertNode);
        } else if (this.presenter.getInsertMode()) {
          if (!this.presenter.getSettingFunctionMode() || renderInsertNode) {
            // Render insert placeholder
            const insertHeight = baseHeight * 0.7;
            const rect = document.createElementNS(SVG_NS, "rect");
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("width", maxWidth);
            rect.setAttribute("height", insertHeight);
            rect.setAttribute("fill", "#f0f0f0");
            rect.setAttribute("stroke", "black");
            rect.setAttribute("stroke-width", "1.5");
            rect.setAttribute("stroke-dasharray", "5,5");
            rect.style.cursor = "pointer";
            rect.addEventListener("click", () => this.presenter.appendElement(subTree.id));
            group.appendChild(rect);
            
            totalHeight = insertHeight;
            currentY += insertHeight;
            
            if (subTree.followElement && subTree.followElement.type !== "Placeholder") {
              const follow = this.renderElementToSVG(subTree.followElement, x, currentY, maxWidth, false, noInsert, renderInsertNode);
              if (follow.group) {
                group.appendChild(follow.group);
              }
              totalHeight += follow.height;
            }
            
            return { group, width: maxWidth, height: totalHeight };
          } else {
            return this.renderElementToSVG(subTree.followElement, x, y, maxWidth, false, noInsert, renderInsertNode);
          }
        } else {
          return this.renderElementToSVG(subTree.followElement, x, y, maxWidth, parentIsMoving, noInsert, renderInsertNode);
        }

      case "Placeholder": {
        const rect = document.createElementNS(SVG_NS, "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", maxWidth);
        rect.setAttribute("height", baseHeight);
        rect.setAttribute("fill", "#f0f0f0");
        rect.setAttribute("stroke", "black");
        rect.setAttribute("stroke-width", "1.5");
        group.appendChild(rect);
        return { group, width: maxWidth, height: baseHeight };
      }

      case "InputNode":
      case "OutputNode":
      case "TaskNode": {
        // Draw rectangle
        const rect = document.createElementNS(SVG_NS, "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", maxWidth);
        rect.setAttribute("height", baseHeight);
        rect.setAttribute("fill", config.get()[subTree.type].color);
        rect.setAttribute("stroke", "black");
        rect.setAttribute("stroke-width", "1.5");
        group.appendChild(rect);
        
        // Add text
        let displayText = subTree.text;
        if (subTree.type === "InputNode") {
          displayText = "E: " + displayText;
        } else if (subTree.type === "OutputNode") {
          displayText = "A: " + displayText;
        }
        
        const text = this.createSVGText(x + maxWidth / 2, y + baseHeight / 2, displayText, fontSize, maxWidth * 0.9);
        text.style.cursor = "pointer";
        text.addEventListener("click", () => {
          this.presenter.renderAllViews();
          this.presenter.switchEditState(subTree.id);
        });
        group.appendChild(text);
        
        // Add option icons (delete, move) as foreignObject
        const optionsGroup = this.createSVGOptions(x, y, maxWidth, baseHeight, subTree.type, subTree.id);
        group.appendChild(optionsGroup);
        
        totalHeight = baseHeight;
        currentY += baseHeight;
        
        // Render following element
        if (subTree.followElement) {
          const follow = this.renderElementToSVG(subTree.followElement, x, currentY, maxWidth, parentIsMoving, noInsert, renderInsertNode);
          if (follow.group) {
            group.appendChild(follow.group);
          }
          totalHeight += follow.height;
        }
        
        return { group, width: maxWidth, height: totalHeight };
      }

      case "BranchNode": {
        const headHeight = baseHeight * 2;
        
        // Draw main rectangle for condition
        const condRect = document.createElementNS(SVG_NS, "rect");
        condRect.setAttribute("x", x);
        condRect.setAttribute("y", y);
        condRect.setAttribute("width", maxWidth);
        condRect.setAttribute("height", baseHeight);
        condRect.setAttribute("fill", config.get()[subTree.type].color);
        condRect.setAttribute("stroke", "black");
        condRect.setAttribute("stroke-width", "1.5");
        group.appendChild(condRect);
        
        // Add condition text
        const condText = this.createSVGText(x + maxWidth / 2, y + baseHeight / 2, subTree.text, fontSize, maxWidth * 0.9);
        condText.style.cursor = "pointer";
        condText.addEventListener("click", () => {
          this.presenter.renderAllViews();
          this.presenter.switchEditState(subTree.id);
        });
        group.appendChild(condText);
        
        // Add options
        const optionsGroup = this.createSVGOptions(x, y, maxWidth, baseHeight, subTree.type, subTree.id);
        group.appendChild(optionsGroup);
        
        currentY += baseHeight;
        
        // Draw triangular split
        const triangleHeight = baseHeight;
        const midX = x + maxWidth / 2;
        
        const leftLine = document.createElementNS(SVG_NS, "line");
        leftLine.setAttribute("x1", x);
        leftLine.setAttribute("y1", currentY);
        leftLine.setAttribute("x2", midX);
        leftLine.setAttribute("y2", currentY + triangleHeight);
        leftLine.setAttribute("stroke", "black");
        leftLine.setAttribute("stroke-width", "1.5");
        group.appendChild(leftLine);
        
        const rightLine = document.createElementNS(SVG_NS, "line");
        rightLine.setAttribute("x1", x + maxWidth);
        rightLine.setAttribute("y1", currentY);
        rightLine.setAttribute("x2", midX);
        rightLine.setAttribute("y2", currentY + triangleHeight);
        rightLine.setAttribute("stroke", "black");
        rightLine.setAttribute("stroke-width", "1.5");
        group.appendChild(rightLine);
        
        // Add "Wahr" and "Falsch" labels
        const trueLabel = this.createSVGText(x + maxWidth * 0.25, currentY + triangleHeight * 0.4, "Wahr", fontSize * 0.85);
        group.appendChild(trueLabel);
        
        const falseLabel = this.createSVGText(x + maxWidth * 0.75, currentY + triangleHeight * 0.4, "Falsch", fontSize * 0.85);
        group.appendChild(falseLabel);
        
        currentY += triangleHeight;
        
        // Render branches side by side
        const halfWidth = maxWidth / 2;
        
        const trueResult = this.renderElementToSVG(subTree.trueChild, x, currentY, halfWidth, false, noInsert, renderInsertNode);
        if (trueResult.group) {
          group.appendChild(trueResult.group);
        }
        
        const falseResult = this.renderElementToSVG(subTree.falseChild, x + halfWidth, currentY, halfWidth, false, noInsert, renderInsertNode);
        if (falseResult.group) {
          group.appendChild(falseResult.group);
        }
        
        // Vertical separator line
        const maxBranchHeight = Math.max(trueResult.height, falseResult.height);
        const separatorLine = document.createElementNS(SVG_NS, "line");
        separatorLine.setAttribute("x1", midX);
        separatorLine.setAttribute("y1", currentY);
        separatorLine.setAttribute("x2", midX);
        separatorLine.setAttribute("y2", currentY + maxBranchHeight);
        separatorLine.setAttribute("stroke", "black");
        separatorLine.setAttribute("stroke-width", "1.5");
        group.appendChild(separatorLine);
        
        currentY += maxBranchHeight;
        totalHeight = headHeight + maxBranchHeight;
        
        // Render following element
        if (subTree.followElement) {
          const follow = this.renderElementToSVG(subTree.followElement, x, currentY, maxWidth, parentIsMoving, noInsert, renderInsertNode);
          if (follow.group) {
            group.appendChild(follow.group);
          }
          totalHeight += follow.height;
        }
        
        return { group, width: maxWidth, height: totalHeight };
      }

      case "HeadLoopNode":
      case "CountLoopNode": {
        const indent = 32;
        
        // Draw header rectangle
        const headerRect = document.createElementNS(SVG_NS, "rect");
        headerRect.setAttribute("x", x);
        headerRect.setAttribute("y", y);
        headerRect.setAttribute("width", maxWidth);
        headerRect.setAttribute("height", baseHeight);
        headerRect.setAttribute("fill", config.get()[subTree.type].color);
        headerRect.setAttribute("stroke", "black");
        headerRect.setAttribute("stroke-width", "1.5");
        group.appendChild(headerRect);
        
        // Add text
        const text = this.createSVGText(x + maxWidth / 2, y + baseHeight / 2, subTree.text, fontSize, maxWidth * 0.9);
        text.style.cursor = "pointer";
        text.addEventListener("click", () => {
          this.presenter.renderAllViews();
          this.presenter.switchEditState(subTree.id);
        });
        group.appendChild(text);
        
        // Add options
        const optionsGroup = this.createSVGOptions(x, y, maxWidth, baseHeight, subTree.type, subTree.id);
        group.appendChild(optionsGroup);
        
        currentY += baseHeight;
        
        // Render loop body with left border
        const bodyResult = this.renderElementToSVG(subTree.child, x + indent, currentY, maxWidth - indent, false, noInsert, renderInsertNode);
        if (bodyResult.group) {
          group.appendChild(bodyResult.group);
        }
        
        // Left border line
        const leftBorder = document.createElementNS(SVG_NS, "line");
        leftBorder.setAttribute("x1", x + indent);
        leftBorder.setAttribute("y1", currentY);
        leftBorder.setAttribute("x2", x + indent);
        leftBorder.setAttribute("y2", currentY + bodyResult.height);
        leftBorder.setAttribute("stroke", "black");
        leftBorder.setAttribute("stroke-width", "1.5");
        group.appendChild(leftBorder);
        
        totalHeight = baseHeight + bodyResult.height;
        currentY += bodyResult.height;
        
        // Render following element
        if (subTree.followElement) {
          const follow = this.renderElementToSVG(subTree.followElement, x, currentY, maxWidth, parentIsMoving, noInsert, renderInsertNode);
          if (follow.group) {
            group.appendChild(follow.group);
          }
          totalHeight += follow.height;
        }
        
        return { group, width: maxWidth, height: totalHeight };
      }

      case "FootLoopNode": {
        const indent = 32;
        
        // Render loop body with left and bottom border
        const bodyResult = this.renderElementToSVG(subTree.child, x + indent, y, maxWidth - indent, false, noInsert, renderInsertNode);
        if (bodyResult.group) {
          group.appendChild(bodyResult.group);
        }
        
        // Left border line
        const leftBorder = document.createElementNS(SVG_NS, "line");
        leftBorder.setAttribute("x1", x + indent);
        leftBorder.setAttribute("y1", y);
        leftBorder.setAttribute("x2", x + indent);
        leftBorder.setAttribute("y2", y + bodyResult.height);
        leftBorder.setAttribute("stroke", "black");
        leftBorder.setAttribute("stroke-width", "1.5");
        group.appendChild(leftBorder);
        
        // Bottom border line
        const bottomBorder = document.createElementNS(SVG_NS, "line");
        bottomBorder.setAttribute("x1", x + indent);
        bottomBorder.setAttribute("y1", y + bodyResult.height);
        bottomBorder.setAttribute("x2", x + maxWidth);
        bottomBorder.setAttribute("y2", y + bodyResult.height);
        bottomBorder.setAttribute("stroke", "black");
        bottomBorder.setAttribute("stroke-width", "1.5");
        group.appendChild(bottomBorder);
        
        currentY += bodyResult.height;
        
        // Draw footer rectangle
        const footerRect = document.createElementNS(SVG_NS, "rect");
        footerRect.setAttribute("x", x);
        footerRect.setAttribute("y", currentY);
        footerRect.setAttribute("width", maxWidth);
        footerRect.setAttribute("height", baseHeight);
        footerRect.setAttribute("fill", config.get()[subTree.type].color);
        footerRect.setAttribute("stroke", "black");
        footerRect.setAttribute("stroke-width", "1.5");
        group.appendChild(footerRect);
        
        // Add text
        const text = this.createSVGText(x + maxWidth / 2, currentY + baseHeight / 2, subTree.text, fontSize);
        text.style.cursor = "pointer";
        text.addEventListener("click", () => {
          this.presenter.renderAllViews();
          this.presenter.switchEditState(subTree.id);
        });
        group.appendChild(text);
        
        // Add options
        const optionsGroup = this.createSVGOptions(x, currentY, maxWidth, baseHeight, subTree.type, subTree.id);
        group.appendChild(optionsGroup);
        
        totalHeight = bodyResult.height + baseHeight;
        currentY += baseHeight;
        
        // Render following element
        if (subTree.followElement) {
          const follow = this.renderElementToSVG(subTree.followElement, x, currentY, maxWidth, parentIsMoving, noInsert, renderInsertNode);
          if (follow.group) {
            group.appendChild(follow.group);
          }
          totalHeight += follow.height;
        }
        
        return { group, width: maxWidth, height: totalHeight };
      }

      case "CaseNode": {
        const totalCases = subTree.defaultOn ? subTree.cases.length + 1 : subTree.cases.length;
        
        // Draw header rectangle
        const headerRect = document.createElementNS(SVG_NS, "rect");
        headerRect.setAttribute("x", x);
        headerRect.setAttribute("y", y);
        headerRect.setAttribute("width", maxWidth);
        headerRect.setAttribute("height", baseHeight);
        headerRect.setAttribute("fill", config.get()[subTree.type].color);
        headerRect.setAttribute("stroke", "black");
        headerRect.setAttribute("stroke-width", "1.5");
        group.appendChild(headerRect);
        
        // Draw case triangular divisions
        if (subTree.defaultOn) {
          const convergePoint = (subTree.cases.length / totalCases) * maxWidth;
          
          const leftLine = document.createElementNS(SVG_NS, "line");
          leftLine.setAttribute("x1", x);
          leftLine.setAttribute("y1", y);
          leftLine.setAttribute("x2", x + convergePoint);
          leftLine.setAttribute("y2", y + baseHeight);
          leftLine.setAttribute("stroke", "black");
          leftLine.setAttribute("stroke-width", "1.5");
          group.appendChild(leftLine);
          
          const rightLine = document.createElementNS(SVG_NS, "line");
          rightLine.setAttribute("x1", x + maxWidth);
          rightLine.setAttribute("y1", y);
          rightLine.setAttribute("x2", x + convergePoint);
          rightLine.setAttribute("y2", y + baseHeight);
          rightLine.setAttribute("stroke", "black");
          rightLine.setAttribute("stroke-width", "1.5");
          group.appendChild(rightLine);
          
          for (let i = 1; i < subTree.cases.length; i++) {
            const xPos = x + (i / totalCases) * maxWidth;
            const yStart = y + (i / subTree.cases.length) * baseHeight;
            
            const vertLine = document.createElementNS(SVG_NS, "line");
            vertLine.setAttribute("x1", xPos);
            vertLine.setAttribute("y1", yStart);
            vertLine.setAttribute("x2", xPos);
            vertLine.setAttribute("y2", y + baseHeight);
            vertLine.setAttribute("stroke", "black");
            vertLine.setAttribute("stroke-width", "1.5");
            group.appendChild(vertLine);
          }
        } else {
          const diagonal = document.createElementNS(SVG_NS, "line");
          diagonal.setAttribute("x1", x);
          diagonal.setAttribute("y1", y);
          diagonal.setAttribute("x2", x + maxWidth);
          diagonal.setAttribute("y2", y + baseHeight);
          diagonal.setAttribute("stroke", "black");
          diagonal.setAttribute("stroke-width", "1.5");
          group.appendChild(diagonal);
          
          for (let i = 1; i < subTree.cases.length; i++) {
            const xPos = x + (i / subTree.cases.length) * maxWidth;
            const yStart = y + (i / subTree.cases.length) * baseHeight;
            
            const vertLine = document.createElementNS(SVG_NS, "line");
            vertLine.setAttribute("x1", xPos);
            vertLine.setAttribute("y1", yStart);
            vertLine.setAttribute("x2", xPos);
            vertLine.setAttribute("y2", y + baseHeight);
            vertLine.setAttribute("stroke", "black");
            vertLine.setAttribute("stroke-width", "1.5");
            group.appendChild(vertLine);
          }
        }
        
        // Add case text
        const textX = x + ((subTree.cases.length / (totalCases + 1)) * maxWidth);
        const text = this.createSVGText(textX, y + baseHeight / 2, subTree.text, fontSize);
        text.style.cursor = "pointer";
        text.addEventListener("click", () => {
          this.presenter.renderAllViews();
          this.presenter.switchEditState(subTree.id);
        });
        group.appendChild(text);
        
        // Add options
        const optionsGroup = this.createSVGOptions(x, y, maxWidth, baseHeight, subTree.type, subTree.id);
        group.appendChild(optionsGroup);
        
        currentY += baseHeight;
        
        // Render case bodies
        const caseWidth = maxWidth / totalCases;
        const caseResults = [];
        let maxCaseHeight = 0;
        
        for (let i = 0; i < subTree.cases.length; i++) {
          const caseX = x + i * caseWidth;
          const caseResult = this.renderElementToSVG(subTree.cases[i], caseX, currentY, caseWidth, false, noInsert, renderInsertNode);
          if (caseResult.group) {
            group.appendChild(caseResult.group);
          }
          caseResults.push(caseResult);
          maxCaseHeight = Math.max(maxCaseHeight, caseResult.height);
        }
        
        if (subTree.defaultOn) {
          const defaultX = x + subTree.cases.length * caseWidth;
          const defaultResult = this.renderElementToSVG(subTree.defaultNode, defaultX, currentY, caseWidth, false, noInsert, renderInsertNode);
          if (defaultResult.group) {
            group.appendChild(defaultResult.group);
          }
          maxCaseHeight = Math.max(maxCaseHeight, defaultResult.height);
        }
        
        // Draw vertical separators for case bodies
        const effectiveCases = subTree.defaultOn ? subTree.cases.length : subTree.cases.length - 1;
        for (let i = 1; i <= effectiveCases; i++) {
          const xPos = x + (i / totalCases) * maxWidth;
          
          const separatorLine = document.createElementNS(SVG_NS, "line");
          separatorLine.setAttribute("x1", xPos);
          separatorLine.setAttribute("y1", currentY);
          separatorLine.setAttribute("x2", xPos);
          separatorLine.setAttribute("y2", currentY + maxCaseHeight);
          separatorLine.setAttribute("stroke", "black");
          separatorLine.setAttribute("stroke-width", "1.5");
          group.appendChild(separatorLine);
        }
        
        totalHeight = baseHeight + maxCaseHeight;
        currentY += maxCaseHeight;
        
        // Render following element
        if (subTree.followElement) {
          const follow = this.renderElementToSVG(subTree.followElement, x, currentY, maxWidth, parentIsMoving, noInsert, renderInsertNode);
          if (follow.group) {
            group.appendChild(follow.group);
          }
          totalHeight += follow.height;
        }
        
        return { group, width: maxWidth, height: totalHeight };
      }

      case "TryCatchNode": {
        const indent = 32;
        
        // Draw "Try" header
        const tryHeaderRect = document.createElementNS(SVG_NS, "rect");
        tryHeaderRect.setAttribute("x", x);
        tryHeaderRect.setAttribute("y", y);
        tryHeaderRect.setAttribute("width", maxWidth);
        tryHeaderRect.setAttribute("height", baseHeight);
        tryHeaderRect.setAttribute("fill", config.get()[subTree.type].color);
        tryHeaderRect.setAttribute("stroke", "black");
        tryHeaderRect.setAttribute("stroke-width", "1.5");
        group.appendChild(tryHeaderRect);
        
        const tryText = this.createSVGText(x + maxWidth / 2, y + baseHeight / 2, "Try", fontSize);
        group.appendChild(tryText);
        
        // Add options
        const optionsGroup = this.createSVGOptions(x, y, maxWidth, baseHeight, subTree.type, subTree.id);
        group.appendChild(optionsGroup);
        
        currentY += baseHeight;
        
        // Render try body
        const tryResult = this.renderElementToSVG(subTree.tryChild, x + indent, currentY, maxWidth - indent, false, noInsert, renderInsertNode);
        if (tryResult.group) {
          group.appendChild(tryResult.group);
        }
        
        // Left border for try body
        const tryLeftBorder = document.createElementNS(SVG_NS, "line");
        tryLeftBorder.setAttribute("x1", x + indent);
        tryLeftBorder.setAttribute("y1", currentY);
        tryLeftBorder.setAttribute("x2", x + indent);
        tryLeftBorder.setAttribute("y2", currentY + tryResult.height);
        tryLeftBorder.setAttribute("stroke", "black");
        tryLeftBorder.setAttribute("stroke-width", "1.5");
        group.appendChild(tryLeftBorder);
        
        currentY += tryResult.height;
        
        // Vertical line between try and catch
        const vertLine = document.createElementNS(SVG_NS, "line");
        vertLine.setAttribute("x1", x + indent);
        vertLine.setAttribute("y1", currentY);
        vertLine.setAttribute("x2", x + indent);
        vertLine.setAttribute("y2", currentY + 3);
        vertLine.setAttribute("stroke", "black");
        vertLine.setAttribute("stroke-width", "1.5");
        group.appendChild(vertLine);
        
        const bottomLine = document.createElementNS(SVG_NS, "line");
        bottomLine.setAttribute("x1", x + indent);
        bottomLine.setAttribute("y1", currentY + 3);
        bottomLine.setAttribute("x2", x + maxWidth);
        bottomLine.setAttribute("y2", currentY + 3);
        bottomLine.setAttribute("stroke", "black");
        bottomLine.setAttribute("stroke-width", "1.5");
        group.appendChild(bottomLine);
        
        currentY += 3;
        
        // Draw "Catch" header
        const catchHeaderRect = document.createElementNS(SVG_NS, "rect");
        catchHeaderRect.setAttribute("x", x);
        catchHeaderRect.setAttribute("y", currentY);
        catchHeaderRect.setAttribute("width", maxWidth);
        catchHeaderRect.setAttribute("height", baseHeight);
        catchHeaderRect.setAttribute("fill", config.get()[subTree.type].color);
        catchHeaderRect.setAttribute("stroke", "black");
        catchHeaderRect.setAttribute("stroke-width", "1.5");
        group.appendChild(catchHeaderRect);
        
        const catchLabel = this.createSVGText(x + maxWidth * 0.2, currentY + baseHeight / 2, "Catch", fontSize);
        group.appendChild(catchLabel);
        
        const catchText = this.createSVGText(x + maxWidth * 0.6, currentY + baseHeight / 2, subTree.text, fontSize);
        catchText.style.cursor = "pointer";
        catchText.addEventListener("click", () => {
          this.presenter.renderAllViews();
          this.presenter.switchEditState(subTree.id);
        });
        group.appendChild(catchText);
        
        currentY += baseHeight;
        
        // Render catch body
        const catchResult = this.renderElementToSVG(subTree.catchChild, x + indent, currentY, maxWidth - indent, false, noInsert, renderInsertNode);
        if (catchResult.group) {
          group.appendChild(catchResult.group);
        }
        
        // Left border for catch body
        const catchLeftBorder = document.createElementNS(SVG_NS, "line");
        catchLeftBorder.setAttribute("x1", x + indent);
        catchLeftBorder.setAttribute("y1", currentY);
        catchLeftBorder.setAttribute("x2", x + indent);
        catchLeftBorder.setAttribute("y2", currentY + catchResult.height);
        catchLeftBorder.setAttribute("stroke", "black");
        catchLeftBorder.setAttribute("stroke-width", "1.5");
        group.appendChild(catchLeftBorder);
        
        totalHeight = baseHeight + tryResult.height + 3 + baseHeight + catchResult.height;
        currentY += catchResult.height;
        
        // Render following element
        if (subTree.followElement) {
          const follow = this.renderElementToSVG(subTree.followElement, x, currentY, maxWidth, parentIsMoving, noInsert, renderInsertNode);
          if (follow.group) {
            group.appendChild(follow.group);
          }
          totalHeight += follow.height;
        }
        
        return { group, width: maxWidth, height: totalHeight };
      }

      case "FunctionNode": {
        const indent = 32;
        
        // Draw function header rectangle
        const headerRect = document.createElementNS(SVG_NS, "rect");
        headerRect.setAttribute("x", x);
        headerRect.setAttribute("y", y);
        headerRect.setAttribute("width", maxWidth);
        headerRect.setAttribute("height", baseHeight);
        headerRect.setAttribute("fill", config.get()[subTree.type].color);
        headerRect.setAttribute("stroke", "black");
        headerRect.setAttribute("stroke-width", "1.5");
        group.appendChild(headerRect);
        
        // Function signature text
        let funcSignature = `function ${subTree.text}(`;
        if (subTree.parameters && subTree.parameters.length > 0) {
          funcSignature += subTree.parameters.map(p => p.parName).join(", ");
        }
        funcSignature += ") {";
        
        const funcText = this.createSVGText(x + maxWidth / 2, y + baseHeight / 2, funcSignature, fontSize);
        funcText.style.cursor = "pointer";
        funcText.addEventListener("click", () => {
          this.presenter.renderAllViews();
          this.presenter.switchEditState(subTree.id);
        });
        group.appendChild(funcText);
        
        // Add options
        const optionsGroup = this.createSVGOptions(x, y, maxWidth, baseHeight, subTree.type, subTree.id);
        group.appendChild(optionsGroup);
        
        currentY += baseHeight;
        
        // Render function body
        const bodyResult = this.renderElementToSVG(subTree.child, x + indent, currentY, maxWidth - indent, false, noInsert, renderInsertNode);
        if (bodyResult.group) {
          group.appendChild(bodyResult.group);
        }
        
        // Left border
        const leftBorder = document.createElementNS(SVG_NS, "line");
        leftBorder.setAttribute("x1", x + indent);
        leftBorder.setAttribute("y1", currentY);
        leftBorder.setAttribute("x2", x + indent);
        leftBorder.setAttribute("y2", currentY + bodyResult.height);
        leftBorder.setAttribute("stroke", "black");
        leftBorder.setAttribute("stroke-width", "1.5");
        group.appendChild(leftBorder);
        
        currentY += bodyResult.height;
        
        // Vertical line before footer
        const vertLine = document.createElementNS(SVG_NS, "line");
        vertLine.setAttribute("x1", x + indent);
        vertLine.setAttribute("y1", currentY);
        vertLine.setAttribute("x2", x + indent);
        vertLine.setAttribute("y2", currentY + 3);
        vertLine.setAttribute("stroke", "black");
        vertLine.setAttribute("stroke-width", "1.5");
        group.appendChild(vertLine);
        
        const bottomLine = document.createElementNS(SVG_NS, "line");
        bottomLine.setAttribute("x1", x + indent);
        bottomLine.setAttribute("y1", currentY + 3);
        bottomLine.setAttribute("x2", x + maxWidth);
        bottomLine.setAttribute("y2", currentY + 3);
        bottomLine.setAttribute("stroke", "black");
        bottomLine.setAttribute("stroke-width", "1.5");
        group.appendChild(bottomLine);
        
        currentY += 3;
        
        // Draw footer rectangle
        const footerRect = document.createElementNS(SVG_NS, "rect");
        footerRect.setAttribute("x", x);
        footerRect.setAttribute("y", currentY);
        footerRect.setAttribute("width", maxWidth);
        footerRect.setAttribute("height", baseHeight);
        footerRect.setAttribute("fill", config.get()[subTree.type].color);
        footerRect.setAttribute("stroke", "black");
        footerRect.setAttribute("stroke-width", "1.5");
        group.appendChild(footerRect);
        
        const closingBrace = this.createSVGText(x + maxWidth / 2, currentY + baseHeight / 2, "}", fontSize);
        group.appendChild(closingBrace);
        
        totalHeight = baseHeight + bodyResult.height + 3 + baseHeight;
        currentY += baseHeight;
        
        // Render following element
        if (subTree.followElement) {
          const follow = this.renderElementToSVG(subTree.followElement, x, currentY, maxWidth, parentIsMoving, noInsert, renderInsertNode);
          if (follow.group) {
            group.appendChild(follow.group);
          }
          totalHeight += follow.height;
        }
        
        return { group, width: maxWidth, height: totalHeight };
      }

      case "InsertCase": {
        // Draw rectangle with case text
        const rect = document.createElementNS(SVG_NS, "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", maxWidth);
        rect.setAttribute("height", baseHeight);
        rect.setAttribute("fill", config.get()[subTree.type]?.color || "#fff");
        rect.setAttribute("stroke", "black");
        rect.setAttribute("stroke-width", "1.5");
        group.appendChild(rect);
        
        const text = this.createSVGText(x + maxWidth / 2, y + baseHeight / 2, subTree.text, fontSize, maxWidth * 0.9);
        group.appendChild(text);
        
        // Add options if not "Sonst"
        if (subTree.text !== "Sonst") {
          const optionsGroup = this.createSVGOptions(x, y, maxWidth, baseHeight, subTree.type, subTree.id);
          group.appendChild(optionsGroup);
        }
        
        totalHeight = baseHeight;
        currentY += baseHeight;
        
        // Render following element
        if (subTree.followElement) {
          const follow = this.renderElementToSVG(subTree.followElement, x, currentY, maxWidth, parentIsMoving, noInsert, renderInsertNode);
          if (follow.group) {
            group.appendChild(follow.group);
          }
          totalHeight += follow.height;
        }
        
        return { group, width: maxWidth, height: totalHeight };
      }

      default:
        return this.renderElementToSVG(subTree.followElement, x, y, maxWidth, parentIsMoving, noInsert, renderInsertNode);
    }
  }

  /**
   * Create SVG text element with proper wrapping
   */
  createSVGText(x, y, text, fontSize, maxWidth = null) {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const svgText = document.createElementNS(SVG_NS, "text");
    svgText.setAttribute("x", x);
    svgText.setAttribute("y", y);
    svgText.setAttribute("text-anchor", "middle");
    svgText.setAttribute("dominant-baseline", "middle");
    svgText.setAttribute("font-size", fontSize);
    svgText.setAttribute("font-family", "Verdana, Geneva, sans-serif");
    
    // If maxWidth is provided, wrap text into multiple tspan elements
    if (maxWidth && text.length > 0) {
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';
      const charsPerLine = Math.floor(maxWidth / (fontSize * 0.5)); // Rough estimate
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length <= charsPerLine) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
          }
          currentLine = word;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
      
      // Create tspan for each line
      if (lines.length > 1) {
        const lineHeight = fontSize * 1.2;
        const startY = y - ((lines.length - 1) * lineHeight) / 2;
        
        lines.forEach((line, index) => {
          const tspan = document.createElementNS(SVG_NS, "tspan");
          tspan.setAttribute("x", x);
          tspan.setAttribute("y", startY + (index * lineHeight));
          tspan.textContent = line;
          svgText.appendChild(tspan);
        });
      } else {
        svgText.textContent = text;
      }
    } else {
      svgText.textContent = text;
    }
    
    return svgText;
  }

  /**
   * Create SVG options (delete, move icons) using foreignObject
   */
  createSVGOptions(x, y, width, height, type, uid) {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const group = document.createElementNS(SVG_NS, "g");
    
    // Use foreignObject to embed HTML for icons
    const fo = document.createElementNS(SVG_NS, "foreignObject");
    fo.setAttribute("x", x + width - 80);
    fo.setAttribute("y", y);
    fo.setAttribute("width", 80);
    fo.setAttribute("height", height);
    
    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("optionContainer");
    optionsDiv.style.position = "relative";
    optionsDiv.style.width = "100%";
    optionsDiv.style.height = "100%";
    optionsDiv.style.display = "flex";
    optionsDiv.style.justifyContent = "flex-end";
    optionsDiv.style.alignItems = "center";
    optionsDiv.style.opacity = "0";
    optionsDiv.style.transition = "opacity 0.2s";
    
    // Show on hover
    fo.addEventListener("mouseenter", () => {
      optionsDiv.style.opacity = "1";
    });
    fo.addEventListener("mouseleave", () => {
      optionsDiv.style.opacity = "0";
    });
    
    // Move button (if applicable)
    if (type !== "InsertCase" && type !== "FunctionNode") {
      const moveBtn = document.createElement("div");
      moveBtn.classList.add("moveIcon", "optionIcon", "hand");
      moveBtn.style.width = "1em";
      moveBtn.style.height = "100%";
      moveBtn.style.marginLeft = "0.4em";
      moveBtn.title = "Verschieben";
      moveBtn.addEventListener("click", () => this.presenter.moveElement(uid));
      optionsDiv.appendChild(moveBtn);
    }
    
    // Delete button
    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("trashcan", "optionIcon", "hand");
    deleteBtn.style.width = "1em";
    deleteBtn.style.height = "100%";
    deleteBtn.style.marginLeft = "0.4em";
    deleteBtn.title = "Entfernen";
    deleteBtn.addEventListener("click", () => this.presenter.removeElement(uid));
    optionsDiv.appendChild(deleteBtn);
    
    // Case node gear icon
    if (type === "CaseNode") {
      const gearBtn = document.createElement("div");
      gearBtn.classList.add("gearIcon", "optionIcon", "hand");
      gearBtn.style.width = "1em";
      gearBtn.style.height = "100%";
      gearBtn.style.marginLeft = "0.4em";
      gearBtn.title = "Einstellung";
      gearBtn.addEventListener("click", () => this.openCaseOptions(uid));
      optionsDiv.insertBefore(gearBtn, optionsDiv.firstChild);
    }
    
    fo.appendChild(optionsDiv);
    group.appendChild(fo);
    
    return group;
  }

  applyCodeEventListeners(obj) {
    // do not apply event listeners if obj is the function block
    if (!obj.firstChild.classList.contains("func-box-header")) {
      if (obj.firstChild.firstChild.classList.contains("loopShift")) {
        obj.firstChild.lastChild.addEventListener("mouseover", function () {
          const elemSpan = document.getElementById(obj.id + "-codeLine");
          if (elemSpan) {
            elemSpan.classList.add("highlight");
          }
        });
        obj.firstChild.lastChild.addEventListener("mouseout", function () {
          const elemSpan = document.getElementById(obj.id + "-codeLine");
          if (elemSpan) {
            elemSpan.classList.remove("highlight");
          }
        });
      } else {
        obj.firstChild.firstChild.addEventListener("mouseover", function () {
          const elemSpan = document.getElementById(obj.id + "-codeLine");
          if (elemSpan) {
            elemSpan.classList.add("highlight");
          }
        });
        obj.firstChild.firstChild.addEventListener("mouseout", function () {
          const elemSpan = document.getElementById(obj.id + "-codeLine");
          if (elemSpan) {
            elemSpan.classList.remove("highlight");
          }
        });
      }
    }
  }

  /**
   * Create an outer HTML structure before adding another element
   *
   * @param    subTree          part of the tree with all children of current element
   * @param    parentIsMoving   must be passed down to renderTree
   * @param    noInsert         must be passed down to renderTree
   * @return   div              complete wrapped HTML structure
   */
  prepareRenderTree(subTree, parentIsMoving, noInsert) {
    // end of recursion
    if (
      subTree === null ||
      (subTree.type === "InsertNode" &&
        subTree.followElement === null &&
        !this.presenter.getInsertMode())
    ) {
      return document.createTextNode("");
    } else {
      // create outlining structure
      const innerDiv = document.createElement("div");
      innerDiv.classList.add("column");
      innerDiv.classList.add("col-12");

      const box = document.createElement("div");
      box.classList.add("columns");
      if (subTree.type !== "InsertCase") {
        box.classList.add("lineTop");
      }
      // render every element and append it to the outlining structure
      this.renderTree(subTree, parentIsMoving, noInsert).forEach(
        function (childElement) {
          innerDiv.appendChild(childElement);
        },
      );
      box.appendChild(innerDiv);

      return box;
    }
  }

  /**
   * Create for every element a HTML representation and recursively render the next element
   *
   * @param    subTree          part of the tree with all children of current element
   * @param    parentIsMoving   get set to true, when the moving element is found in the tree
   * @param    noInsert         indicates a parent element is in the move state, so no InsertNodes should be displayed on the children
   * @return   []               array of div elements with the HTML representation of the element
   */
  renderTree(subTree, parentIsMoving, noInsert) {
    if (subTree === null) {
      return [];
    } else {
      if (
        !(this.presenter.getMoveId() === null) &&
        subTree.id === this.presenter.getMoveId()
      ) {
        parentIsMoving = true;
        noInsert = true;
      }
      switch (subTree.type) {
        case "InsertNode":
          if (parentIsMoving) {
            return this.renderTree(subTree.followElement, false, false);
          } else {
            if (noInsert) {
              return this.renderTree(subTree.followElement, false, true);
            } else {
              if (this.presenter.getInsertMode()) {
                const div = document.createElement("div");
                div.id = subTree.id;
                // div.classList.add('c-hand');
                // div.classList.add('text-center');
                div.addEventListener("dragover", function (event) {
                  event.preventDefault();
                });
                div.addEventListener("drop", () =>
                  this.presenter.appendElement(subTree.id),
                );
                div.addEventListener("click", () =>
                  this.presenter.appendElement(subTree.id),
                );
                const text = document.createElement("div");
                if (
                  this.presenter.getMoveId() &&
                  subTree.followElement &&
                  subTree.followElement.id === this.presenter.getMoveId()
                ) {
                  const bold = document.createElement("strong");
                  bold.appendChild(
                    document.createTextNode("Verschieben abbrechen"),
                  );
                  text.appendChild(bold);
                } else {
                  text.classList.add("insertIcon");
                }
                // text.classList.add('p-centered');
                div.appendChild(text);
                if (
                  subTree.followElement === null ||
                  subTree.followElement.type === "Placeholder"
                ) {
                  return [this.addCssWrapper(div, true, parentIsMoving)];
                } else {
                  return [
                    this.addCssWrapper(div, true, parentIsMoving),
                    this.prepareRenderTree(
                      subTree.followElement,
                      false,
                      noInsert,
                    ),
                  ];
                }
              } else {
                return this.renderTree(
                  subTree.followElement,
                  parentIsMoving,
                  noInsert,
                );
              }
            }
          }
        case "Placeholder":
          if (this.presenter.getInsertMode()) {
            return [];
          } else {
            const div = document.createElement("div");
            div.classList.add("text-center");
            const text = document.createElement("div");
            text.classList.add("emptyStateIcon");
            text.classList.add("p-centered");
            div.appendChild(text);
            return [div];
          }

        case "InputNode":
        case "OutputNode":
        case "TaskNode": {
          const div = document.createElement("div");
          div.id = subTree.id;
          div.classList.add("columns");
          div.classList.add("element");

          const textDiv = this.createTextDiv(
            subTree.type,
            subTree.text,
            subTree.id,
          );
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
          div.appendChild(textDiv);
          div.appendChild(optionDiv);

          return [
            this.addCssWrapper(div, false, parentIsMoving),
            this.prepareRenderTree(
              subTree.followElement,
              parentIsMoving,
              noInsert,
            ),
          ];
        }
        case "FunctionNode": {
          const div = document.createElement("div");
          div.id = subTree.id;
          div.classList.add(["columns", "element"]);

          const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
          div.appendChild(optionDiv);

          return [
            this.addCssWrapper(div, false, parentIsMoving),
            this.prepareRenderTree(
              subTree.followElement,
              parentIsMoving,
              noInsert,
            ),
          ];
        }
        case "BranchNode": {
          const div = document.createElement("div");
          div.id = subTree.id;

          const divHead = document.createElement("div");
          divHead.classList.add("columns");
          divHead.classList.add("element");
          divHead.classList.add("stBranch");

          const textDiv = this.createTextDiv(
            subTree.type,
            subTree.text,
            subTree.id,
          );
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id);

          const bufferDiv = document.createElement("div");
          bufferDiv.classList.add("column");
          bufferDiv.classList.add("col-1");

          divHead.appendChild(bufferDiv);
          divHead.appendChild(textDiv);
          divHead.appendChild(optionDiv);

          const divPreSubHeader = document.createElement("div");
          divPreSubHeader.classList.add("column");
          divPreSubHeader.classList.add("col-12");

          const divSubHeader = document.createElement("div");
          divSubHeader.classList.add("columns");

          const divSubHeaderTrue = document.createElement("div");
          divSubHeaderTrue.classList.add("column");
          divSubHeaderTrue.classList.add("col-6");
          divSubHeaderTrue.appendChild(document.createTextNode("Wahr"));

          const divSubHeaderFalse = document.createElement("div");
          divSubHeaderFalse.classList.add("column");
          divSubHeaderFalse.classList.add("col-6");
          divSubHeaderFalse.classList.add("text-right");
          divSubHeaderFalse.appendChild(document.createTextNode("Falsch"));

          divSubHeader.appendChild(divSubHeaderTrue);
          divSubHeader.appendChild(divSubHeaderFalse);
          divPreSubHeader.appendChild(divSubHeader);
          divHead.appendChild(divPreSubHeader);

          const divTrue = document.createElement("div");
          divTrue.classList.add("column");
          divTrue.classList.add("col-6");
          divTrue.appendChild(
            this.prepareRenderTree(subTree.trueChild, false, noInsert),
          );

          const divFalse = document.createElement("div");
          divFalse.classList.add("column");
          divFalse.classList.add("col-6");
          divFalse.appendChild(
            this.prepareRenderTree(subTree.falseChild, false, noInsert),
          );

          const divChildren = document.createElement("div");
          divChildren.classList.add("columns");
          divChildren.classList.add("middleBranch");
          divChildren.appendChild(divTrue);
          divChildren.appendChild(divFalse);

          div.appendChild(divHead);
          div.appendChild(divChildren);

          return [
            this.addCssWrapper(div, false, parentIsMoving),
            this.prepareRenderTree(
              subTree.followElement,
              parentIsMoving,
              noInsert,
            ),
          ];
        }

        case "HeadLoopNode":
        case "CountLoopNode": {
          const div = document.createElement("div");
          div.id = subTree.id;

          const divHead = document.createElement("div");
          divHead.classList.add("columns");
          divHead.classList.add("element");

          const textDiv = this.createTextDiv(
            subTree.type,
            subTree.text,
            subTree.id,
          );
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
          divHead.appendChild(textDiv);
          divHead.appendChild(optionDiv);

          const divLoopSubSub = document.createElement("div");
          divLoopSubSub.classList.add("column");
          divLoopSubSub.classList.add("col-12");
          divLoopSubSub.appendChild(
            this.prepareRenderTree(subTree.child, false, noInsert),
          );
          const divLoopSub = document.createElement("div");
          divLoopSub.classList.add("columns");
          divLoopSub.appendChild(divLoopSubSub);

          const divLoop = document.createElement("div");
          divLoop.classList.add("column");
          divLoop.classList.add("col-11");
          divLoop.classList.add("col-ml-auto");
          divLoop.classList.add("lineLeft");
          divLoop.appendChild(divLoopSub);

          const divChild = document.createElement("div");
          divChild.classList.add("columns");
          divChild.appendChild(divLoop);

          div.appendChild(divHead);
          div.appendChild(divChild);

          return [
            this.addCssWrapper(div, false, parentIsMoving),
            this.prepareRenderTree(
              subTree.followElement,
              parentIsMoving,
              noInsert,
            ),
          ];
        }

        case "FootLoopNode": {
          const div = document.createElement("div");
          div.id = subTree.id;

          const divFoot = document.createElement("div");
          divFoot.classList.add("columns");
          divFoot.classList.add("element");
          divFoot.classList.add("lineTopFootLoop");

          const textDiv = this.createTextDiv(
            subTree.type,
            subTree.text,
            subTree.id,
          );
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
          divFoot.appendChild(textDiv);
          divFoot.appendChild(optionDiv);

          const divLoop = document.createElement("div");
          divLoop.classList.add("column");
          divLoop.classList.add("col-11");
          divLoop.classList.add("col-ml-auto");
          divLoop.classList.add("lineLeft");
          divLoop.appendChild(
            this.prepareRenderTree(subTree.child, false, noInsert),
          );

          const divChild = document.createElement("div");
          divChild.classList.add("columns");
          divChild.appendChild(divLoop);

          div.appendChild(divChild);
          div.appendChild(divFoot);

          return [
            this.addCssWrapper(div, false, parentIsMoving),
            this.prepareRenderTree(
              subTree.followElement,
              parentIsMoving,
              noInsert,
            ),
          ];
        }

        case "CaseNode": {
          const div = document.createElement("div");
          div.id = subTree.id;

          const divHead = document.createElement("div");
          divHead.classList.add("columns");
          divHead.classList.add("element");
          if (subTree.defaultOn) {
            divHead.classList.add("caseHead-" + subTree.cases.length);
          } else {
            divHead.classList.add("caseHead-noDefault-" + subTree.cases.length);
          }

          const textDiv = this.createTextDiv(
            subTree.type,
            subTree.text,
            subTree.id,
          );
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id);

          const bufferDiv = document.createElement("div");
          bufferDiv.classList.add("column");
          bufferDiv.classList.add("col-1");

          divHead.appendChild(bufferDiv);
          divHead.appendChild(textDiv);
          divHead.appendChild(optionDiv);

          const divPreSubHeader = document.createElement("div");
          divPreSubHeader.classList.add("column");
          divPreSubHeader.classList.add("col-12");

          const divChildren = document.createElement("div");
          divChildren.classList.add("columns");
          if (subTree.defaultOn) {
            divChildren.classList.add("caseBody-" + subTree.cases.length);
          } else {
            const level = subTree.cases.length - 1;
            divChildren.classList.add("caseBody-" + level);
          }
          for (const caseElem of subTree.cases) {
            const divCase = document.createElement("div");
            divCase.classList.add("column");
            divCase.appendChild(
              this.prepareRenderTree(caseElem, false, noInsert),
            );
            divChildren.appendChild(divCase);
          }

          if (subTree.defaultOn) {
            const divCase = document.createElement("div");
            divCase.classList.add("column");
            divCase.appendChild(
              this.prepareRenderTree(subTree.defaultNode, false, noInsert),
            );
            divChildren.appendChild(divCase);
          }

          div.appendChild(divHead);
          div.appendChild(divChildren);

          return [
            this.addCssWrapper(div, false, parentIsMoving),
            this.prepareRenderTree(
              subTree.followElement,
              parentIsMoving,
              noInsert,
            ),
          ];
        }

        case "InsertCase": {
          const div = document.createElement("div");
          div.id = subTree.id;
          div.classList.add("columns");
          div.classList.add("element");

          const bufferDiv = document.createElement("div");
          bufferDiv.classList.add("column");
          bufferDiv.classList.add("col-1");
          const textDiv = this.createTextDiv(
            subTree.type,
            subTree.text,
            subTree.id,
          );
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
          div.appendChild(bufferDiv);
          div.appendChild(textDiv);
          div.appendChild(optionDiv);
          return [
            div,
            this.prepareRenderTree(
              subTree.followElement,
              parentIsMoving,
              noInsert,
            ),
          ];
        }

        default:
          return this.renderTree(
            subTree.followElement,
            parentIsMoving,
            noInsert,
          );
      }
    }
  }

  /**
   * Create inline SVG for branch split (triangular top)
   */
  createBranchSplitSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    // Left diagonal line (from top-left to bottom-center)
    const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line1.setAttribute("x1", "0%");
    line1.setAttribute("y1", "0%");
    line1.setAttribute("x2", "50%");
    line1.setAttribute("y2", "100%");
    line1.setAttribute("stroke", "black");
    line1.setAttribute("stroke-width", "1.5");
    svg.appendChild(line1);
    
    // Right diagonal line (from top-right to bottom-center)
    const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line2.setAttribute("x1", "100%");
    line2.setAttribute("y1", "0%");
    line2.setAttribute("x2", "50%");
    line2.setAttribute("y2", "100%");
    line2.setAttribute("stroke", "black");
    line2.setAttribute("stroke-width", "1.5");
    svg.appendChild(line2);
    
    return svg;
  }

  /**
   * Create inline SVG for branch center separator line
   */
  createBranchCenterSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    // Vertical center line
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "50%");
    line.setAttribute("y1", "0%");
    line.setAttribute("x2", "50%");
    line.setAttribute("y2", "100%");
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "1.5");
    svg.appendChild(line);
    
    return svg;
  }

  /**
   * Create inline SVG for case head with triangular divisions
   */
  createCaseHeadSVG(numCases, hasDefault) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    const totalCases = hasDefault ? numCases + 1 : numCases;
    
    if (hasDefault) {
      // With default case: triangular pattern converging to the last section
      const convergePoint = (numCases / totalCases) * 100; // Percentage where lines converge
      
      // Left line from top-left to converge point
      const leftLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      leftLine.setAttribute("x1", "0%");
      leftLine.setAttribute("y1", "0%");
      leftLine.setAttribute("x2", `${convergePoint}%`);
      leftLine.setAttribute("y2", "100%");
      leftLine.setAttribute("stroke", "black");
      leftLine.setAttribute("stroke-width", "1.5");
      svg.appendChild(leftLine);
      
      // Right line from top-right to converge point
      const rightLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      rightLine.setAttribute("x1", "100%");
      rightLine.setAttribute("y1", "0%");
      rightLine.setAttribute("x2", `${convergePoint}%`);
      rightLine.setAttribute("y2", "100%");
      rightLine.setAttribute("stroke", "black");
      rightLine.setAttribute("stroke-width", "1.5");
      svg.appendChild(rightLine);
      
      // Vertical lines for each case division
      for (let i = 1; i < numCases; i++) {
        const xPercent = (i / totalCases) * 100;
        const yStart = (i / numCases) * 100; // Start from diagonal intersection
        
        const vertLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        vertLine.setAttribute("x1", `${xPercent}%`);
        vertLine.setAttribute("y1", `${yStart}%`);
        vertLine.setAttribute("x2", `${xPercent}%`);
        vertLine.setAttribute("y2", "100%");
        vertLine.setAttribute("stroke", "black");
        vertLine.setAttribute("stroke-width", "1.5");
        svg.appendChild(vertLine);
      }
    } else {
      // Without default: single diagonal line with vertical divisions
      const diagonal = document.createElementNS("http://www.w3.org/2000/svg", "line");
      diagonal.setAttribute("x1", "0%");
      diagonal.setAttribute("y1", "0%");
      diagonal.setAttribute("x2", "100%");
      diagonal.setAttribute("y2", "100%");
      diagonal.setAttribute("stroke", "black");
      diagonal.setAttribute("stroke-width", "1.5");
      svg.appendChild(diagonal);
      
      // Vertical lines for each case
      for (let i = 1; i < numCases; i++) {
        const xPercent = (i / numCases) * 100;
        const yStart = xPercent; // Start from diagonal intersection
        
        const vertLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        vertLine.setAttribute("x1", `${xPercent}%`);
        vertLine.setAttribute("y1", `${yStart}%`);
        vertLine.setAttribute("x2", `${xPercent}%`);
        vertLine.setAttribute("y2", "100%");
        vertLine.setAttribute("stroke", "black");
        vertLine.setAttribute("stroke-width", "1.5");
        svg.appendChild(vertLine);
      }
    }
    
    return svg;
  }

  /**
   * Create inline SVG for case body with vertical separators
   */
  createCaseBodySVG(numCases, hasDefault) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    const totalCases = hasDefault ? numCases + 1 : numCases;
    const effectiveCases = hasDefault ? numCases : numCases - 1;
    
    // Create vertical separator lines
    for (let i = 1; i <= effectiveCases; i++) {
      const xPercent = (i / totalCases) * 100;
      
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", `${xPercent}%`);
      line.setAttribute("y1", "0%");
      line.setAttribute("x2", `${xPercent}%`);
      line.setAttribute("y2", "100%");
      line.setAttribute("stroke", "black");
      line.setAttribute("stroke-width", "1.5");
      svg.appendChild(line);
    }
    
    return svg;
  }

  displaySourcecode(buttonId) {}
  setLang() {}
}
