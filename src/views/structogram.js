import { config } from '../config.js'
import { generateResetButton } from '../helpers/generator'
import { newElement } from '../helpers/domBuilding'

export class Structogram {
  constructor (presenter, domRoot) {
    this.presenter = presenter
    this.domRoot = domRoot
    this.size = 7
    this.buttonList = [
      'InputNode',
      'OutputNode',
      'TaskNode',
      'CountLoopNode',
      'HeadLoopNode',
      'FootLoopNode',
      'BranchNode',
      'CaseNode',
      'TryCatchNode',
      'FunctionNode'
    ]

    this.preRender()
  }

  preRender () {
    const divInsert = document.createElement('div')
    divInsert.classList.add('columnEditorFull')
    const divHeader = document.createElement('div')
    // divHeader.classList.add('elementButtonColumns');
    const spanHeader = document.createElement('strong')
    spanHeader.classList.add('margin-small')
    spanHeader.appendChild(document.createTextNode('Element wählen:'))
    divHeader.appendChild(spanHeader)
    divInsert.appendChild(divHeader)

    const divButtons = document.createElement('div')
    divButtons.classList.add('container', 'justify-center')
    for (const item of this.buttonList) {
      if (config.get()[item].use) {
        divButtons.appendChild(this.createButton(item))
      }
    }
    divInsert.appendChild(divButtons)

    const divEditorHeadline = document.createElement('div')
    divEditorHeadline.classList.add('columnEditorFull', 'headerContainer')
    const editorHeadline = document.createElement('strong')
    editorHeadline.classList.add('margin-small', 'floatBottom')
    editorHeadline.appendChild(document.createTextNode('Editor:'))
    divEditorHeadline.appendChild(editorHeadline)

    const optionsContainer1 = document.createElement('div')
    optionsContainer1.id = 'struktoOptions1'
    optionsContainer1.classList.add('struktoOptions1')
    divEditorHeadline.appendChild(optionsContainer1)

    this.createStrukOptions(optionsContainer1)

    const divEditorContent = document.createElement('div')
    divEditorContent.classList.add('vcontainer', 'columnEditorStructogram')

    const divEditorContentSplitTop = document.createElement('div')
    divEditorContentSplitTop.classList.add('columnAuto', 'container')

    const divEditorContentSplitBottom = document.createElement('div')
    divEditorContentSplitBottom.classList.add('columnAuto-6')

    const divFixRightBorder = document.createElement('div')
    divFixRightBorder.classList.add('borderWidth', 'frameLeft')

    const divWorkingArea = document.createElement('div')
    divWorkingArea.classList.add('columnAuto')
    divWorkingArea.id = 'structogram'

    divEditorContent.appendChild(divEditorContentSplitTop)
    divEditorContentSplitTop.appendChild(divWorkingArea)
    divEditorContentSplitTop.appendChild(divFixRightBorder)
    divEditorContent.appendChild(divEditorContentSplitBottom)

    this.domRoot.appendChild(divInsert)
    this.domRoot.appendChild(divEditorHeadline)
    this.domRoot.appendChild(divEditorContent)

    const codeAndOptions = document.createElement('div')
    codeAndOptions.classList.add('columnEditorCode', 'container')
    this.domRoot.appendChild(codeAndOptions)

    const optionsContainer2 = document.createElement('div')
    optionsContainer2.id = 'struktoOptions2'
    optionsContainer2.classList.add('columnFull', 'container', 'struktoOptions2')
    codeAndOptions.appendChild(optionsContainer2)

    this.createStrukOptions(optionsContainer2)

    const sourcecode = document.createElement('div')
    sourcecode.id = 'SourcecodeDisplay'
    sourcecode.classList.add('fullWidth', 'fullHeight', 'vcontainer')
    sourcecode.style.display = 'none'
    codeAndOptions.appendChild(sourcecode)

    this.domRoot = document.getElementById('structogram')
  }

  createStrukOptions (domNode) {
    this.generateUndoRedoButtons(this.presenter, domNode)
    generateResetButton(this.presenter, domNode)
  }

  generateUndoRedoButtons (presenter, domNode) {
    const undo = document.createElement('div')
    undo.classList.add('struktoOption', 'undoIcon', 'tooltip', 'tooltip-bottom', 'hand')
    undo.setAttribute('data-tooltip', 'Undo')
    domNode.appendChild(undo)
    const undoOverlay = document.createElement('div')
    undoOverlay.classList.add('fullWidth', 'fullHeight', 'UndoIconButtonOverlay', 'disableIcon')
    undoOverlay.addEventListener('click', () => presenter.undo())
    undo.appendChild(undoOverlay)

    const redo = document.createElement('div')
    redo.classList.add('struktoOption', 'redoIcon', 'tooltip', 'tooltip-bottom', 'hand')
    redo.setAttribute('data-tooltip', 'Redo')
    domNode.appendChild(redo)
    const redoOverlay = document.createElement('div')
    redoOverlay.classList.add('fullWidth', 'fullHeight', 'RedoIconButtonOverlay', 'disableIcon')
    redoOverlay.addEventListener('click', () => presenter.redo())
    redo.appendChild(redoOverlay)
  }

  createButton (button) {
    const div = document.createElement('div')
    div.classList.add('columnInput', 'insertButton', 'hand')
    div.style.backgroundColor = config.get()[button].color
    div.id = config.get()[button].id
    div.draggable = 'true'
    div.addEventListener('click', (event) => this.presenter.insertNode(config.get()[button].id, event))
    div.addEventListener('dragstart', (event) => this.presenter.insertNode(config.get()[button].id, event))
    div.addEventListener('dragend', () => this.presenter.resetDrop())
    const spanText = document.createElement('span')
    spanText.appendChild(document.createTextNode(config.get()[button].text))
    const divIcon = document.createElement('div')
    divIcon.classList.add(config.get()[button].icon, 'buttonLogo')

    div.append(divIcon)
    div.append(spanText)
    return div
  }

  render (tree) {
    // remove content
    while (this.domRoot.hasChildNodes()) {
      this.domRoot.removeChild(this.domRoot.lastChild)
    }
    // this.domRoot.appendChild(this.prepareRenderTree(tree, false, false));
    for (const elem of this.renderElement(tree, false, false, this.presenter.getSettingFunctionMode())) {
      this.applyCodeEventListeners(elem)
      this.domRoot.appendChild(elem)
    }
    const lastLine = document.createElement('div')
    lastLine.classList.add('frameTop', 'borderHeight')
    this.domRoot.appendChild(lastLine)
  }

