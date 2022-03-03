export class CodeView {
  constructor (presenter, domRoot) {
    this.presenter = presenter
    this.domRoot = domRoot
    this.lang = '--'
    this.translationMap = {
      'Python': { 'untranslatable': ['FootLoopNode'],
        'InputNode': { 'pre': '',
          'post': ' = input("Eingabe")\n'
        },
        'OutputNode': { 'pre': 'print(',
          'post': ')\n'
        },
        'TaskNode': { 'pre': '',
          'post': '\n'
        },
        'BranchNode': { 'pre': 'if ',
          'post': ':\n',
          'between': 'else:\n'
        },
        'CountLoopNode': { 'pre': 'for ',
          'post': ':\n'
        },
        'HeadLoopNode': { 'pre': 'while ',
          'post': ':\n'
        },
        'FunctionNode': { 'pre': 'def ',
          'between': '(',
          'post': '):\n'
        },
        'CaseNode': { 'pre': 'if ',
          'post': ':\n'
        },
        'InsertCase': { 'preNormal': 'elif ',
          'preDefault': 'default',
          'post': ':\n',
          'postpost': '\n'
        },
        'leftBracket': '',
        'rightBracket': '',
        'pseudoSwitch': true
      },
      'Python ab v3.10': { 'untranslatable': ['FootLoopNode'],
        'InputNode': { 'pre': '',
          'post': ' = input("Eingabe")\n'
        },
        'OutputNode': { 'pre': 'print(',
          'post': ')\n'
        },
        'TaskNode': { 'pre': '',
          'post': '\n'
        },
        'BranchNode': { 'pre': 'if ',
          'post': ':\n',
          'between': 'else:\n'
        },
        'CountLoopNode': { 'pre': 'for ',
          'post': ':\n'
        },
        'HeadLoopNode': { 'pre': 'while ',
          'post': ':\n'
        },
        'FunctionNode': { 'pre': 'def ',
          'between': '(',
          'post': '):\n'
        },
        'CaseNode': { 'pre': 'match ',
          'post': ':\n'
        },
        'InsertCase': { 'preNormal': 'case ',
          'preDefault': 'case _',
          'post': ':\n',
          'postpost': '\n'
        },
        'leftBracket': '',
        'rightBracket': '',
        'pseudoSwitch': false
      },
      'PHP': { 'untranslatable': [],
        'InputNode': { 'pre': '',
          'post': ' = readline("Eingabe");\n'
        },
        'OutputNode': { 'pre': 'echo ',
          'post': ';\n'
        },
        'TaskNode': { 'pre': '',
          'post': ';\n'
        },
        'BranchNode': { 'pre': 'if (',
          'post': ')\n',
          'between': '} else {\n'
        },
        'CountLoopNode': { 'pre': 'for (',
          'post': ')\n'
        },
        'HeadLoopNode': { 'pre': 'while (',
          'post': ')\n'
        },
        'FootLoopNode': { 'prepre': 'do\n',
          'pre': 'while (',
          'post': ');\n'
        },
        'FunctionNode': { 'pre': 'def ',
          'between': '(',
          'post': '):\n'
        },
        'CaseNode': { 'pre': 'switch (',
          'post': ')\n'
        },
        'InsertCase': { 'preNormal': 'case ',
          'preDefault': 'default',
          'post': ':\n',
          'postpost': 'break;\n'
        },
        'leftBracket': '{',
        'rightBracket': '}',
        'pseudoSwitch': false
      },
      'Java': { 'untranslatable': [],
        'InputNode': { 'pre': '',
          'post': ' = System.console().readLine();\n'
        },
        'OutputNode': { 'pre': 'System.out.println(',
          'post': ');\n'
        },
        'TaskNode': { 'pre': '',
          'post': ';\n'
        },
        'BranchNode': { 'pre': 'if (',
          'post': ')\n',
          'between': '} else {\n'
        },
        'CountLoopNode': { 'pre': 'for (',
          'post': ')\n'
        },
        'HeadLoopNode': { 'pre': 'while (',
          'post': ')\n'
        },
        'FootLoopNode': { 'prepre': 'do\n',
          'pre': 'while (',
          'post': ');\n'
        },
        'FunctionNode': { 'pre': 'public void ',
          'between': '(',
          'post': ')\n'
        },
        'CaseNode': { 'pre': 'switch (',
          'post': ')\n'
        },
        'InsertCase': { 'preNormal': 'case ',
          'preDefault': 'default',
          'post': ':\n',
          'postpost': 'break;\n'
        },
        'leftBracket': '{',
        'rightBracket': '}',
        'pseudoSwitch': false
      }
    }

    this.preRender()
  }

  preRender () {
    const sourcecode = document.getElementById('SourcecodeDisplay')
    let sourcecodeDisplay = document.createElement('div')
    sourcecodeDisplay.classList.add('fixFullWidth', 'margin-top-small')
    let sourcecodeHeader = document.createElement('div')
    sourcecodeHeader.classList.add('columnAuto', 'container')
    let sourcecodeTitle = document.createElement('strong')
    sourcecodeTitle.classList.add('center')
    sourcecodeTitle.appendChild(document.createTextNode('Übersetzen in:'))
    let sourcecodeForm = document.createElement('div')
    sourcecodeForm.classList.add('center')
    let sourcecodeSelect = document.createElement('select')
    sourcecodeSelect.classList.add('form-select')
    sourcecodeSelect.id = 'SourcecodeSelect'
    sourcecodeSelect.addEventListener('change', (event) => this.presenter.startTransforming(event))
    let sourcecodeOption = document.createElement('option')
    sourcecodeOption.value = '--'
    sourcecodeOption.appendChild(document.createTextNode('--'))
    sourcecodeSelect.appendChild(sourcecodeOption)
    for (const lang in this.translationMap) {
      const langDiv = document.createElement('option')
      langDiv.value = lang
      langDiv.appendChild(document.createTextNode(lang))
      sourcecodeSelect.appendChild(langDiv)
    }

    let sourcecodeCopy = document.createElement('div')
    sourcecodeCopy.setAttribute('data-tooltip', 'Kopiere Code')
    sourcecodeCopy.classList.add('center', 'copyIcon', 'struktoOption', 'sourcecodeHeader', 'hand', 'tooltip')
    sourcecode.addEventListener('click', function (event) {
      navigator.clipboard.writeText(localStorage.getItem('struktog_code'))
    })

    sourcecodeForm.appendChild(sourcecodeSelect)
    sourcecodeHeader.appendChild(sourcecodeTitle)
    sourcecodeHeader.appendChild(sourcecodeForm)
    sourcecodeHeader.appendChild(sourcecodeCopy)

    let sourcecodeWorkingArea = document.createElement('div')
    sourcecodeWorkingArea.classList.add('columnAuto')
    sourcecodeWorkingArea.id = 'Sourcecode'

    sourcecodeDisplay.appendChild(sourcecodeHeader)
    sourcecodeDisplay.appendChild(sourcecodeWorkingArea)
    sourcecode.appendChild(sourcecodeDisplay)

    this.domRoot = document.getElementById('Sourcecode')

    this.generateCodeSwitch(this.presenter, document.getElementById('struktoOptions1'))
    this.generateCodeSwitch(this.presenter, document.getElementById('struktoOptions2'))

    if (typeof (Storage) !== 'undefined') {
      if ('displaySourcecode' in localStorage && 'lang' in localStorage) {
        const possibleLang = localStorage.lang
        if (possibleLang in this.translationMap) {
          this.lang = possibleLang
          sourcecodeSelect.value = this.lang
          this.presenter.setSourcecodeDisplay(JSON.parse(localStorage.displaySourcecode))
          this.displaySourcecode('ToggleSourcecode')
        }
      }
    }
  }

  render (model) {
    // remove content
    while (this.domRoot.hasChildNodes()) {
      this.domRoot.removeChild(this.domRoot.lastChild)
    }

    // only translate, if some language is selected
    if (this.lang !== '--') {
      // check if translation is possible with current tree
      let isTranslatable = false
      for (const nodeType of this.translationMap[this.lang].untranslatable) {
        isTranslatable = isTranslatable || this.checkForUntranslatable(model, nodeType)
      }

      // create container for the spans
      let preBlock = document.createElement('pre')
      preBlock.classList.add('code')
      // set the language attribute
      preBlock.setAttribute('data-lang', this.lang)

      let codeBlock = document.createElement('code')

      // start appending the translated elements
      let codeText = ''
      if (!isTranslatable) {
        let content = this.transformToCode(model, 0, this.lang)
        content.forEach(function (i) {
          codeBlock.appendChild(i)
          codeText = codeText + i.textContent
        })
      } else {
        codeBlock.appendChild(document.createTextNode('Das Struktogramm enthält Elemente, \nwelche in der gewählten Programmiersprache \nnicht direkt zur Verfügung stehen.\nDeshalb bitte manuell in Code überführen.'))
      }
      localStorage.setItem('struktog_code', codeText)

      preBlock.appendChild(codeBlock)
      this.domRoot.appendChild(preBlock)
    }
  }

  generateCodeSwitch (presenter, domNode) {
    const option = document.createElement('div')
    option.classList.add('struktoOption', 'codeIcon', 'tooltip', 'tooltip-bottomCode', 'hand', 'ToggleSourcecode')
    option.setAttribute('data-tooltip', 'Quellcode einblenden')
    option.addEventListener('click', (event) => presenter.alterSourcecodeDisplay(event))
    domNode.appendChild(option)
  }

  setLang (lang) {
    if (typeof (Storage) !== 'undefined') {
      localStorage.lang = lang
      localStorage.displaySourcecode = true
    }
    this.lang = lang
  }

  resetButtons () {}

  /**
     * Add indentations to a text element
     *
     * @param    indentLevel   number of how many levels deep the node is
     * @return   string        multiple indentations, times the level
     */
  addIndentations (indentLevel) {
    let text = ''
    let defaultIndent = '    '
    for (let i = 0; i < indentLevel; i++) {
      text = text + defaultIndent
    }
    return text
  }

  /**
     * Create a span with text and a highlight class
     *
     * @param    text   text to be displayed
     * @return   span   complete HTML structure with text and class
     */
  createHighlightedSpan (text) {
    let span = document.createElement('span')
    span.classList.add('text-code')
    span.appendChild(document.createTextNode(text))
    return span
  }

  /**
     * Check recursively elements if they match a given type
     *
     * @param    subTree    part of the tree with all children of current element
     * @param    nodeType   type of the translation map element to be checked against
     * @return   boolean    true, if the current element type is the given type
     */
  checkForUntranslatable (subTree, nodeType) {
    // end recursion
    if (subTree.type === 'Placeholder' || (subTree.type === 'InsertNode' && subTree.followElement === null)) {
      return false
    } else {
      // compare the types1
      if (subTree.type === nodeType) {
        return true
      } else {
        // different recursive steps, depending on child structure
        switch (subTree.type) {
          case 'InsertNode':
          case 'InputNode':
          case 'OutputNode':
          case 'TaskNode':
            return false || this.checkForUntranslatable(subTree.followElement, nodeType)
          case 'BranchNode':
            return false || this.checkForUntranslatable(subTree.trueChild, nodeType) || this.checkForUntranslatable(subTree.falseChild, nodeType) || this.checkForUntranslatable(subTree.followElement, nodeType)
          case 'CountLoopNode':
          case 'HeadLoopNode':
          case 'FootLoopNode':
          case 'FunctionNode':
            return false || this.checkForUntranslatable(subTree.child, nodeType) || this.checkForUntranslatable(subTree.followElement, nodeType)
          case 'CaseNode':
            let state = false
            for (let i = 0; i < subTree.length; i++) {
              state = state || this.checkForUntranslatable(subTree.cases[i], nodeType)
            }
            state = state || this.checkForUntranslatable(subTree.defaultNode, nodeType)
            return state || this.checkForUntranslatable(subTree.followElement, nodeType)
        }
      }
    }
  }

  /**
     * Tranform an element to sourcecode with a translation mapping
     *
     * @param    subTree       part of the tree with all children of current element
     * @param    indentLevel   number of indentation levels
     * @param    lang          current sourcecode language
     * @return   []            array of span elements with the tranformed element
     */
  transformToCode (subTree, indentLevel, lang, switchVar = false) {
    // end recursion
    if (subTree.type === 'Placeholder' || (subTree.type === 'InsertNode' && subTree.followElement === null)) {
      return []
    } else {
      // create the span
      let elemSpan = document.createElement('span')
      elemSpan.id = subTree.id + '-codeLine'
      // add eventlisteners for mouseover and click events
      // highlight equivalent element in struktogramm on mouseover
      elemSpan.addEventListener('mouseover', function () {
        const node = document.getElementById(subTree.id)
        node.firstChild.classList.add('highlight')
      })
      elemSpan.addEventListener('mouseout', function () {
        const node = document.getElementById(subTree.id)
        node.firstChild.classList.remove('highlight')
      })
      // switch to edit mode of equivalent element in the struktogramm
      let text = this.createHighlightedSpan(subTree.text)
      text.classList.add('hand')
      text.addEventListener('click', () => this.presenter.switchEditState(subTree.id))

      switch (subTree.type) {
        case 'InsertNode':
          return this.transformToCode(subTree.followElement, indentLevel, lang)
        case 'InputNode':
          const inputPre = document.createElement('span')
          inputPre.classList.add('keyword')
          inputPre.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].InputNode.pre))
          elemSpan.appendChild(inputPre)
          elemSpan.appendChild(text)
          const inputPost = document.createElement('span')
          inputPost.classList.add('keyword')
          inputPost.appendChild(document.createTextNode(this.translationMap[lang].InputNode.post))
          elemSpan.appendChild(inputPost)
          return [elemSpan].concat(this.transformToCode(subTree.followElement, indentLevel, lang))
        case 'OutputNode':
          const outputPre = document.createElement('span')
          outputPre.classList.add('keyword')
          outputPre.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].OutputNode.pre))
          elemSpan.appendChild(outputPre)
          elemSpan.appendChild(text)
          const outputPost = document.createElement('span')
          outputPost.classList.add('keyword')
          outputPost.appendChild(document.createTextNode(this.translationMap[lang].OutputNode.post))
          elemSpan.appendChild(outputPost)
          return [elemSpan].concat(this.transformToCode(subTree.followElement, indentLevel, lang))
        case 'TaskNode':
          const taskPre = document.createElement('span')
          taskPre.classList.add('keyword')
          taskPre.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].TaskNode.pre))
          elemSpan.appendChild(taskPre)
          elemSpan.appendChild(text)
          const taskPost = document.createElement('span')
          taskPost.classList.add('keyword')
          taskPost.appendChild(document.createTextNode(this.translationMap[lang].TaskNode.post))
          elemSpan.appendChild(taskPost)
          return [elemSpan].concat(this.transformToCode(subTree.followElement, indentLevel, lang))
        case 'BranchNode':
        {
          const branchHeaderPre = document.createElement('span')
          branchHeaderPre.classList.add('keyword')
          branchHeaderPre.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].BranchNode.pre))
          elemSpan.appendChild(branchHeaderPre)
          elemSpan.appendChild(text)
          const branchHeaderPost = document.createElement('span')
          branchHeaderPost.classList.add('keyword')
          branchHeaderPost.appendChild(document.createTextNode(this.translationMap[lang].BranchNode.post))
          elemSpan.appendChild(branchHeaderPost)
          let branch = [elemSpan]
          if (this.translationMap[lang].leftBracket !== '') {
            let leftBracket = document.createElement('span')
            leftBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].leftBracket + '\n'))
            branch.push(leftBracket)
          }
          let trueContent = this.transformToCode(subTree.trueChild, indentLevel + 1, lang)
          let falseContent = this.transformToCode(subTree.falseChild, indentLevel + 1, lang)
          branch = branch.concat(trueContent)
          if (falseContent.length > 0) {
            let between = document.createElement('span')
            between.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].BranchNode.between))
            branch.push(between)
          }
          branch = branch.concat(falseContent)
          if (this.translationMap[lang].rightBracket !== '') {
            let rightBracket = document.createElement('span')
            rightBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].rightBracket + '\n'))
            branch.push(rightBracket)
          }
          return branch.concat(this.transformToCode(subTree.followElement, indentLevel, lang))
        }
        case 'CountLoopNode':
        {
          const loopHeaderPre = document.createElement('span')
          loopHeaderPre.classList.add('keyword')
          loopHeaderPre.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].CountLoopNode.pre))
          elemSpan.appendChild(loopHeaderPre)
          elemSpan.appendChild(text)
          const loopHeaderPost = document.createElement('span')
          loopHeaderPost.classList.add('keyword')
          loopHeaderPost.appendChild(document.createTextNode(this.translationMap[lang].CountLoopNode.post))
          elemSpan.appendChild(loopHeaderPost)
          let loop = [elemSpan]
          if (this.translationMap[lang].leftBracket !== '') {
            let leftBracket = document.createElement('span')
            leftBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].leftBracket + '\n'))
            loop.push(leftBracket)
          }
          loop = loop.concat(this.transformToCode(subTree.child, indentLevel + 1, lang))
          if (this.translationMap[lang].rightBracket !== '') {
            let rightBracket = document.createElement('span')
            rightBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].rightBracket + '\n'))
            loop.push(rightBracket)
          }
          return loop.concat(this.transformToCode(subTree.followElement, indentLevel, lang))
        }
        case 'HeadLoopNode':
        {
          const loopHeaderPre = document.createElement('span')
          loopHeaderPre.classList.add('keyword')
          loopHeaderPre.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].HeadLoopNode.pre))
          elemSpan.appendChild(loopHeaderPre)
          elemSpan.appendChild(text)
          const loopHeaderPost = document.createElement('span')
          loopHeaderPost.classList.add('keyword')
          loopHeaderPost.appendChild(document.createTextNode(this.translationMap[lang].HeadLoopNode.post))
          elemSpan.appendChild(loopHeaderPost)
          let loop = [elemSpan]
          if (this.translationMap[lang].leftBracket !== '') {
            let leftBracket = document.createElement('span')
            leftBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].leftBracket + '\n'))
            loop.push(leftBracket)
          }
          loop = loop.concat(this.transformToCode(subTree.child, indentLevel + 1, lang))
          if (this.translationMap[lang].rightBracket !== '') {
            let rightBracket = document.createElement('span')
            rightBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].rightBracket + '\n'))
            loop.push(rightBracket)
          }
          return loop.concat(this.transformToCode(subTree.followElement, indentLevel, lang))
        }
        case 'FootLoopNode':
        {
          const loopContent = document.createElement('span')
          loopContent.classList.add('keyword')
          loopContent.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].FootLoopNode.pre))
          elemSpan.appendChild(loopContent)
          let loop = [elemSpan]
          if (this.translationMap[lang].leftBracket !== '') {
            let leftBracket = document.createElement('span')
            leftBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].leftBracket + '\n'))
            loop.push(leftBracket)
          }
          let child = this.transformToCode(subTree.child, indentLevel + 1, lang)
          loop = loop.concat(child)
          if (this.translationMap[lang].rightBracket !== '') {
            let rightBracket = document.createElement('span')
            rightBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].rightBracket + '\n'))
            loop.push(rightBracket)
          }
          let subContent = document.createElement('span')
          subContent.id = subTree.id + '-codeLine'
          elemSpan.id = ''
          const subContentPre = document.createElement('span')
          subContentPre.classList.add('keyword')
          subContentPre.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].FootLoopNode.pre))
          subContent.appendChild(subContentPre)
          subContent.appendChild(text)
          const subContentPost = document.createElement('span')
          subContentPost.classList.add('keyword')
          subContentPost.appendChild(document.createTextNode(this.translationMap[lang].FootLoopNode.post))
          subContent.appendChild(subContentPost)
          subContent.addEventListener('mouseover', function () {
            const node = document.getElementById(subTree.id)
            node.firstChild.classList.add('highlight')
          })
          subContent.addEventListener('mouseout', function () {
            const node = document.getElementById(subTree.id)
            node.firstChild.classList.remove('highlight')
          })
          loop.push(subContent)

          return loop.concat(this.transformToCode(subTree.followElement, indentLevel, lang))
        }
        case 'FunctionNode':
        {
          const functionContent = document.createElement('span')
          functionContent.classList.add('keyword')
          functionContent.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].FunctionNode.pre))
          elemSpan.appendChild(functionContent)
          elemSpan.appendChild(text)
          const funcHeaderBetween = document.createElement('span')
          funcHeaderBetween.classList.add('keyword')
          funcHeaderBetween.appendChild(document.createTextNode(this.translationMap[lang].FunctionNode.between))
          elemSpan.appendChild(funcHeaderBetween)

          // add parameters
          const params = subTree.parameters
          let parCount = 0
          for (const par of params) {
            if (parCount !== 0) {
              elemSpan.appendChild(this.createHighlightedSpan(', '))
            }
            const paramName = this.createHighlightedSpan(par.parName)
            paramName.classList.add('hand')
            // mapping the stored positions (0, 3, 6, ...) to new positions (0, 2, 4, ...)
            paramName.addEventListener('click', () => this.presenter.switchEditState(subTree.id, (par.pos / 3 * 2)))
            elemSpan.appendChild(paramName)
            parCount += 1
          }

          const funcHeaderPost = document.createElement('span')
          funcHeaderPost.classList.add('keyword')
          funcHeaderPost.appendChild(document.createTextNode(this.translationMap[lang].FunctionNode.post))
          elemSpan.appendChild(funcHeaderPost)
          let loop = [elemSpan]
          if (this.translationMap[lang].leftBracket !== '') {
            let leftBracket = document.createElement('span')
            leftBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].leftBracket + '\n'))
            loop.push(leftBracket)
          }
          loop = loop.concat(this.transformToCode(subTree.child, indentLevel + 1, lang))
          if (this.translationMap[lang].rightBracket !== '') {
            let rightBracket = document.createElement('span')
            rightBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].rightBracket + '\n'))
            loop.push(rightBracket)
          }
          return loop.concat(this.transformToCode(subTree.followElement, indentLevel, lang))
        }
        case 'CaseNode':
        {
          if (!this.translationMap[lang].pseudoSwitch) {
            const caseHeadPre = document.createElement('span')
            caseHeadPre.classList.add('keyword')
            caseHeadPre.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].CaseNode.pre))
            elemSpan.appendChild(caseHeadPre)
            elemSpan.appendChild(text)

            const caseHeadPost = document.createElement('span')
            caseHeadPost.classList.add('keyword')
            caseHeadPost.appendChild(document.createTextNode(this.translationMap[lang].CaseNode.post))
            elemSpan.appendChild(caseHeadPost)
          }
          let cases = [elemSpan]
          if (this.translationMap[lang].pseudoSwitch) {
            cases = []
          }
          if (this.translationMap[lang].leftBracket !== '') {
            let leftBracket = document.createElement('span')
            leftBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].leftBracket + '\n'))
            cases.push(leftBracket)
          }
          for (const element of subTree.cases) {
            if (this.translationMap[lang].pseudoSwitch) {
              const switchVarSpan = this.createHighlightedSpan(subTree.text)
              switchVarSpan.classList.add('hand')
              switchVarSpan.addEventListener('click', () => this.presenter.switchEditState(subTree.id))
              cases = cases.concat(this.transformToCode(element, indentLevel, lang, switchVarSpan))
            } else {
              cases = cases.concat(this.transformToCode(element, indentLevel + 1, lang))
            }
          }
          if (this.translationMap[lang].pseudoSwitch) {
            cases[0].firstChild.innerText = 'if '
          }
          if (subTree.defaultOn) {
            let defaultCase = document.createElement('span')
            defaultCase.classList.add('keyword')
            defaultCase.id = subTree.defaultNode.id + '-codeLine'
            if (this.translationMap[lang].pseudoSwitch) {
              defaultCase.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].InsertCase.preDefault + this.translationMap[lang].InsertCase.post))
            } else {
              defaultCase.appendChild(document.createTextNode(this.addIndentations(indentLevel + 1) + this.translationMap[lang].InsertCase.preDefault + this.translationMap[lang].InsertCase.post))
            }
            defaultCase.addEventListener('mouseover', function () {
              const node = document.getElementById(subTree.defaultNode.id)
              node.firstChild.classList.add('highlight')
            })
            defaultCase.addEventListener('mouseout', function () {
              const node = document.getElementById(subTree.defaultNode.id)
              node.firstChild.classList.remove('highlight')
            })
            cases.push(defaultCase)
            if (this.translationMap[lang].pseudoSwitch) {
              cases = cases.concat(this.transformToCode(subTree.defaultNode.followElement, indentLevel + 1, lang))
            } else {
              cases = cases.concat(this.transformToCode(subTree.defaultNode.followElement, indentLevel + 2, lang))
            }
          }
          if (this.translationMap[lang].rightBracket !== '') {
            let rightBracket = document.createElement('span')
            rightBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].rightBracket + '\n'))
            cases.push(rightBracket)
          }
          return cases.concat(this.transformToCode(subTree.followElement, indentLevel, lang))
        }
        case 'InsertCase':
        {
          const casePre = document.createElement('span')
          casePre.classList.add('keyword')
          casePre.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].InsertCase.preNormal))
          elemSpan.appendChild(casePre)
          if (switchVar) {
            elemSpan.appendChild(switchVar)
            const equals = document.createElement('span')
            equals.appendChild(document.createTextNode(' == '))
            elemSpan.appendChild(equals)
          }
          elemSpan.appendChild(text)
          const casePost = document.createElement('span')
          casePost.classList.add('keyword')
          casePost.appendChild(document.createTextNode(this.translationMap[lang].InsertCase.post))
          elemSpan.appendChild(casePost)
          let content = [elemSpan]
          content = content.concat(this.transformToCode(subTree.followElement, indentLevel + 1, lang))

          if (!this.translationMap[lang].pseudoSwitch) {
            let endContent = document.createElement('span')
            endContent.classList.add('keyword')
            endContent.appendChild(document.createTextNode(this.addIndentations(indentLevel + 1) + this.translationMap[lang].InsertCase.postpost))
            content.push(endContent)
          }
          return content
        }
      }
    }
  }

  /**
     * Get the currently selected code language
     */
  prepareTransforming () {
    var lang = document.getElementById('SourcecodeSelect').value
    // start the transformation
    presenter.startTransforming(lang)
  }

  /**
     * Toggle the state of the sourcecode display button
     *
     * @param   buttonId   id of the sourcecode display toggle button
     */
  displaySourcecode (buttonClass) {
    const fields = document.getElementsByClassName(buttonClass)
    if (this.presenter.getSourcecodeDisplay()) {
      for (const item of fields) {
        item.setAttribute('data-tooltip', 'Quellcode ausblenden')
      }
      document.getElementById('SourcecodeDisplay').style.display = 'block'
    } else {
      for (const item of fields) {
        item.setAttribute('data-tooltip', 'Quellcode einblenden')
      }
      document.getElementById('SourcecodeDisplay').style.display = 'none'
    }
  }
}
