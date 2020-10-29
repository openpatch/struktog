import { config } from '../config.js'
import { generateResetButton } from '../helpers/generator'

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
      'CaseNode'
    ]

    this.preRender()
  }

  preRender () {
    let divInsert = document.createElement('div')
    divInsert.classList.add('columnEditorFull')
    let divHeader = document.createElement('div')
    // divHeader.classList.add('elementButtonColumns');
    let spanHeader = document.createElement('strong')
    spanHeader.classList.add('margin-small')
    spanHeader.appendChild(document.createTextNode('Element wählen:'))
    divHeader.appendChild(spanHeader)
    divInsert.appendChild(divHeader)

    let divButtons = document.createElement('div')
    divButtons.classList.add('container', 'justify-center')
    for (const item of this.buttonList) {
      if (config.get()[item].use) {
        divButtons.appendChild(this.createButton(item))
      }
    }
    divInsert.appendChild(divButtons)

    let divEditorHeadline = document.createElement('div')
    divEditorHeadline.classList.add('columnEditorFull', 'headerContainer')
    let editorHeadline = document.createElement('strong')
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

    let divWorkingArea = document.createElement('div')
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
    let div = document.createElement('div')
    div.classList.add('columnInput', 'insertButton', 'hand')
    div.style.backgroundColor = config.get()[button].color
    div.id = config.get()[button].id
    div.draggable = 'true'
    div.addEventListener('click', (event) => this.presenter.insertNode(config.get()[button].id, event))
    div.addEventListener('dragstart', (event) => this.presenter.insertNode(config.get()[button].id, event))
    div.addEventListener('dragend', () => this.presenter.resetDrop())
    let spanText = document.createElement('span')
    spanText.appendChild(document.createTextNode(config.get()[button].text))
    let divIcon = document.createElement('div')
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
    for (const elem of this.renderElement(tree, false, false)) {
      this.applyCodeEventListeners(elem)
      this.domRoot.appendChild(elem)
    }
    const lastLine = document.createElement('div')
    lastLine.classList.add('frameTop', 'borderHeight')
    this.domRoot.appendChild(lastLine)
  }

  renderElement (subTree, parentIsMoving, noInsert) {
    let elemArray = []
    if (subTree === null) {
      return elemArray
    } else {
      if (!(this.presenter.getMoveId() === null) && subTree.id == this.presenter.getMoveId()) {
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
          {
            if (parentIsMoving) {
              return this.renderElement(subTree.followElement, false, false)
            } else {
              if (noInsert) {
                return this.renderElement(subTree.followElement, false, true)
              } else {
                if (this.presenter.getInsertMode()) {
                  // container.classList.add('line');
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

                  if (this.presenter.getMoveId() && subTree.followElement && subTree.followElement.id == this.presenter.getMoveId()) {
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

                  if (subTree.followElement === null || subTree.followElement.type == 'Placeholder') {
                    return elemArray
                  } else {
                    return elemArray.concat(this.renderElement(subTree.followElement, false, noInsert))
                  }
                } else {
                  return this.renderElement(subTree.followElement, parentIsMoving, noInsert)
                }
              }
            }
          }
          break
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
          break
        case 'InsertCase':
        {
          container.classList.remove('frameTopLeft', 'columnAuto')
          container.classList.add('frameLeft', 'fixedHeight')
        }
        case 'InputNode':
        case 'OutputNode':
        case 'TaskNode':
          {
            const div = document.createElement('div')
            div.classList.add('fixedHeight', 'container')

            const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
            const optionDiv = this.createOptionDiv(subTree.type, subTree.id)
            div.appendChild(textDiv)
            div.appendChild(optionDiv)

            // container.classList.add('line');
            container.appendChild(div)
            elemArray.push(container)

            return elemArray.concat(this.renderElement(subTree.followElement, parentIsMoving, noInsert))
          }
          break
        case 'BranchNode':
        {
          // //container.classList.add('fix');
          const div = document.createElement('div')
          div.classList.add('columnAuto', 'vcontainer')

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
          div.appendChild(divHead)

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
          div.appendChild(divChildren)
          container.appendChild(div)
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
            let divCase = document.createElement('div')
            divCase.classList.add('columnAuto', 'vcontainer', 'ov-hidden')

            for (const elem of this.renderElement(caseElem, false, noInsert)) {
              this.applyCodeEventListeners(elem)
              divCase.appendChild(elem)
            }
            divChildren.appendChild(divCase)
          }

          if (subTree.defaultOn) {
            let divCase = document.createElement('div')
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
      let element = document.getElementById('Sizelimiter')
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
      var element = document.getElementById('Sizelimiter')
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
    let innerDiv = document.createElement('div')
    innerDiv.classList.add('column')
    innerDiv.classList.add('col-12')
    innerDiv.classList.add('lineTop')

    let box = document.createElement('div')
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
    let optionDiv = document.createElement('div')
    optionDiv.classList.add('optionContainer')

    // case nodes have additional options
    if (type == 'CaseNode') {
      const caseOptions = document.createElement('div')
      caseOptions.classList.add('gearIcon', 'optionIcon', 'hand', 'tooltip', 'tooltip-bottoml')
      caseOptions.setAttribute('data-tooltip', 'Einstellung')
      caseOptions.addEventListener('click', () => this.openCaseOptions(uid))
      optionDiv.appendChild(caseOptions)
    }

    // all elements can be moved, except InsertCases they are bind to the case node
    if (type != 'InsertCase') {
      let moveElem = document.createElement('div')
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
    let deleteElem = document.createElement('div')
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
    let textDiv = document.createElement('div')
    textDiv.classList.add('columnAuto', 'symbol')

    // this div contains the hidden inputfield
    let editDiv = document.createElement('div')
    editDiv.classList.add('input-group', 'editField')
    editDiv.style.display = 'none'

    if (type == 'FootLoopNode') {
      editDiv.classList.add(uid)
    }

    // inputfield with eventlisteners
    let editText = document.createElement('input')
    editText.type = 'text'
    editText.value = content
    // TODO: move to presenter
    editText.addEventListener('keyup', event => {
      if (event.keyCode == 13) {
        this.presenter.editElement(uid, editText.value)
      }
      if (event.keyCode == 27) {
        this.presenter.renderAllViews()
      }
    })

    // add apply button
    let editApply = document.createElement('div')
    editApply.classList.add('acceptIcon', 'hand')
    editApply.addEventListener('click', () => this.presenter.editElement(uid, editText.value))

    // add dismiss button
    let editDismiss = document.createElement('div')
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
    let innerTextDiv = document.createElement('div')
    // innerTextDiv.classList.add('column');
    // innerTextDiv.classList.add('col-12');
    // special handling for the default case of case nodes
    if (!(type == 'InsertCase' && content == 'Sonst')) {
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
    if (type == 'CaseNode') {
      textSpan.style.marginLeft = 'calc(' + (nrCases / (nrCases + 1)) * 100 + '% - 2em)'
    }
    let text = document.createTextNode(content)

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
    if (subTree === null || subTree.type == 'InsertNode' && subTree.followElement === null && !this.presenter.getInsertMode()) {
      return document.createTextNode('')
    } else {
      // create outlining structure
      let innerDiv = document.createElement('div')
      innerDiv.classList.add('column')
      innerDiv.classList.add('col-12')

      let box = document.createElement('div')
      box.classList.add('columns')
      if (subTree.type != 'InsertCase') {
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
      if (!(this.presenter.getMoveId() === null) && subTree.id == this.presenter.getMoveId()) {
        parentIsMoving = true
        noInsert = true
      }
      switch (subTree.type) {
        case 'InsertNode':
          {
            if (parentIsMoving) {
              return this.renderTree(subTree.followElement, false, false)
            } else {
              if (noInsert) {
                return this.renderTree(subTree.followElement, false, true)
              } else {
                if (this.presenter.getInsertMode()) {
                  let div = document.createElement('div')
                  div.id = subTree.id
                  // div.classList.add('c-hand');
                  // div.classList.add('text-center');
                  div.addEventListener('dragover', function (event) {
                    event.preventDefault()
                  })
                  div.addEventListener('drop', () => this.presenter.appendElement(subTree.id))
                  div.addEventListener('click', () => this.presenter.appendElement(subTree.id))
                  let text = document.createElement('div')
                  if (this.presenter.getMoveId() && subTree.followElement && subTree.followElement.id == this.presenter.getMoveId()) {
                    let bold = document.createElement('strong')
                    bold.appendChild(document.createTextNode('Verschieben abbrechen'))
                    text.appendChild(bold)
                  } else {
                    text.classList.add('insertIcon')
                  }
                  // text.classList.add('p-centered');
                  div.appendChild(text)
                  if (subTree.followElement === null || subTree.followElement.type == 'Placeholder') {
                    return [this.addCssWrapper(div, true, parentIsMoving)]
                  } else {
                    return [this.addCssWrapper(div, true, parentIsMoving), this.prepareRenderTree(subTree.followElement, false, noInsert)]
                  }
                } else {
                  return this.renderTree(subTree.followElement, parentIsMoving, noInsert)
                }
              }
            }
          }
          break

        case 'Placeholder':
          {
            if (this.presenter.getInsertMode()) {
              return []
            } else {
              let div = document.createElement('div')
              div.classList.add('text-center')
              let text = document.createElement('div')
              text.classList.add('emptyStateIcon')
              text.classList.add('p-centered')
              div.appendChild(text)
              return [div]
            }
          }
          break

        case 'InputNode':
        case 'OutputNode':
        case 'TaskNode':
          {
            let div = document.createElement('div')
            div.id = subTree.id
            div.classList.add('columns')
            div.classList.add('element')

            let textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
            let optionDiv = this.createOptionDiv(subTree.type, subTree.id)
            div.appendChild(textDiv)
            div.appendChild(optionDiv)

            return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
          }
          break

        case 'BranchNode':
          {
            let div = document.createElement('div')
            div.id = subTree.id

            let divHead = document.createElement('div')
            divHead.classList.add('columns')
            divHead.classList.add('element')
            divHead.classList.add('stBranch')

            let textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
            let optionDiv = this.createOptionDiv(subTree.type, subTree.id)

            let bufferDiv = document.createElement('div')
            bufferDiv.classList.add('column')
            bufferDiv.classList.add('col-1')

            divHead.appendChild(bufferDiv)
            divHead.appendChild(textDiv)
            divHead.appendChild(optionDiv)

            let divPreSubHeader = document.createElement('div')
            divPreSubHeader.classList.add('column')
            divPreSubHeader.classList.add('col-12')

            let divSubHeader = document.createElement('div')
            divSubHeader.classList.add('columns')

            let divSubHeaderTrue = document.createElement('div')
            divSubHeaderTrue.classList.add('column')
            divSubHeaderTrue.classList.add('col-6')
            divSubHeaderTrue.appendChild(document.createTextNode('Wahr'))

            let divSubHeaderFalse = document.createElement('div')
            divSubHeaderFalse.classList.add('column')
            divSubHeaderFalse.classList.add('col-6')
            divSubHeaderFalse.classList.add('text-right')
            divSubHeaderFalse.appendChild(document.createTextNode('Falsch'))

            divSubHeader.appendChild(divSubHeaderTrue)
            divSubHeader.appendChild(divSubHeaderFalse)
            divPreSubHeader.appendChild(divSubHeader)
            divHead.appendChild(divPreSubHeader)

            let divTrue = document.createElement('div')
            divTrue.classList.add('column')
            divTrue.classList.add('col-6')
            divTrue.appendChild(this.prepareRenderTree(subTree.trueChild, false, noInsert))

            let divFalse = document.createElement('div')
            divFalse.classList.add('column')
            divFalse.classList.add('col-6')
            divFalse.appendChild(this.prepareRenderTree(subTree.falseChild, false, noInsert))

            let divChildren = document.createElement('div')
            divChildren.classList.add('columns')
            divChildren.classList.add('middleBranch')
            divChildren.appendChild(divTrue)
            divChildren.appendChild(divFalse)

            div.appendChild(divHead)
            div.appendChild(divChildren)

            return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
          }
          break

        case 'HeadLoopNode':
        case 'CountLoopNode':
          {
            let div = document.createElement('div')
            div.id = subTree.id

            let divHead = document.createElement('div')
            divHead.classList.add('columns')
            divHead.classList.add('element')

            let textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
            let optionDiv = this.createOptionDiv(subTree.type, subTree.id)
            divHead.appendChild(textDiv)
            divHead.appendChild(optionDiv)

            let divLoopSubSub = document.createElement('div')
            divLoopSubSub.classList.add('column')
            divLoopSubSub.classList.add('col-12')
            divLoopSubSub.appendChild(this.prepareRenderTree(subTree.child, false, noInsert))
            let divLoopSub = document.createElement('div')
            divLoopSub.classList.add('columns')
            divLoopSub.appendChild(divLoopSubSub)

            let divLoop = document.createElement('div')
            divLoop.classList.add('column')
            divLoop.classList.add('col-11')
            divLoop.classList.add('col-ml-auto')
            divLoop.classList.add('lineLeft')
            divLoop.appendChild(divLoopSub)

            let divChild = document.createElement('div')
            divChild.classList.add('columns')
            divChild.appendChild(divLoop)

            div.appendChild(divHead)
            div.appendChild(divChild)

            return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
          }
          break

        case 'FootLoopNode':
          {
            let div = document.createElement('div')
            div.id = subTree.id

            let divFoot = document.createElement('div')
            divFoot.classList.add('columns')
            divFoot.classList.add('element')
            divFoot.classList.add('lineTopFootLoop')

            let textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
            let optionDiv = this.createOptionDiv(subTree.type, subTree.id)
            divFoot.appendChild(textDiv)
            divFoot.appendChild(optionDiv)

            let divLoop = document.createElement('div')
            divLoop.classList.add('column')
            divLoop.classList.add('col-11')
            divLoop.classList.add('col-ml-auto')
            divLoop.classList.add('lineLeft')
            divLoop.appendChild(this.prepareRenderTree(subTree.child, false, noInsert))

            let divChild = document.createElement('div')
            divChild.classList.add('columns')
            divChild.appendChild(divLoop)

            div.appendChild(divChild)
            div.appendChild(divFoot)

            return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
          }
          break

        case 'CaseNode':
          {
            let div = document.createElement('div')
            div.id = subTree.id

            let divHead = document.createElement('div')
            divHead.classList.add('columns')
            divHead.classList.add('element')
            if (subTree.defaultOn) {
              divHead.classList.add('caseHead-' + subTree.cases.length)
            } else {
              divHead.classList.add('caseHead-noDefault-' + subTree.cases.length)
            }

            let textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
            let optionDiv = this.createOptionDiv(subTree.type, subTree.id)

            let bufferDiv = document.createElement('div')
            bufferDiv.classList.add('column')
            bufferDiv.classList.add('col-1')

            divHead.appendChild(bufferDiv)
            divHead.appendChild(textDiv)
            divHead.appendChild(optionDiv)

            let divPreSubHeader = document.createElement('div')
            divPreSubHeader.classList.add('column')
            divPreSubHeader.classList.add('col-12')

            let divChildren = document.createElement('div')
            divChildren.classList.add('columns')
            if (subTree.defaultOn) {
              divChildren.classList.add('caseBody-' + subTree.cases.length)
            } else {
              let level = subTree.cases.length - 1
              divChildren.classList.add('caseBody-' + level)
            }
            for (const caseElem of subTree.cases) {
              let divCase = document.createElement('div')
              divCase.classList.add('column')
              divCase.appendChild(this.prepareRenderTree(caseElem, false, noInsert))
              divChildren.appendChild(divCase)
            }

            if (subTree.defaultOn) {
              let divCase = document.createElement('div')
              divCase.classList.add('column')
              divCase.appendChild(this.prepareRenderTree(subTree.defaultNode, false, noInsert))
              divChildren.appendChild(divCase)
            }

            div.appendChild(divHead)
            div.appendChild(divChildren)

            return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
          }
          break

        case 'InsertCase':
          {
            let div = document.createElement('div')
            div.id = subTree.id
            div.classList.add('columns')
            div.classList.add('element')

            let bufferDiv = document.createElement('div')
            bufferDiv.classList.add('column')
            bufferDiv.classList.add('col-1')
            let textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id)
            let optionDiv = this.createOptionDiv(subTree.type, subTree.id)
            div.appendChild(bufferDiv)
            div.appendChild(textDiv)
            div.appendChild(optionDiv)
            return [div, this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
          }
          break

        default:
          return this.renderTree(subTree.followElement, parentIsMoving, noInsert)
      }
    }
  }

  displaySourcecode (buttonId) {}
  setLang () {}
}