  /**
   * @param    divContainer         div containing the function parameters
   * @param    pos                  position in the function header-div
   * @param    fieldSize            size of the input field (only int values)
   * @param    uid                  id of the function node inside the model
   * @param    content              text of the param element
   * @returns  HTMLElement (Input Field)
   */
  createFunctionHeaderTextEl (divContainer, pos, fieldSize, placeHolder, uid, content = null) {
    // add text from input field as span-element to the header-div
    const textNodeSpan = document.createElement('span')
    textNodeSpan.classList.add('func-header-text-div')

    if (content === null || content === '') {
      textNodeSpan.appendChild(document.createTextNode(placeHolder))
    } else {
      textNodeSpan.appendChild(document.createTextNode(content))
    }

    const textNodeDiv = document.createElement('div')
    textNodeDiv.classList.add('function-elem')
    textNodeDiv.style.display = 'flex'
    textNodeDiv.style.flexDirection = 'row'
    textNodeDiv.appendChild(textNodeSpan)

    // delete option for parameters
    if (!divContainer.classList.contains('func-box-header')) {
      const removeParamBtn = document.createElement('button')
      removeParamBtn.classList.add('trashcan', 'optionIcon', 'hand', 'tooltip', 'tooltip-bottoml')
      removeParamBtn.style.minWidth = '1.2em'
      removeParamBtn.style.border = 'none'
      removeParamBtn.setAttribute('data-tooltip', 'Entfernen')
      removeParamBtn.addEventListener('click', () => {
        this.presenter.removeParamFromParameters(pos)
      })

      textNodeSpan.addEventListener('mouseover', () => {
        textNodeSpan.parentElement.appendChild(removeParamBtn)
      })

      textNodeSpan.parentElement.addEventListener('mouseleave', () => {
        removeParamBtn.remove()
      })
    }

    // text can be clicked and afterwards can be changed
    textNodeSpan.addEventListener('click', () => {
      textNodeDiv.remove()

      // div containing input field and field option
      const inputDiv = document.createElement('div')
      inputDiv.style.display = 'flex'
      inputDiv.style.flexDirection = 'row'

      // create Input Field
      const inputElement = newElement('input', ['function-elem', 'func-header-input'], inputDiv)
      inputElement.contentEditable = true
      inputElement.style.border = 'solid 1px black'
      inputElement.style.margin = '0 0 0 0'
      inputElement.style.width = fieldSize + 'ch'
      inputElement.size = fieldSize
      inputElement.type = 'text'
      inputElement.placeholder = placeHolder
      inputElement.value = content

      // function for creating the text node (function name or parameter name)
      const createTextNode = () => {
        const textNodeDiv = document.createElement('div')
        textNodeDiv.classList.add('function-elem')

        // add text from input field as span-element to the header-div
        const textNodeSpan = newElement('span', ['func-header-text-div'], textNodeDiv)
        textNodeSpan.appendChild(document.createTextNode(inputElement.value))

        // text can be clicked and afterwards can be changed
        textNodeSpan.addEventListener('click', () => {
          textNodeDiv.remove()
          divContainer.insertBefore(inputDiv, divContainer.childNodes[pos])
        })

        inputElement.remove()
        divContainer.insertBefore(textNodeDiv, divContainer.childNodes[pos])
      }

      // button to save function or parameter name
      const inputAccept = newElement('div', ['acceptIcon', 'hand'], inputDiv)
      inputAccept.style.minWidth = '1.4em'
      inputAccept.style.marginLeft = '0.2em'
      inputAccept.addEventListener('click', () => {
        // update function name and function parameters in the model tree
        if (divContainer.classList.contains('func-box-header')) {
          this.presenter.editElement(uid, inputElement.value, 'funcname|')
        } else {
          this.presenter.editElement(uid, inputElement.value, String(pos) + '|')
        }

        // change function name also in the model (tree)
        this.presenter.renderAllViews()
        createTextNode()
      })

      const inputClose = newElement('div', ['deleteIcon', 'hand'], inputDiv)
      inputClose.style.minWidth = '1.4em'
      inputClose.style.marginLeft = '0.2em'
      inputClose.addEventListener('click', () => this.presenter.renderAllViews())
      divContainer.insertBefore(inputDiv, divContainer.childNodes[pos])

      const listenerFunction = (event) => {
        if (event.code === 'Enter' || event.type === 'blur') {
          // remove the blur event listener in case of pressing-enter-event to avoid DOM exceptions
          if (event.code === 'Enter') {
            inputElement.removeEventListener('blur', listenerFunction)
          }

          // update function name and function parameters in the model tree
          if (divContainer.classList.contains('func-box-header')) {
            this.presenter.editElement(uid, inputElement.value, 'funcname|')
          } else {
            this.presenter.editElement(uid, inputElement.value, String(pos) + '|')
          }

          // change function name also in the model (tree)
          this.presenter.renderAllViews()
          createTextNode()
        }
      }

      // observed events (to change input field size)
      const events = 'keyup,keypress,focus,blur,change,input'.split(',')

      for (const e of events) {
        inputElement.addEventListener(e, listenerFunction)
      }
    })

    return textNodeDiv
  }

  /**
   * Create some spacing
   */
  createSpacing (spacingSize) {
    // spacing between elements
    const spacing = document.createElement('div')
    spacing.style.marginRight = spacingSize + 'ch'

    return spacing
  }

  /**
   * @param   countParam              count of variables inside the paramter div
   * @param   fpSize                  size for the input field
   * @param   paramDiv                div containing the function parameters
   * @param   spacingSize             spacing div between two DOM-elements
   * @param   uid                     id of the function node inside the model
   * create and append a interactable variable to the parameters div
   */
  renderParam (countParam, paramDiv, spacingSize, fpSize, uid, content = null) {
    const paramPos = 3 * countParam
    // if there is already a function parameter, add some ", " before the next parameter
    if (countParam !== 0) {
      paramDiv.appendChild(document.createTextNode(','))
      paramDiv.appendChild(this.createSpacing(spacingSize))
    }
    countParam += 1
    paramDiv.appendChild(this.createFunctionHeaderTextEl(paramDiv, paramPos, fpSize, 'par ' + countParam, uid, content))
  }

