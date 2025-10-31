import { config } from "../config.js";
import { generateResetButton } from "../helpers/generator";
import { newElement } from "../helpers/domBuilding";
import {
  createSVGElement,
  createSVGContainer,
  createRect,
  createLine,
  createPolyline,
  createText,
  createGroup,
  createForeignObject,
  wrapText
} from "../helpers/svgRenderer.js";

/**
 * SVG-based Structogram Renderer
 * Renders the structogram using SVG elements instead of HTML divs with CSS backgrounds
 */
export class StructogramSVG {
  constructor(presenter, domRoot) {
    this.presenter = presenter;
    this.domRoot = domRoot;
    this.fontSize = 16; // Base font size in pixels
    this.baseHeight = 32; // Base height for a single row in pixels
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
    // Create the same UI structure as the original, but the structogram area will use SVG
    const divInsert = document.createElement("div");
    divInsert.classList.add("columnEditorFull");
    const divHeader = document.createElement("div");
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
    
    // Font size controls
    const fontSizeControls = document.createElement("span");
    fontSizeControls.style.marginLeft = "1em";
    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    minusBtn.classList.add("fontSizeBtn", "hand");
    minusBtn.style.marginRight = "0.3em";
    minusBtn.title = "Decrease font size";
    minusBtn.addEventListener("click", () => this.decreaseFontSize());
    fontSizeControls.appendChild(minusBtn);
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
    divWorkingArea.style.overflow = "auto";

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

  /**
   * Main render method - creates an SVG representation of the tree
   */
  render(tree) {
    // Clear existing content
    while (this.domRoot.hasChildNodes()) {
      this.domRoot.removeChild(this.domRoot.lastChild);
    }

    // Create main SVG container
    const svg = createSVGContainer('100%', '100%', 'structogram-svg');
    svg.style.minHeight = '200px';
    svg.style.backgroundColor = 'white';
    
    // Create a wrapper div to help with sizing
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.minHeight = '200px';
    wrapper.appendChild(svg);
    
    // Render the tree structure
    const result = this.renderElementSVG(tree, 0, 0, 600, false, false, this.presenter.getSettingFunctionMode());
    
    if (result.group) {
      svg.appendChild(result.group);
    }
    
    // Set SVG height based on content
    svg.setAttribute('height', result.height + 4);
    svg.setAttribute('viewBox', `0 0 ${result.width} ${result.height + 4}`);
    
    this.domRoot.appendChild(wrapper);
  }

  /**
   * Render an element as SVG
   * Returns { group, width, height }
   */
  renderElementSVG(subTree, x, y, width, parentIsMoving, noInsert, renderInsertNode = false) {
    if (!subTree) {
      return { group: null, width: 0, height: 0 };
    }

    // Check if this is the element being moved
    if (!(this.presenter.getMoveId() === null) && subTree.id === this.presenter.getMoveId()) {
      parentIsMoving = true;
      noInsert = true;
    }

    const group = createGroup({ class: `node-${subTree.type}` });
    let currentY = y;
    let totalHeight = 0;

    switch (subTree.type) {
      case "InsertNode":
        if (parentIsMoving) {
          return this.renderElementSVG(subTree.followElement, x, y, width, false, false);
        } else if (noInsert) {
          return this.renderElementSVG(subTree.followElement, x, y, width, false, true);
        } else if (this.presenter.getInsertMode()) {
          if (!this.presenter.getSettingFunctionMode() || renderInsertNode) {
            // Render insert placeholder
            const insertGroup = this.createInsertNodeSVG(x, y, width, subTree.id, subTree);
            group.appendChild(insertGroup.group);
            currentY += insertGroup.height;
            totalHeight += insertGroup.height;
            
            if (subTree.followElement && subTree.followElement.type !== "Placeholder") {
              const follow = this.renderElementSVG(subTree.followElement, x, currentY, width, false, noInsert);
              if (follow.group) {
                group.appendChild(follow.group);
              }
              totalHeight += follow.height;
            }
            
            return { group, width, height: totalHeight };
          } else {
            return this.renderElementSVG(subTree.followElement, x, y, width, false, noInsert);
          }
        } else {
          return this.renderElementSVG(subTree.followElement, x, y, width, parentIsMoving, noInsert);
        }

      case "Placeholder":
        const placeholderHeight = this.baseHeight;
        const placeholderGroup = createGroup();
        const placeholderRect = createRect(x, y, width, placeholderHeight, {
          fill: config.get().Placeholder?.color || '#f0f0f0',
          stroke: 'black',
          'stroke-width': '1.5'
        });
        placeholderGroup.appendChild(placeholderRect);
        group.appendChild(placeholderGroup);
        return { group, width, height: placeholderHeight };

      case "InputNode":
      case "OutputNode":
      case "TaskNode":
        return this.createSimpleNodeSVG(subTree, x, y, width, parentIsMoving, noInsert);

      case "BranchNode":
        return this.createBranchNodeSVG(subTree, x, y, width, parentIsMoving, noInsert);

      case "HeadLoopNode":
      case "CountLoopNode":
        return this.createLoopNodeSVG(subTree, x, y, width, parentIsMoving, noInsert, 'head');

      case "FootLoopNode":
        return this.createLoopNodeSVG(subTree, x, y, width, parentIsMoving, noInsert, 'foot');

      case "CaseNode":
        return this.createCaseNodeSVG(subTree, x, y, width, parentIsMoving, noInsert);

      case "TryCatchNode":
        return this.createTryCatchNodeSVG(subTree, x, y, width, parentIsMoving, noInsert);

      case "FunctionNode":
        return this.createFunctionNodeSVG(subTree, x, y, width, parentIsMoving, noInsert);

      case "InsertCase":
        return this.createInsertCaseSVG(subTree, x, y, width, parentIsMoving, noInsert);

      default:
        return this.renderElementSVG(subTree.followElement, x, y, width, parentIsMoving, noInsert);
    }
  }

  /**
   * Create a simple node (Input, Output, Task)
   */
  createSimpleNodeSVG(subTree, x, y, width, parentIsMoving, noInsert) {
    const group = createGroup({ id: subTree.id });
    const nodeHeight = this.baseHeight;
    let currentY = y;

    // Background rectangle
    const rect = createRect(x, y, width, nodeHeight, {
      fill: config.get()[subTree.type].color,
      stroke: 'black',
      'stroke-width': '1.5'
    });
    group.appendChild(rect);

    // Text
    let displayText = subTree.text;
    if (subTree.type === "InputNode") {
      displayText = "E: " + displayText;
    } else if (subTree.type === "OutputNode") {
      displayText = "A: " + displayText;
    }

    const textElement = this.createInteractiveText(
      x + width / 2,
      y + nodeHeight / 2,
      displayText,
      subTree.id,
      subTree.type
    );
    group.appendChild(textElement);

    // Add options overlay
    const optionsGroup = this.createOptionsOverlay(x, y, width, nodeHeight, subTree.type, subTree.id);
    group.appendChild(optionsGroup);

    currentY += nodeHeight;

    // Render following element
    if (subTree.followElement) {
      const follow = this.renderElementSVG(subTree.followElement, x, currentY, width, parentIsMoving, noInsert);
      if (follow.group) {
        group.appendChild(follow.group);
      }
      return { group, width, height: nodeHeight + follow.height };
    }

    return { group, width, height: nodeHeight };
  }

  /**
   * Create a branch node with triangular split
   */
  createBranchNodeSVG(subTree, x, y, width, parentIsMoving, noInsert) {
    const group = createGroup({ id: subTree.id });
    const headHeight = this.baseHeight * 2; // Double height for condition text and labels
    const conditionHeight = this.baseHeight;
    let currentY = y;

    // Draw the top rectangle for the condition
    const condRect = createRect(x, y, width, conditionHeight, {
      fill: config.get()[subTree.type].color,
      stroke: 'black',
      'stroke-width': '1.5'
    });
    group.appendChild(condRect);

    // Add condition text
    const condText = this.createInteractiveText(
      x + width / 2,
      y + conditionHeight / 2,
      subTree.text,
      subTree.id,
      subTree.type
    );
    group.appendChild(condText);

    // Add options overlay for condition
    const optionsGroup = this.createOptionsOverlay(x, y, width, conditionHeight, subTree.type, subTree.id);
    group.appendChild(optionsGroup);

    currentY += conditionHeight;

    // Draw the triangular split
    const triangleHeight = this.baseHeight;
    const midX = x + width / 2;
    
    // Left diagonal line (top-left to bottom-center)
    const leftLine = createLine(x, currentY, midX, currentY + triangleHeight);
    group.appendChild(leftLine);
    
    // Right diagonal line (top-right to bottom-center)
    const rightLine = createLine(x + width, currentY, midX, currentY + triangleHeight);
    group.appendChild(rightLine);

    // Add "Wahr" and "Falsch" labels in the triangles
    const labelY = currentY + triangleHeight * 0.4;
    const trueLabel = createText(x + width * 0.25, labelY, "Wahr", {
      'font-size': this.fontSize * 0.8,
      'text-anchor': 'middle'
    });
    group.appendChild(trueLabel);

    const falseLabel = createText(x + width * 0.75, labelY, "Falsch", {
      'font-size': this.fontSize * 0.8,
      'text-anchor': 'middle'
    });
    group.appendChild(falseLabel);

    currentY += triangleHeight;

    // Render true and false branches side by side
    const halfWidth = width / 2;
    
    // True branch (left)
    const trueResult = this.renderElementSVG(subTree.trueChild, x, currentY, halfWidth, false, noInsert);
    if (trueResult.group) {
      group.appendChild(trueResult.group);
    }

    // False branch (right)
    const falseResult = this.renderElementSVG(subTree.falseChild, x + halfWidth, currentY, halfWidth, false, noInsert);
    if (falseResult.group) {
      group.appendChild(falseResult.group);
    }

    // Vertical line separating the branches
    const maxBranchHeight = Math.max(trueResult.height, falseResult.height);
    const separatorLine = createLine(midX, currentY, midX, currentY + maxBranchHeight);
    group.appendChild(separatorLine);

    currentY += maxBranchHeight;

    // Render following element
    if (subTree.followElement) {
      const follow = this.renderElementSVG(subTree.followElement, x, currentY, width, parentIsMoving, noInsert);
      if (follow.group) {
        group.appendChild(follow.group);
      }
      return { group, width, height: headHeight + maxBranchHeight + follow.height };
    }

    return { group, width, height: headHeight + maxBranchHeight };
  }

  /**
   * Create a loop node (head or foot loop)
   */
  createLoopNodeSVG(subTree, x, y, width, parentIsMoving, noInsert, type) {
    const group = createGroup({ id: subTree.id });
    const headerHeight = this.baseHeight;
    const indent = 32; // Indentation for loop body
    let currentY = y;

    if (type === 'head') {
      // Header at top
      const headerRect = createRect(x, y, width, headerHeight, {
        fill: config.get()[subTree.type].color,
        stroke: 'black',
        'stroke-width': '1.5'
      });
      group.appendChild(headerRect);

      const headerText = this.createInteractiveText(
        x + width / 2,
        y + headerHeight / 2,
        subTree.text,
        subTree.id,
        subTree.type
      );
      group.appendChild(headerText);

      const optionsGroup = this.createOptionsOverlay(x, y, width, headerHeight, subTree.type, subTree.id);
      group.appendChild(optionsGroup);

      currentY += headerHeight;

      // Loop body with left border
      const bodyResult = this.renderElementSVG(subTree.child, x + indent, currentY, width - indent, false, noInsert);
      if (bodyResult.group) {
        group.appendChild(bodyResult.group);
      }

      // Left border line for loop body
      const leftBorder = createLine(x + indent, currentY, x + indent, currentY + bodyResult.height);
      group.appendChild(leftBorder);

      currentY += bodyResult.height;

      // Render following element
      if (subTree.followElement) {
        const follow = this.renderElementSVG(subTree.followElement, x, currentY, width, parentIsMoving, noInsert);
        if (follow.group) {
          group.appendChild(follow.group);
        }
        return { group, width, height: headerHeight + bodyResult.height + follow.height };
      }

      return { group, width, height: headerHeight + bodyResult.height };
    } else {
      // Foot loop: body first, then condition
      const bodyResult = this.renderElementSVG(subTree.child, x + indent, y, width - indent, false, noInsert);
      if (bodyResult.group) {
        group.appendChild(bodyResult.group);
      }

      // Left and bottom border for loop body
      const leftBorder = createLine(x + indent, y, x + indent, y + bodyResult.height);
      group.appendChild(leftBorder);
      
      const bottomBorder = createLine(x + indent, y + bodyResult.height, x + width, y + bodyResult.height);
      group.appendChild(bottomBorder);

      currentY += bodyResult.height;

      // Footer at bottom
      const footerRect = createRect(x, currentY, width, headerHeight, {
        fill: config.get()[subTree.type].color,
        stroke: 'black',
        'stroke-width': '1.5'
      });
      group.appendChild(footerRect);

      const footerText = this.createInteractiveText(
        x + width / 2,
        currentY + headerHeight / 2,
        subTree.text,
        subTree.id,
        subTree.type
      );
      group.appendChild(footerText);

      const optionsGroup = this.createOptionsOverlay(x, currentY, width, headerHeight, subTree.type, subTree.id);
      group.appendChild(optionsGroup);

      currentY += headerHeight;

      // Render following element
      if (subTree.followElement) {
        const follow = this.renderElementSVG(subTree.followElement, x, currentY, width, parentIsMoving, noInsert);
        if (follow.group) {
          group.appendChild(follow.group);
        }
        return { group, width, height: bodyResult.height + headerHeight + follow.height };
      }

      return { group, width, height: bodyResult.height + headerHeight };
    }
  }

  /**
   * Create interactive text element
   */
  createInteractiveText(x, y, text, uid, type) {
    const group = createGroup({ class: 'interactive-text' });
    
    // Use foreignObject to embed HTML for better text handling
    const fo = createForeignObject(x - 200, y - 12, 400, 24, '');
    const div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.cursor = 'pointer';
    div.style.fontSize = this.fontSize + 'px';
    div.textContent = text;
    
    // Make it editable on click
    if (!this.presenter.getInsertMode()) {
      div.addEventListener('click', () => {
        this.presenter.renderAllViews();
        this.presenter.switchEditState(uid);
      });
    }
    
    fo.appendChild(div);
    group.appendChild(fo);
    
    return group;
  }

  /**
   * Create options overlay (delete, move icons)
   */
  createOptionsOverlay(x, y, width, height, type, uid) {
    const group = createGroup({ class: 'options-overlay' });
    
    // Use foreignObject for option icons
    const fo = createForeignObject(x + width - 80, y, 80, height, '');
    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('optionContainer');
    optionsDiv.style.position = 'relative';
    optionsDiv.style.width = '100%';
    optionsDiv.style.height = '100%';
    optionsDiv.style.display = 'none'; // Hidden by default, shown on hover
    
    // Delete button
    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('trashcan', 'optionIcon', 'hand');
    deleteBtn.title = 'Entfernen';
    deleteBtn.addEventListener('click', () => this.presenter.removeElement(uid));
    optionsDiv.appendChild(deleteBtn);
    
    // Move button (if applicable)
    if (type !== "InsertCase" && type !== "FunctionNode") {
      const moveBtn = document.createElement('div');
      moveBtn.classList.add('moveIcon', 'optionIcon', 'hand');
      moveBtn.title = 'Verschieben';
      moveBtn.addEventListener('click', () => this.presenter.moveElement(uid));
      optionsDiv.appendChild(moveBtn);
    }
    
    fo.appendChild(optionsDiv);
    group.appendChild(fo);
    
    return group;
  }

  // Placeholder implementations for other node types
  createCaseNodeSVG(subTree, x, y, width, parentIsMoving, noInsert) {
    // TODO: Implement case node with triangular divisions
    return this.createSimpleNodeSVG(subTree, x, y, width, parentIsMoving, noInsert);
  }

  createTryCatchNodeSVG(subTree, x, y, width, parentIsMoving, noInsert) {
    // TODO: Implement try-catch node
    return this.createSimpleNodeSVG(subTree, x, y, width, parentIsMoving, noInsert);
  }

  createFunctionNodeSVG(subTree, x, y, width, parentIsMoving, noInsert) {
    // TODO: Implement function node
    return this.createSimpleNodeSVG(subTree, x, y, width, parentIsMoving, noInsert);
  }

  createInsertCaseSVG(subTree, x, y, width, parentIsMoving, noInsert) {
    // TODO: Implement insert case
    return this.createSimpleNodeSVG(subTree, x, y, width, parentIsMoving, noInsert);
  }

  createInsertNodeSVG(x, y, width, id, subTree) {
    const group = createGroup({ id });
    const insertHeight = this.baseHeight * 0.7;
    
    const rect = createRect(x, y, width, insertHeight, {
      fill: '#f0f0f0',
      stroke: 'black',
      'stroke-width': '1',
      'stroke-dasharray': '5,5'
    });
    group.appendChild(rect);
    
    // Add click handler for inserting elements
    const clickRect = createRect(x, y, width, insertHeight, {
      fill: 'transparent',
      cursor: 'pointer'
    });
    
    clickRect.addEventListener('click', () => {
      this.presenter.appendElement(id);
    });
    
    clickRect.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
    
    clickRect.addEventListener('drop', (event) => {
      event.preventDefault();
      this.presenter.appendElement(id);
    });
    
    group.appendChild(clickRect);
    
    return { group, width, height: insertHeight };
  }

  /**
   * Font size controls
   */
  increaseFontSize() {
    this.fontSize += 1.6;
    const elem = document.getElementsByClassName("columnEditorStructogram")[0];
    if (elem) {
      elem.style.fontSize = (this.fontSize / 16) + "em";
    }
    this.presenter.renderAllViews();
  }

  decreaseFontSize() {
    if (this.fontSize <= 8) return;
    this.fontSize -= 1.6;
    const elem = document.getElementsByClassName("columnEditorStructogram")[0];
    if (elem) {
      elem.style.fontSize = (this.fontSize / 16) + "em";
    }
    this.presenter.renderAllViews();
  }

  /**
   * Reset buttons after insert or false drop
   */
  resetButtons() {
    for (const button of this.buttonList) {
      if (config.get()[button].use) {
        const btn = document.getElementById(config.get()[button].id);
        if (btn) {
          btn.classList.remove("boldText");
        }
      }
    }
  }

  // Stub methods for compatibility
  displaySourcecode() {}
  setLang() {}
}