  /**
   * @param    uid                id of the function node inside the model (tree)
   * @param    content            function name given from the model
   * @param    funcParams         variable names of the function paramers
   * Return a function header with function name and parameters for editing
   */
  renderFunctionBox (uid, content, funcParams) {
    // field attributes... ff: function name... fp: parameter name
    // size is field length
    const ffSize = 15
    const fpSize = 5
    const spacingSize = 1

    // box header containing all elements describing the function header
    const functionBoxHeaderDiv = document.createElement('div')
    functionBoxHeaderDiv.classList.add('input-group', 'fixedHeight', 'func-box-header', 'padding')
    functionBoxHeaderDiv.style.display = 'flex'
    functionBoxHeaderDiv.style.flexDirection = 'row'
    functionBoxHeaderDiv.style.paddingTop = '6.5px'

    // header containing all param elements
    const paramDiv = document.createElement('div')
    paramDiv.classList.add('input-group')
    paramDiv.style.display = 'flex'
    paramDiv.style.flexDirection = 'row'
    paramDiv.style.flex = '0 0 ' + spacingSize + 'ch'

    let countParam = 0
    for (const param of funcParams) {
      this.renderParam(countParam, paramDiv, spacingSize, fpSize, uid, param.parName)
      countParam += 1
    }

    // append a button for adding new parameters at the end of the param div
    const addParamBtn = document.createElement('button')
    addParamBtn.classList.add('addCaseIcon', 'hand', 'caseOptionsIcons', 'tooltip', 'tooltip-bottom')
    addParamBtn.style.marginTop = 'auto'
    addParamBtn.style.marginBottom = 'auto'
    addParamBtn.setAttribute('data-tooltip', 'Parameter hinzufügen')
    addParamBtn.addEventListener('click', () => {
      addParamBtn.remove()
      const countParam = document.getElementsByClassName('function-elem').length - 1
      this.renderParam(countParam, paramDiv, spacingSize, fpSize, uid)
    })

    // show adding-parameters-button when hovering
    functionBoxHeaderDiv.addEventListener('mouseover', () => {
      paramDiv.appendChild(addParamBtn)
    })

    functionBoxHeaderDiv.addEventListener('mouseleave', () => {
      addParamBtn.remove()
    })

    // add all box header elements
    functionBoxHeaderDiv.appendChild(document.createTextNode('function'))
    functionBoxHeaderDiv.appendChild(this.createSpacing(2 * spacingSize))
    functionBoxHeaderDiv.appendChild(this.createFunctionHeaderTextEl(functionBoxHeaderDiv, 2, ffSize, 'func name', uid, content))
    functionBoxHeaderDiv.appendChild(document.createTextNode('('))
    functionBoxHeaderDiv.appendChild(paramDiv)
    functionBoxHeaderDiv.appendChild(document.createTextNode(')'))
    functionBoxHeaderDiv.appendChild(this.createSpacing(spacingSize))
    functionBoxHeaderDiv.appendChild(document.createTextNode('{'))
    const spacer = document.createElement('div')
    spacer.style.marginRight = 'auto'
    functionBoxHeaderDiv.appendChild(spacer)

    return functionBoxHeaderDiv
  }

  renderElement (subTree, parentIsMoving, noInsert, renderInsertNode = false) {
    const elemArray = []
    if (subTree === null) {
      return elemArray
    } else {
      if (!(this.presenter.getMoveId() === null) && subTree.id === this.presenter.getMoveId()) {
        parentIsMoving = true
        noInsert = true
      }

      const container = document.createElement('div')
      if (subTree.id) {
        container.id = subTree.id
      }
      container.classList.add('vcontainer', 'frameTopLeft', 'columnAuto')
      container.style.backgroundColor = config.get()[subTree.type].color
      // container.style.margin = '0 .75px';
      // const element = document.createElement('div');
      // element.classList.add('column', 'vcontainer', 'frameTop');
      // container.appendChild(element);

      switch (subTree.type) {
        case 'InsertNode':

          if (parentIsMoving) {
            return this.renderElement(subTree.followElement, false, false)
          } else {
            if (noInsert) {
              return this.renderElement(subTree.followElement, false, true)
            } else {
              // inserting any other object instead of a function block
              if (this.presenter.getInsertMode()) {
                if (!this.presenter.getSettingFunctionMode()) {
                  const div = document.createElement('div')
                  div.classList.add('container', 'fixedHalfHeight', 'symbol', 'hand', 'text-center')
                  container.addEventListener('dragover', function (event) {
                    event.preventDefault()
                  })
                  container.addEventListener('drop', (event) => {
                    event.preventDefault()
                    this.presenter.appendElement(subTree.id)
                  })
                  container.addEventListener('click', () => this.presenter.appendElement(subTree.id))

                  if (this.presenter.getMoveId() && subTree.followElement && subTree.followElement.id === this.presenter.getMoveId()) {
                    const bold = document.createElement('strong')
                    bold.classList.add('moveText')
                    bold.appendChild(document.createTextNode('Verschieben abbrechen'))
                    div.appendChild(bold)
                  } else {
                    const symbol = document.createElement('div')
                    symbol.classList.add('insertIcon', 'symbolHeight')
                    div.appendChild(symbol)
                  }
                  container.appendChild(div)
                  elemArray.push(container)

                  if (subTree.followElement === null || subTree.followElement.type === 'Placeholder') {
                    return elemArray
                  } else {
                    return elemArray.concat(this.renderElement(subTree.followElement, false, noInsert))
                  }
                } else {
                  // container.classList.add('line');
                  if (renderInsertNode) {
                    const div = document.createElement('div')
                    div.classList.add('container', 'fixedHalfHeight', 'symbol', 'hand', 'text-center')
                    container.addEventListener('dragover', function (event) {
                      event.preventDefault()
                    })
                    container.addEventListener('drop', (event) => {
                      event.preventDefault()
                      this.presenter.appendElement(subTree.id)
                    })
                    container.addEventListener('click', () => this.presenter.appendElement(subTree.id))

                    if (this.presenter.getMoveId() && subTree.followElement && subTree.followElement.id === this.presenter.getMoveId()) {
                      const bold = document.createElement('strong')
                      bold.classList.add('moveText')
                      bold.appendChild(document.createTextNode('Verschieben abbrechen'))
                      div.appendChild(bold)
                    } else {
                      const symbol = document.createElement('div')
                      symbol.classList.add('insertIcon', 'symbolHeight')
                      div.appendChild(symbol)
                    }
                    container.appendChild(div)
                    elemArray.push(container)

                    if (subTree.followElement === null || subTree.followElement.type === 'Placeholder') {
                      return elemArray
                    } else {
                      return elemArray.concat(this.renderElement(subTree.followElement, false, noInsert))
                    }
                  } else {
                    return this.renderElement(subTree.followElement, false, noInsert)
                  }
                }
              } else {
                return this.renderElement(subTree.followElement, parentIsMoving, noInsert)
              }
            }
          }
        case 'Placeholder':
        {
          const div = document.createElement('div')
          div.classList.add('container', 'fixedHeight')
          const symbol = document.createElement('div')
          symbol.classList.add('placeholder', 'symbolHeight', 'symbol')
          div.appendChild(symbol)
          container.appendChild(div)
          elemArray.push(container)
          return elemArray
        }
        case 'InsertCase':
        {
          container.classList.remove('frameTopLeft', 'columnAuto')
          container.classList.add('frameLeft', 'fixedHeight')
          const divTaskNode = document.createElement('div')
          divTaskNode.classList.add('fixedHeight', 'container')

          const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id)
          divTaskNode.appendChild(textDiv)
          divTaskNode.appendChild(optionDiv)

          // container.classList.add('line');
          container.appendChild(divTaskNode)
          elemArray.push(container)

          return elemArray.concat(this.renderElement(subTree.followElement, parentIsMoving, noInsert))
        }
        case 'InputNode':
        case 'OutputNode':
        case 'TaskNode':
        {
          const divTaskNode = document.createElement('div')
          divTaskNode.classList.add('fixedHeight', 'container')

          const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id)
          divTaskNode.appendChild(textDiv)
          divTaskNode.appendChild(optionDiv)

          // container.classList.add('line');
          container.appendChild(divTaskNode)
          elemArray.push(container)

          return elemArray.concat(this.renderElement(subTree.followElement, parentIsMoving, noInsert))
        }
        case 'BranchNode':
        {
          // //container.classList.add('fix');
          const divBranchNode = document.createElement('div')
          divBranchNode.classList.add('columnAuto', 'vcontainer')

          const divHead = document.createElement('div')
          divHead.classList.add('branchSplit', 'vcontainer', 'fixedDoubleHeight')

          const divHeadTop = document.createElement('div')
          divHeadTop.classList.add('fixedHeight', 'container')

          const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id)
          divHeadTop.appendChild(textDiv)
          divHeadTop.appendChild(optionDiv)

          const divHeadBottom = document.createElement('div')
          divHeadBottom.classList.add('fixedHeight', 'container', 'padding')

          const divHeaderTrue = document.createElement('div')
          divHeaderTrue.classList.add('columnAuto', 'text-left', 'bottomHeader')
          divHeaderTrue.appendChild(document.createTextNode('Wahr'))

          const divHeaderFalse = document.createElement('div')
          divHeaderFalse.classList.add('columnAuto', 'text-right', 'bottomHeader')
          divHeaderFalse.appendChild(document.createTextNode('Falsch'))

          divHeadBottom.appendChild(divHeaderTrue)
          divHeadBottom.appendChild(divHeaderFalse)

          divHead.appendChild(divHeadTop)
          divHead.appendChild(divHeadBottom)
          divBranchNode.appendChild(divHead)

          const divChildren = document.createElement('div')
          divChildren.classList.add('columnAuto', 'branchCenter', 'container')

          const divTrue = document.createElement('div')
          divTrue.classList.add('columnAuto', 'vcontainer', 'ov-hidden')
          for (const elem of this.renderElement(subTree.trueChild, false, noInsert)) {
            this.applyCodeEventListeners(elem)
            divTrue.appendChild(elem)
          }

          const divFalse = document.createElement('div')
          divFalse.classList.add('columnAuto', 'vcontainer', 'ov-hidden')
          for (const elem of this.renderElement(subTree.falseChild, false, noInsert)) {
            this.applyCodeEventListeners(elem)
            divFalse.appendChild(elem)
          }

          divChildren.appendChild(divTrue)
          divChildren.appendChild(divFalse)
          divBranchNode.appendChild(divChildren)
          container.appendChild(divBranchNode)
          elemArray.push(container)

          return elemArray.concat(this.renderElement(subTree.followElement, parentIsMoving, noInsert))
        }
        case 'TryCatchNode':
        {
          const divTryCatchNode = newElement('div', ['columnAuto', 'vcontainer', 'tryCatchNode'], container)
          const divTry = newElement('div', ['container', 'fixedHeight', 'padding'], divTryCatchNode)
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id)
          divTry.appendChild(optionDiv)
          const textTry = newElement('div', ['symbol'], divTry)
          textTry.appendChild(document.createTextNode('Try'))

          const divTryContent = newElement('div', ['columnAuto', 'container', 'loopShift'], divTryCatchNode)
          const divTryContentBody = newElement('div', ['loopWidth', 'frameLeft', 'vcontainer'], divTryContent)
          for (const elem of this.renderElement(subTree.tryChild, false, noInsert)) {
            this.applyCodeEventListeners(elem)
            divTryContentBody.appendChild(elem)
          }

          // container for the vertical line to indent it correctly
          const vertLineContainer = newElement('div', ['container', 'columnAuto', 'loopShift'], divTryCatchNode)
          const vertLine2 = newElement('div', ['loopWidth', 'vcontainer'], vertLineContainer)
          const vertLine = newElement('div', ['frameLeftBottom'], vertLine2)
          vertLine.style.flex = '0 0 3px'

          const divCatch = newElement('div', ['container', 'fixedHeight', 'padding', 'tryCatchNode'], divTryCatchNode)
          const textCatch = newElement('div', ['symbol'], divCatch)
          textCatch.appendChild(document.createTextNode('Catch'))

          const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
          divCatch.appendChild(textDiv)

          const divCatchContent = newElement('div', ['columnAuto', 'container', 'loopShift'], divTryCatchNode)
          const divCatchContentBody = newElement('div', ['loopWidth', 'frameLeft', 'vcontainer'], divCatchContent)
          for (const elem of this.renderElement(subTree.catchChild, false, noInsert)) {
            this.applyCodeEventListeners(elem)
            divCatchContentBody.appendChild(elem)
          }

          elemArray.push(container)

          return elemArray.concat(this.renderElement(subTree.followElement, parentIsMoving, noInsert))
        }
        case 'HeadLoopNode':
        case 'CountLoopNode':
        {
          const div = document.createElement('div')
          div.classList.add('columnAuto', 'vcontainer')

          const divHead = document.createElement('div')
          divHead.classList.add('container', 'fixedHeight')

          const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id)
          divHead.appendChild(textDiv)
          divHead.appendChild(optionDiv)
          div.appendChild(divHead)

          const divChild = document.createElement('div')
          divChild.classList.add('columnAuto', 'container', 'loopShift')

          const divLoop = document.createElement('div')
          divLoop.classList.add('loopWidth', 'frameLeft', 'vcontainer')

          for (const elem of this.renderElement(subTree.child, false, noInsert)) {
            this.applyCodeEventListeners(elem)
            divLoop.appendChild(elem)
          }

          divChild.appendChild(divLoop)
          div.appendChild(divChild)
          container.appendChild(div)
          elemArray.push(container)

          return elemArray.concat(this.renderElement(subTree.followElement, parentIsMoving, noInsert))
        }
        case 'FunctionNode': {
          const innerDiv = document.createElement('div')
          innerDiv.classList.add('columnAuto', 'vcontainer')

          const divFunctionHeader = this.renderFunctionBox(subTree.id, subTree.text, subTree.parameters)

          const divHead = document.createElement('div')
          divHead.classList.add('container', 'fixedHeight')

          const funcOptionDiv = this.createOptionDiv(subTree.type, subTree.id)
          divHead.appendChild(funcOptionDiv)
          divFunctionHeader.appendChild(divHead)

          const divChild = document.createElement('div')
          divChild.classList.add('columnAuto', 'container', 'loopShift')

          // creates the inside of the functionf
          const divFunctionBody = document.createElement('div')
          divFunctionBody.classList.add('loopWidth', 'frameLeft', 'vcontainer')

          for (const elem of this.renderElement(subTree.child, false, noInsert)) {
            this.applyCodeEventListeners(elem)
            divFunctionBody.appendChild(elem)
          }
          divChild.appendChild(divFunctionBody)

          const divFuncFoot = document.createElement('div')
          divFuncFoot.classList.add('container', 'fixedHeight', 'padding')

          const textNode = document.createElement('div')
          textNode.classList.add('symbol')
          textNode.appendChild(document.createTextNode('}'))
          divFuncFoot.appendChild(textNode)

          const vertLine = document.createElement('div')
          vertLine.classList.add('frameLeftBottom')
          vertLine.style.flex = '0 0 3px'

          // container for the vertical line to indent it correctly
          const vertLineContainer = document.createElement('div')
          vertLineContainer.classList.add('container', 'columnAuto', 'loopShift')

          const vertLine2 = document.createElement('div')
          vertLine2.classList.add('loopWidth', 'vcontainer')

          vertLine2.appendChild(vertLine)
          vertLineContainer.appendChild(vertLine2)

          innerDiv.appendChild(divFunctionHeader)
          innerDiv.appendChild(divChild)
          innerDiv.appendChild(vertLineContainer)
          innerDiv.appendChild(divFuncFoot)
          container.appendChild(innerDiv)
          elemArray.push(container)

          return elemArray.concat(this.renderElement(subTree.followElement, parentIsMoving, noInsert))
        }
        case 'FootLoopNode':
        {
          const div = document.createElement('div')
          div.classList.add('columnAuto', 'vcontainer')

          const divChild = document.createElement('div')
          divChild.classList.add('columnAuto', 'container', 'loopShift')

          const divLoop = document.createElement('div')
          divLoop.classList.add('loopWidth', 'frameLeftBottom', 'vcontainer')

          for (const elem of this.renderElement(subTree.child, false, noInsert)) {
            this.applyCodeEventListeners(elem)
            divLoop.appendChild(elem)
          }
          // Fix for overlapped bottom line
          const lastLine = document.createElement('div')
          lastLine.classList.add('borderHeight')
          divLoop.appendChild(lastLine)

          divChild.appendChild(divLoop)
          div.appendChild(divChild)

          const divFoot = document.createElement('div')
          divFoot.classList.add('container', 'fixedHeight')

          const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id)
          divFoot.appendChild(textDiv)
          divFoot.appendChild(optionDiv)
          div.appendChild(divFoot)

          container.appendChild(div)
          elemArray.push(container)

          return elemArray.concat(this.renderElement(subTree.followElement, parentIsMoving, noInsert))
        }
        case 'CaseNode':
        {
          const div = document.createElement('div')
          div.classList.add('columnAuto', 'vcontainer')

          const divHead = document.createElement('div')
          divHead.classList.add('vcontainer', 'fixedHeight')
          if (subTree.defaultOn) {
            divHead.classList.add('caseHead-' + subTree.cases.length)
          } else {
            divHead.classList.add('caseHead-noDefault-' + subTree.cases.length)
          }
          divHead.style.backgroundPosition = '1px 0px'

          let nrCases = subTree.cases.length
          if (!subTree.defaultOn) {
            nrCases = nrCases + 2
          }
          const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id, nrCases)
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id)
          divHead.appendChild(textDiv)
          divHead.appendChild(optionDiv)
          div.appendChild(divHead)

          const divChildren = document.createElement('div')
          divChildren.classList.add('columnAuto', 'container')
          if (subTree.defaultOn) {
            divChildren.classList.add('caseBody-' + subTree.cases.length)
          } else {
            const level = subTree.cases.length - 1
            divChildren.classList.add('caseBody-' + level)
          }

          for (const caseElem of subTree.cases) {
            const divCase = document.createElement('div')
            divCase.classList.add('columnAuto', 'vcontainer', 'ov-hidden')

            for (const elem of this.renderElement(caseElem, false, noInsert)) {
              this.applyCodeEventListeners(elem)
              divCase.appendChild(elem)
            }
            divChildren.appendChild(divCase)
          }

          if (subTree.defaultOn) {
            const divCase = document.createElement('div')
            divCase.classList.add('columnAuto', 'vcontainer', 'ov-hidden')
            for (const elem of this.renderElement(subTree.defaultNode, false, noInsert)) {
              this.applyCodeEventListeners(elem)
              divCase.appendChild(elem)
            }
            divChildren.appendChild(divCase)
          }

          div.appendChild(divChildren)
          container.appendChild(div)
          elemArray.push(container)

          return elemArray.concat(this.renderElement(subTree.followElement, parentIsMoving, noInsert))
        }
      }
    }
  }

  /**
     * Reset the buttons after an insert or false drop
     */
  resetButtons () {
    // remove color of buttons
    for (const button of this.buttonList) {
      if (config.get()[button].use) {
        document.getElementById(config.get()[button].id).classList.remove('boldText')
      }
    }
  }

  /**
     * Increase the size of the working area
     */
  increaseSize () {
    // only allow a max size of ten (flexbox)
    if (this.size < 10) {
      const element = document.getElementById('Sizelimiter')
      element.classList.remove('col-' + this.size)
      this.size = this.size + 1
      element.classList.add('col-' + this.size)
    }
  }

  /**
     * Decrease the size of the working area
     */
  decreaseSize () {
    // only allow a minimal size of 6 (flexbox)
    if (this.size > 6) {
      const element = document.getElementById('Sizelimiter')
      element.classList.remove('col-' + this.size)
      this.size = this.size - 1
      element.classList.add('col-' + this.size)
    }
  }

  /**
     * Create a HTML wrapper around a div element, to fully work with the flexbox grid
     *
     * @param    div          the HTML structure to be wrapped
     * @param    inserting    identifies the div as InsertNode
     * @param    moving       identifies the div as the original position while moving
     * @return   div          completly wrapped HTML element
     */
  addCssWrapper (div, inserting, moving) {
    const innerDiv = document.createElement('div')
    innerDiv.classList.add('column')
    innerDiv.classList.add('col-12')
    innerDiv.classList.add('lineTop')

    const box = document.createElement('div')
    box.classList.add('row')

    // element is a InsertNode
    if (inserting) {
      box.classList.add('bg-secondary')
      box.classList.add('simpleBorder')
    }
    // element is original InsertNode while moving a block
    if (moving) {
      box.classList.add('bg-primary')
      box.classList.add('simpleBorder')
    }

    innerDiv.appendChild(div)
    box.appendChild(innerDiv)

    return box
  }

  openCaseOptions (uid) {
    const content = document.getElementById('modal-content')
    const footer = document.getElementById('modal-footer')
    while (content.hasChildNodes()) {
      content.removeChild(content.lastChild)
    }
    while (footer.hasChildNodes()) {
      footer.removeChild(footer.lastChild)
    }
    const element = this.presenter.getElementByUid(uid)

    const title = document.createElement('strong')
    title.appendChild(document.createTextNode('Einstellungen der ' + config.get().CaseNode.text + ': '))
    content.appendChild(title)
    const elementText = document.createElement('div')
    elementText.classList.add('caseTitle', 'boldText')
    elementText.appendChild(document.createTextNode(element.text))
    content.appendChild(elementText)

    const list = document.createElement('dl')
    list.classList.add('container')
    content.appendChild(list)
    const caseNumberTitle = document.createElement('dt')
    caseNumberTitle.classList.add('dtItem')
    caseNumberTitle.appendChild(document.createTextNode('Anzahl der Fälle:'))
    list.appendChild(caseNumberTitle)
    const caseNumber = document.createElement('dd')
    caseNumber.classList.add('ddItem', 'container')
    list.appendChild(caseNumber)
    const caseNr = document.createElement('div')
    caseNr.classList.add('text-center', 'shortenOnMobile')
    caseNr.appendChild(document.createTextNode(element.cases.length))
    caseNumber.appendChild(caseNr)
    const addCase = document.createElement('div')
    addCase.classList.add('addCaseIcon', 'hand', 'caseOptionsIcons', 'tooltip', 'tooltip-bottom')
    addCase.addEventListener('click', () => {
      this.presenter.addCase(uid)
      this.openCaseOptions(uid)
    })
    addCase.setAttribute('data-tooltip', 'Fall hinzufügen')
    caseNumber.appendChild(addCase)

    const defaultOnTitle = document.createElement('dt')
    defaultOnTitle.classList.add('dtItem')
    defaultOnTitle.appendChild(document.createTextNode('Sonst Zweig einschalten:'))
    list.appendChild(defaultOnTitle)
    const defaultOn = document.createElement('dd')
    defaultOn.classList.add('ddItem', 'container')
    defaultOn.addEventListener('click', () => {
      this.presenter.switchDefaultState(uid)
      this.openCaseOptions(uid)
    })
    list.appendChild(defaultOn)
    const defaultNo = document.createElement('div')
    defaultNo.classList.add('text-center', 'shortenOnMobile')
    defaultNo.setAttribute('data-abbr', 'N')
    defaultOn.appendChild(defaultNo)
    const defaultNoText = document.createElement('span')
    defaultNoText.appendChild(document.createTextNode('Nein'))
    defaultNo.appendChild(defaultNoText)
    const switchDefault = document.createElement('div')
    switchDefault.classList.add('hand', 'caseOptionsIcons')
    if (element.defaultOn) {
      switchDefault.classList.add('switchOn')
    } else {
      switchDefault.classList.add('switchOff')
    }
    defaultOn.appendChild(switchDefault)
    const defaultYes = document.createElement('div')
    defaultYes.classList.add('text-center', 'shortenOnMobile')
    defaultYes.setAttribute('data-abbr', 'J')
    defaultOn.appendChild(defaultYes)
    const defaultYesText = document.createElement('span')
    defaultYesText.appendChild(document.createTextNode('Ja'))
    defaultYes.appendChild(defaultYesText)

    const cancelButton = document.createElement('div')
    cancelButton.classList.add('modal-buttons', 'hand')
    cancelButton.appendChild(document.createTextNode('Schließen'))
    cancelButton.addEventListener('click', () => document.getElementById('IEModal').classList.remove('active'))
    footer.appendChild(cancelButton)

    document.getElementById('IEModal').classList.add('active')
  }

  /**
     * Create option elements and add them to the displayed element
     *
     * @param    type   type of the element
     * @param    uid    id of the current struktogramm element
     * @return   div    complete HTML structure of the options for the element
     */
  createOptionDiv (type, uid) {
    // create the container for all options
    const optionDiv = document.createElement('div')
    optionDiv.classList.add('optionContainer')

    // case nodes have additional options
    if (type === 'CaseNode') {
      const caseOptions = document.createElement('div')
      caseOptions.classList.add('gearIcon', 'optionIcon', 'hand', 'tooltip', 'tooltip-bottoml')
      caseOptions.setAttribute('data-tooltip', 'Einstellung')
      caseOptions.addEventListener('click', () => this.openCaseOptions(uid))
      optionDiv.appendChild(caseOptions)
    }

    // all elements can be moved, except InsertCases they are bind to the case node
    if (type !== 'InsertCase' && type !== 'FunctionNode') {
      const moveElem = document.createElement('div')
      moveElem.classList.add('moveIcon')
      moveElem.classList.add('optionIcon')
      moveElem.classList.add('hand')
      moveElem.classList.add('tooltip')
      moveElem.classList.add('tooltip-bottoml')
      moveElem.setAttribute('data-tooltip', 'Verschieben')
      moveElem.addEventListener('click', () => this.presenter.moveElement(uid))
      optionDiv.appendChild(moveElem)
    }

    // every element can be deleted
    const deleteElem = document.createElement('div')
    deleteElem.classList.add('trashcan')
    deleteElem.classList.add('optionIcon')
    deleteElem.classList.add('hand')
    deleteElem.classList.add('tooltip')
    deleteElem.classList.add('tooltip-bottoml')
    deleteElem.setAttribute('data-tooltip', 'Entfernen')
    deleteElem.addEventListener('click', () => this.presenter.removeElement(uid))
    optionDiv.appendChild(deleteElem)

    return optionDiv
  }

  /**
     * Create the displayed text and edit input field
     *
     * @param    type      type of the element
     * @param    content   displayed text
     * @param    uid       id of the element
     * @return   div       complete build HTML structure
     */
  createTextDiv (type, content, uid, nrCases = null) {
    // create the parent container
    const textDiv = document.createElement('div')
    textDiv.classList.add('columnAuto', 'symbol')

    // this div contains the hidden inputfield
    const editDiv = document.createElement('div')
    editDiv.classList.add('input-group', 'editField')
    editDiv.style.display = 'none'

    if (type === 'FootLoopNode') {
      editDiv.classList.add(uid)
    }

    // inputfield with eventlisteners
    const editText = document.createElement('input')
    editText.type = 'text'
    editText.value = content
    // TODO: move to presenter
    editText.addEventListener('keyup', event => {
      if (event.keyCode === 13) {
        this.presenter.editElement(uid, editText.value)
      }
      if (event.keyCode === 27) {
        this.presenter.renderAllViews()
      }
    })

    // add apply button
    const editApply = document.createElement('div')
    editApply.classList.add('acceptIcon', 'hand')
    editApply.addEventListener('click', () => this.presenter.editElement(uid, editText.value))

    // add dismiss button
    const editDismiss = document.createElement('div')
    editDismiss.classList.add('deleteIcon', 'hand')
    editDismiss.addEventListener('click', () => this.presenter.renderAllViews())

    // some types need additional text or a different position
    switch (type) {
      case 'InputNode':
        content = 'E: ' + content
        break
      case 'OutputNode':
        content = 'A: ' + content
        break
      case 'BranchNode':
      case 'InsertCase':
        textDiv.classList.add('text-center')
        break
    }

    // add displayed text when not in editing mode
    const innerTextDiv = document.createElement('div')
    // innerTextDiv.classList.add('column');
    // innerTextDiv.classList.add('col-12');
    // special handling for the default case of case nodes
    if (!(type === 'InsertCase' && content === 'Sonst')) {
      innerTextDiv.classList.add('padding')
      if (!this.presenter.getInsertMode()) {
        innerTextDiv.classList.add('hand', 'fullHeight')
      }
      innerTextDiv.addEventListener('click', () => {
        this.presenter.renderAllViews()
        this.presenter.switchEditState(uid)
      })
    }

    // insert text
    const textSpan = document.createElement('span')
    if (type === 'CaseNode') {
      textSpan.style.marginLeft = 'calc(' + (nrCases / (nrCases + 1)) * 100 + '% - 2em)'
    }
    const text = document.createTextNode(content)

    editDiv.appendChild(editText)
    editDiv.appendChild(editApply)
    editDiv.appendChild(editDismiss)

    textSpan.appendChild(text)
    innerTextDiv.appendChild(textSpan)
    textDiv.appendChild(innerTextDiv)
    textDiv.appendChild(editDiv)

    return textDiv
  }

  applyCodeEventListeners (obj) {
    // do not apply event listeners if obj is the function block
    if (!obj.firstChild.classList.contains('func-box-header')) {
      if (obj.firstChild.firstChild.classList.contains('loopShift')) {
        obj.firstChild.lastChild.addEventListener('mouseover', function () {
          const elemSpan = document.getElementById(obj.id + '-codeLine')
          if (elemSpan) {
            elemSpan.classList.add('highlight')
          }
        })
        obj.firstChild.lastChild.addEventListener('mouseout', function () {
          const elemSpan = document.getElementById(obj.id + '-codeLine')
          if (elemSpan) {
            elemSpan.classList.remove('highlight')
          }
        })
      } else {
        obj.firstChild.firstChild.addEventListener('mouseover', function () {
          const elemSpan = document.getElementById(obj.id + '-codeLine')
          if (elemSpan) {
            elemSpan.classList.add('highlight')
          }
        })
        obj.firstChild.firstChild.addEventListener('mouseout', function () {
          const elemSpan = document.getElementById(obj.id + '-codeLine')
          if (elemSpan) {
            elemSpan.classList.remove('highlight')
          }
        })
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
  prepareRenderTree (subTree, parentIsMoving, noInsert) {
    // end of recursion
    if (subTree === null || (subTree.type === 'InsertNode' && subTree.followElement === null && !this.presenter.getInsertMode())) {
      return document.createTextNode('')
    } else {
      // create outlining structure
      const innerDiv = document.createElement('div')
      innerDiv.classList.add('column')
      innerDiv.classList.add('col-12')

      const box = document.createElement('div')
      box.classList.add('columns')
      if (subTree.type !== 'InsertCase') {
        box.classList.add('lineTop')
      }
      // render every element and append it to the outlining structure
      this.renderTree(subTree, parentIsMoving, noInsert).forEach(function (childElement) {
        innerDiv.appendChild(childElement)
      })
      box.appendChild(innerDiv)

      return box
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
  renderTree (subTree, parentIsMoving, noInsert) {
    if (subTree === null) {
      return []
    } else {
      if (!(this.presenter.getMoveId() === null) && subTree.id === this.presenter.getMoveId()) {
        parentIsMoving = true
        noInsert = true
      }
      switch (subTree.type) {
        case 'InsertNode':

          if (parentIsMoving) {
            return this.renderTree(subTree.followElement, false, false)
          } else {
            if (noInsert) {
              return this.renderTree(subTree.followElement, false, true)
            } else {
              if (this.presenter.getInsertMode()) {
                const div = document.createElement('div')
                div.id = subTree.id
                // div.classList.add('c-hand');
                // div.classList.add('text-center');
                div.addEventListener('dragover', function (event) {
                  event.preventDefault()
                })
                div.addEventListener('drop', () => this.presenter.appendElement(subTree.id))
                div.addEventListener('click', () => this.presenter.appendElement(subTree.id))
                const text = document.createElement('div')
                if (this.presenter.getMoveId() && subTree.followElement && subTree.followElement.id === this.presenter.getMoveId()) {
                  const bold = document.createElement('strong')
                  bold.appendChild(document.createTextNode('Verschieben abbrechen'))
                  text.appendChild(bold)
                } else {
                  text.classList.add('insertIcon')
                }
                // text.classList.add('p-centered');
                div.appendChild(text)
                if (subTree.followElement === null || subTree.followElement.type === 'Placeholder') {
                  return [this.addCssWrapper(div, true, parentIsMoving)]
                } else {
                  return [this.addCssWrapper(div, true, parentIsMoving), this.prepareRenderTree(subTree.followElement, false, noInsert)]
                }
              } else {
                return this.renderTree(subTree.followElement, parentIsMoving, noInsert)
              }
            }
          }
        case 'Placeholder':

          if (this.presenter.getInsertMode()) {
            return []
          } else {
            const div = document.createElement('div')
            div.classList.add('text-center')
            const text = document.createElement('div')
            text.classList.add('emptyStateIcon')
            text.classList.add('p-centered')
            div.appendChild(text)
            return [div]
          }

        case 'InputNode':
        case 'OutputNode':
        case 'TaskNode':
        {
          const div = document.createElement('div')
          div.id = subTree.id
          div.classList.add('columns')
          div.classList.add('element')

          const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id)
          div.appendChild(textDiv)
          div.appendChild(optionDiv)

          return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
        }
        case 'FunctionNode':
        {
          const div = document.createElement('div')
          div.id = subTree.id
          div.classList.add(['columns', 'element'])

          const optionDiv = this.createOptionDiv(subTree.type, subTree.id)
          div.appendChild(optionDiv)

          return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
        }
        case 'BranchNode':
        {
          const div = document.createElement('div')
          div.id = subTree.id

          const divHead = document.createElement('div')
          divHead.classList.add('columns')
          divHead.classList.add('element')
          divHead.classList.add('stBranch')

          const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id)

          const bufferDiv = document.createElement('div')
          bufferDiv.classList.add('column')
          bufferDiv.classList.add('col-1')

          divHead.appendChild(bufferDiv)
          divHead.appendChild(textDiv)
          divHead.appendChild(optionDiv)

          const divPreSubHeader = document.createElement('div')
          divPreSubHeader.classList.add('column')
          divPreSubHeader.classList.add('col-12')

          const divSubHeader = document.createElement('div')
          divSubHeader.classList.add('columns')

          const divSubHeaderTrue = document.createElement('div')
          divSubHeaderTrue.classList.add('column')
          divSubHeaderTrue.classList.add('col-6')
          divSubHeaderTrue.appendChild(document.createTextNode('Wahr'))

          const divSubHeaderFalse = document.createElement('div')
          divSubHeaderFalse.classList.add('column')
          divSubHeaderFalse.classList.add('col-6')
          divSubHeaderFalse.classList.add('text-right')
          divSubHeaderFalse.appendChild(document.createTextNode('Falsch'))

          divSubHeader.appendChild(divSubHeaderTrue)
          divSubHeader.appendChild(divSubHeaderFalse)
          divPreSubHeader.appendChild(divSubHeader)
          divHead.appendChild(divPreSubHeader)

          const divTrue = document.createElement('div')
          divTrue.classList.add('column')
          divTrue.classList.add('col-6')
          divTrue.appendChild(this.prepareRenderTree(subTree.trueChild, false, noInsert))

          const divFalse = document.createElement('div')
          divFalse.classList.add('column')
          divFalse.classList.add('col-6')
          divFalse.appendChild(this.prepareRenderTree(subTree.falseChild, false, noInsert))

          const divChildren = document.createElement('div')
          divChildren.classList.add('columns')
          divChildren.classList.add('middleBranch')
          divChildren.appendChild(divTrue)
          divChildren.appendChild(divFalse)

          div.appendChild(divHead)
          div.appendChild(divChildren)

          return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
        }

        case 'HeadLoopNode':
        case 'CountLoopNode':
        {
          const div = document.createElement('div')
          div.id = subTree.id

          const divHead = document.createElement('div')
          divHead.classList.add('columns')
          divHead.classList.add('element')

          const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id)
          divHead.appendChild(textDiv)
          divHead.appendChild(optionDiv)

          const divLoopSubSub = document.createElement('div')
          divLoopSubSub.classList.add('column')
          divLoopSubSub.classList.add('col-12')
          divLoopSubSub.appendChild(this.prepareRenderTree(subTree.child, false, noInsert))
          const divLoopSub = document.createElement('div')
          divLoopSub.classList.add('columns')
          divLoopSub.appendChild(divLoopSubSub)

          const divLoop = document.createElement('div')
          divLoop.classList.add('column')
          divLoop.classList.add('col-11')
          divLoop.classList.add('col-ml-auto')
          divLoop.classList.add('lineLeft')
          divLoop.appendChild(divLoopSub)

          const divChild = document.createElement('div')
          divChild.classList.add('columns')
          divChild.appendChild(divLoop)

          div.appendChild(divHead)
          div.appendChild(divChild)

          return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
        }

        case 'FootLoopNode':
        {
          const div = document.createElement('div')
          div.id = subTree.id

          const divFoot = document.createElement('div')
          divFoot.classList.add('columns')
          divFoot.classList.add('element')
          divFoot.classList.add('lineTopFootLoop')

          const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id)
          divFoot.appendChild(textDiv)
          divFoot.appendChild(optionDiv)

          const divLoop = document.createElement('div')
          divLoop.classList.add('column')
          divLoop.classList.add('col-11')
          divLoop.classList.add('col-ml-auto')
          divLoop.classList.add('lineLeft')
          divLoop.appendChild(this.prepareRenderTree(subTree.child, false, noInsert))

          const divChild = document.createElement('div')
          divChild.classList.add('columns')
          divChild.appendChild(divLoop)

          div.appendChild(divChild)
          div.appendChild(divFoot)

          return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
        }

        case 'CaseNode':
        {
          const div = document.createElement('div')
          div.id = subTree.id

          const divHead = document.createElement('div')
          divHead.classList.add('columns')
          divHead.classList.add('element')
          if (subTree.defaultOn) {
            divHead.classList.add('caseHead-' + subTree.cases.length)
          } else {
            divHead.classList.add('caseHead-noDefault-' + subTree.cases.length)
          }

          const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id)

          const bufferDiv = document.createElement('div')
          bufferDiv.classList.add('column')
          bufferDiv.classList.add('col-1')

          divHead.appendChild(bufferDiv)
          divHead.appendChild(textDiv)
          divHead.appendChild(optionDiv)

          const divPreSubHeader = document.createElement('div')
          divPreSubHeader.classList.add('column')
          divPreSubHeader.classList.add('col-12')

          const divChildren = document.createElement('div')
          divChildren.classList.add('columns')
          if (subTree.defaultOn) {
            divChildren.classList.add('caseBody-' + subTree.cases.length)
          } else {
            const level = subTree.cases.length - 1
            divChildren.classList.add('caseBody-' + level)
          }
          for (const caseElem of subTree.cases) {
            const divCase = document.createElement('div')
            divCase.classList.add('column')
            divCase.appendChild(this.prepareRenderTree(caseElem, false, noInsert))
            divChildren.appendChild(divCase)
          }

          if (subTree.defaultOn) {
            const divCase = document.createElement('div')
            divCase.classList.add('column')
            divCase.appendChild(this.prepareRenderTree(subTree.defaultNode, false, noInsert))
            divChildren.appendChild(divCase)
          }

          div.appendChild(divHead)
          div.appendChild(divChildren)

          return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
        }

        case 'InsertCase':
        {
          const div = document.createElement('div')
          div.id = subTree.id
          div.classList.add('columns')
          div.classList.add('element')

          const bufferDiv = document.createElement('div')
          bufferDiv.classList.add('column')
          bufferDiv.classList.add('col-1')
          const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
          const optionDiv = this.createOptionDiv(subTree.type, subTree.id)
          div.appendChild(bufferDiv)
          div.appendChild(textDiv)
          div.appendChild(optionDiv)
          return [div, this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
        }

        default:
          return this.renderTree(subTree.followElement, parentIsMoving, noInsert)
      }
    }
  }

  displaySourcecode (buttonId) {}
  setLang () {}
}
