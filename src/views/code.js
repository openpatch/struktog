export class CodeView {
    constructor(presenter, domRoot) {
        this.presenter = presenter;
        this.domRoot = domRoot;
        this.lang = '--';
        this.translationMap = {
            'Python': {'untranslatable': ['FootLoopNode', 'CaseNode'],
                       'InputNode': {'pre': '',
                                     'post': " = input(\"Eingabe\")\n"
                                    },
                       'OutputNode': {'pre': "print(",
                                      'post': ")\n"
                                     },
                       'TaskNode': {'pre': '',
                                    'post': '\n'
                                   },
                       'BranchNode': {'pre': "if ",
                                      'post': ":\n",
                                      'between': "else:\n"
                                     },
                       'CountLoopNode': {'pre': "for ",
                                         'post': ":\n"
                                        },
                       'HeadLoopNode': {'pre': "while ",
                                        'post': ":\n"
                                       },
                       'leftBracket': '',
                       'rightBracket': ''
                      },
            'PHP': {'untranslatable': [],
                    'InputNode': {'pre': '',
                                  'post': " = readline(\"Eingabe\");\n"
                                 },
                    'OutputNode': {'pre': "echo ",
                                   'post': ";\n"
                                  },
                    'TaskNode': {'pre': '',
                                 'post': ';\n'
                                },
                    'BranchNode': {'pre': "if (",
                                   'post': ")\n",
                                   'between': "} else {\n"
                                  },
                    'CountLoopNode': {'pre': "for (",
                                      'post': ")\n"
                                     },
                    'HeadLoopNode': {'pre': "while (",
                                     'post': ")\n"
                                    },
                    'FootLoopNode': {'prepre': "do\n",
                                     'pre': "while (",
                                     'post': ");\n"
                                    },
                    'CaseNode': {'pre': "switch(",
                                 'post': ")\n",
                                },
                    'InsertCase': {'preNormal': "case ",
                                   'preDefault': "default",
                                   'post': ":\n",
                                   'postpost': "break;\n"
                                  },
                    'leftBracket': '{',
                    'rightBracket': '}'
                   },
            'Java': {'untranslatable': [],
                     'InputNode': {'pre': '',
                                   'post': " = System.console().readLine();\n"
                                  },
                     'OutputNode': {'pre': "System.out.println(",
                                    'post': ");\n"
                                   },
                     'TaskNode': {'pre': '',
                                  'post': ';\n'
                                 },
                     'BranchNode': {'pre': "if (",
                                    'post': ")\n",
                                    'between': "} else {\n"
                                   },
                     'CountLoopNode': {'pre': "for (",
                                       'post': ")\n"
                                      },
                     'HeadLoopNode': {'pre': "while (",
                                      'post': ")\n"
                                     },
                     'FootLoopNode': {'prepre': "do\n",
                                      'pre': "while (",
                                      'post': ");\n"
                                     },
                     'CaseNode': {'pre': "switch(",
                                  'post': ")\n",
                                 },
                     'InsertCase': {'preNormal': "case ",
                                    'preDefault': "default",
                                    'post': ":\n",
                                    'postpost': "break;\n"
                                   },
                     'leftBracket': '{',
                     'rightBracket': '}'
                    }
        }

        this.preRender();
    }


    preRender() {
        let sourcecode = document.createElement('div');
        //sourcecode.style.float = 'right';
        sourcecode.id = 'SourcecodeDisplay';
        sourcecode.classList.add('columnEditorCode');
        sourcecode.style.display = 'none';
        let sourcecodeDisplay = document.createElement('div');
        //sourcecodeDisplay.classList.add('columns', 'd-hide');
        let sourcecodeHeader = document.createElement('div');
        //sourcecodeHeader.classList.add('column', 'col-10', 'col-mx-auto');
        let sourcecodeTitle = document.createElement('span');
        sourcecodeTitle.appendChild(document.createTextNode('Übersetzen in:'));
        let sourcecodeForm = document.createElement('div');
        //sourcecodeForm.classList.add('form-group');
        let sourcecodeSelect = document.createElement('select');
        //sourcecodeSelect.classList.add('form-select');
        sourcecodeSelect.id = 'SourcecodeSelect';
        sourcecodeSelect.addEventListener('change', (event) => this.presenter.startTransforming(event));
        let sourcecodeOption = document.createElement('option');
        sourcecodeOption.value = '--';
        sourcecodeOption.appendChild(document.createTextNode('--'));
        sourcecodeSelect.appendChild(sourcecodeOption);
        for (const lang in this.translationMap) {
            const langDiv = document.createElement('option');
            langDiv.value = lang;
            langDiv.appendChild(document.createTextNode(lang));
            sourcecodeSelect.appendChild(langDiv);
        }

        sourcecodeForm.appendChild(sourcecodeSelect);
        sourcecodeHeader.appendChild(sourcecodeTitle);
        sourcecodeHeader.appendChild(sourcecodeForm);

        let sourcecodeWorkingArea = document.createElement('div');
        //sourcecodeWorkingArea.classList.add('column', 'col-12', 'lowerPadding');
        sourcecodeWorkingArea.id = 'Sourcecode';

        sourcecodeDisplay.appendChild(sourcecodeHeader);
        sourcecodeDisplay.appendChild(sourcecodeWorkingArea);
        sourcecode.appendChild(sourcecodeDisplay);

        this.domRoot.appendChild(sourcecode);
        this.domRoot = document.getElementById('Sourcecode');

        let options = document.createElement('div');
        options.classList.add('column', 'container');
        let optionButton = document.createElement('button');
        optionButton.classList.add('column');
        optionButton.id = 'ToggleSourcecode';
        optionButton.addEventListener('click', (event) => this.presenter.alterSourcecodeDisplay(event));
        optionButton.appendChild(document.createTextNode('Quellcode einblenden'));

        options.appendChild(optionButton);
        document.getElementById('optionButtons').appendChild(options);

        if (typeof(Storage) !== "undefined") {
            if ('displaySourcecode' in localStorage && 'lang' in localStorage) {
                const possibleLang = localStorage.lang;
                if (possibleLang in this.translationMap) {
                    this.lang = possibleLang;
                    sourcecodeSelect.value = this.lang;
                    this.presenter.setSourcecodeDisplay(JSON.parse(localStorage.displaySourcecode));
                    this.displaySourcecode('ToggleSourcecode');
                }
            }
        }
    }


    render(model) {
        // remove content
        while (this.domRoot.hasChildNodes()) {
            this.domRoot.removeChild(this.domRoot.lastChild);
        }

        // only translate, if some language is selected
        if (this.lang != "--") {
            // check if translation is possible with current tree
            let isTranslatable = false;
            for (const nodeType of this.translationMap[this.lang].untranslatable) {
                isTranslatable = isTranslatable || this.checkForUntranslatable(model, nodeType);
            }

            // create container for the spans
            let preBlock = document.createElement('pre');
            //preBlock.classList.add('code');
            // set the language attribute
            preBlock.setAttribute('data-lang', this.lang);

            let codeBlock = document.createElement('code');

            // start appending the translated elements
            if (!isTranslatable) {
                let content = this.transformToCode(model, 0, this.lang);
                content.forEach(function(i) {
                    codeBlock.appendChild(i);
                });
            } else {
                codeBlock.appendChild(document.createTextNode("Das Struktogramm enthält Elemente, \nwelche in der Programmiersprache nicht \nzur Verfügung stehen."));
            }

            preBlock.appendChild(codeBlock);
            this.domRoot.appendChild(preBlock);
        }
    }


    setLang(lang) {
        if (typeof(Storage) !== "undefined") {
            localStorage.lang = lang;
            localStorage.displaySourcecode = true;
        }
        this.lang = lang;
    }


    resetButtons() {}


    /**
     * Add indentations to a text element
     *
     * @param    indentLevel   number of how many levels deep the node is
     * @return   string        multiple indentations, times the level
     */
    addIndentations(indentLevel) {
        let text = "";
        let defaultIndent = "    ";
        for (let i = 0; i < indentLevel; i++) {
            text = text + defaultIndent;
        }
        return text
    }

    /**
     * Create a span with text and a highlight class
     *
     * @param    text   text to be displayed
     * @return   span   complete HTML structure with text and class
     */
    createHighlightedSpan(text) {
        let span = document.createElement('span');
        span.classList.add('text-code');
        span.appendChild(document.createTextNode(text));
        return span
    }

    /**
     * Check recursively elements if they match a given type
     *
     * @param    subTree    part of the tree with all children of current element
     * @param    nodeType   type of the translation map element to be checked against
     * @return   boolean    true, if the current element type is the given type
     */
    checkForUntranslatable(subTree, nodeType) {
        // end recursion
        if (subTree.type == 'Placeholder' || subTree.type == 'InsertNode' && subTree.followElement === null) {
            return false
        } else {
            // compare the types
            if (subTree.type == nodeType) {
                return true
            } else {
                // different recursive steps, depending on child structure
                switch (subTree.type) {
                case 'InsertNode':
                case 'InputNode':
                case 'OutputNode':
                case 'TaskNode':
                    return false || this.checkForUntranslatable(subTree.followElement, nodeType);
                    break;
                case 'BranchNode':
                    return false || this.checkForUntranslatable(subTree.trueChild, nodeType) || this.checkForUntranslatable(subTree.falseChild, nodeType) || this.checkForUntranslatable(subTree.followElement, nodeType)
                    break;
                case 'CountLoopNode':
                case 'HeadLoopNode':
                case 'FootLoopNode':
                    return false || this.checkForUntranslatable(subTree.child, nodeType) || this.checkForUntranslatable(subTree.followElement, nodeType)
                    break;
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
    transformToCode(subTree, indentLevel, lang) {
        // end recursion
        if (subTree.type == 'Placeholder' || subTree.type == 'InsertNode' && subTree.followElement === null) {
            return []
        } else {
            // create the span
            let elemSpan = document.createElement('span');
            // add eventlisteners for mouseover and click events
            // highlight equivalent element in struktogramm on mouseover
            elemSpan.addEventListener('mouseover', function() {
                let node = document.getElementById(subTree.id);
                node.firstChild.classList.add('bg-primary');
            });
            elemSpan.addEventListener('mouseout', function() {
                let node = document.getElementById(subTree.id);
                node.firstChild.classList.remove('bg-primary');
            });
            // switch to edit mode of equivalent element in the struktogramm
            let text = this.createHighlightedSpan(subTree.text);
            text.classList.add('hand');
            text.addEventListener('click', () => this.presenter.switchEditState(subTree.id));

            switch (subTree.type) {
            case 'InsertNode':
                return this.transformToCode(subTree.followElement, indentLevel, lang)
                break;
            case 'InputNode':
                elemSpan.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].InputNode.pre));
                elemSpan.appendChild(text);
                elemSpan.appendChild(document.createTextNode(this.translationMap[lang].InputNode.post));
                return [elemSpan].concat(this.transformToCode(subTree.followElement, indentLevel, lang));
                break;
            case 'OutputNode':
                elemSpan.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].OutputNode.pre));
                elemSpan.appendChild(text);
                elemSpan.appendChild(document.createTextNode(this.translationMap[lang].OutputNode.post));
                return [elemSpan].concat(this.transformToCode(subTree.followElement, indentLevel, lang));
                break;
            case 'TaskNode':
                elemSpan.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].TaskNode.pre));
                elemSpan.appendChild(text);
                elemSpan.appendChild(document.createTextNode(this.translationMap[lang].TaskNode.post));
                return [elemSpan].concat(this.transformToCode(subTree.followElement, indentLevel, lang));
                break;
            case 'BranchNode':
                {
                    let branchHeaderPre = this.addIndentations(indentLevel) + this.translationMap[lang].BranchNode.pre;
                    elemSpan.appendChild(document.createTextNode(branchHeaderPre));
                    elemSpan.appendChild(text);
                    elemSpan.appendChild(document.createTextNode(this.translationMap[lang].BranchNode.post));
                    let branch = [elemSpan];
                    if (this.translationMap[lang].leftBracket != '') {
                        let leftBracket = document.createElement('span');
                        leftBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].leftBracket + "\n"));
                        branch.push(leftBracket);
                    }
                    let trueContent = this.transformToCode(subTree.trueChild, indentLevel + 1, lang);
                    let falseContent = this.transformToCode(subTree.falseChild, indentLevel + 1, lang);
                    branch = branch.concat(trueContent);
                    if (falseContent.length > 0) {
                        let between = document.createElement('span');
                        between.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].BranchNode.between));
                        branch.push(between);
                    }
                    branch = branch.concat(falseContent);
                    if (this.translationMap[lang].rightBracket != '') {
                        let rightBracket = document.createElement('span');
                        rightBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].rightBracket + "\n"));
                        branch.push(rightBracket);
                    }
                    return branch.concat(this.transformToCode(subTree.followElement, indentLevel, lang));
                }
                break;
            case 'CountLoopNode':
                {
                    let loopHeaderPre = this.addIndentations(indentLevel) + this.translationMap[lang].CountLoopNode.pre;
                    elemSpan.appendChild(document.createTextNode(loopHeaderPre));
                    elemSpan.appendChild(text);
                    elemSpan.appendChild(document.createTextNode(this.translationMap[lang].CountLoopNode.post));
                    let loop = [elemSpan];
                    if (this.translationMap[lang].leftBracket != '') {
                        let leftBracket = document.createElement('span');
                        leftBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].leftBracket + "\n"));
                        loop.push(leftBracket);
                    }
                    loop = loop.concat(this.transformToCode(subTree.child, indentLevel + 1, lang));
                    if (this.translationMap[lang].rightBracket != '') {
                        let rightBracket = document.createElement('span');
                        rightBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].rightBracket + "\n"));
                        loop.push(rightBracket);
                    }
                    return loop.concat(this.transformToCode(subTree.followElement, indentLevel, lang));
                }
                break;
            case 'HeadLoopNode':
                {
                    let loopHeaderPre = this.addIndentations(indentLevel) + this.translationMap[lang].HeadLoopNode.pre;
                    elemSpan.appendChild(document.createTextNode(loopHeaderPre));
                    elemSpan.appendChild(text);
                    elemSpan.appendChild(document.createTextNode(this.translationMap[lang].HeadLoopNode.post));
                    let loop = [elemSpan];
                    if (this.translationMap[lang].leftBracket != '') {
                        let leftBracket = document.createElement('span');
                        leftBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].leftBracket + "\n"));
                        loop.push(leftBracket);
                    }
                    loop = loop.concat(this.transformToCode(subTree.child, indentLevel + 1, lang));
                    if (this.translationMap[lang].rightBracket != '') {
                        let rightBracket = document.createElement('span');
                        rightBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].rightBracket + "\n"));
                        loop.push(rightBracket);
                    }
                    return loop.concat(this.transformToCode(subTree.followElement, indentLevel, lang));
                }
                break;
            case 'FootLoopNode':
                {
                    let loopContent = this.addIndentations(indentLevel) + this.translationMap[lang].FootLoopNode.prepre;
                    elemSpan.appendChild(document.createTextNode(loopContent));
                    let loop = [elemSpan];
                    if (this.translationMap[lang].leftBracket != '') {
                        let leftBracket = document.createElement('span');
                        leftBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].leftBracket + "\n"));
                        loop.push(leftBracket);
                    }
                    let child = this.transformToCode(subTree.child, indentLevel + 1, lang);
                    loop = loop.concat(child);
                    if (this.translationMap[lang].rightBracket != '') {
                        let rightBracket = document.createElement('span');
                        rightBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].rightBracket + "\n"));
                        loop.push(rightBracket);
                    }
                    let subContent = document.createElement('span');
                    subContent.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].FootLoopNode.pre));
                    subContent.appendChild(text);
                    subContent.appendChild(document.createTextNode(this.translationMap[lang].FootLoopNode.post));
                    subContent.addEventListener('mouseover', function() {
                        let node = document.getElementById(subTree.id);
                        node.parentElement.parentElement.classList.add('bg-primary');
                    });
                    subContent.addEventListener('mouseout', function() {
                        let node = document.getElementById(subTree.id);
                        node.parentElement.parentElement.classList.remove('bg-primary');
                    });
                    loop.push(subContent);

                    return loop.concat(this.transformToCode(subTree.followElement, indentLevel, lang));
                }
                break;
            case 'CaseNode':
                {
                    elemSpan.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].CaseNode.pre));
                    elemSpan.appendChild(text);
                    elemSpan.appendChild(document.createTextNode(this.translationMap[lang].CaseNode.post));
                    let cases = [elemSpan];
                    if (this.translationMap[lang].leftBracket != '') {
                        let leftBracket = document.createElement('span');
                        leftBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].leftBracket + "\n"));
                        cases.push(leftBracket);
                    }
                    //subTree.cases.forEach(function(element) {
                    for (const element of subTree.cases) {
                        cases = cases.concat(this.transformToCode(element, indentLevel + 1, lang));
                    }
                    if (subTree.defaultOn) {
                        let defaultCase = document.createElement('span');
                        defaultCase.appendChild(document.createTextNode(this.addIndentations(indentLevel + 1) + this.translationMap[lang].InsertCase.preDefault + this.translationMap[lang].InsertCase.post));
                        cases.push(defaultCase);
                        cases = cases.concat(this.transformToCode(subTree.defaultNode.followElement, indentLevel + 2, lang));
                    }
                    if (this.translationMap[lang].rightBracket != '') {
                        let rightBracket = document.createElement('span');
                        rightBracket.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].rightBracket + "\n"));
                        cases.push(rightBracket);
                    }
                    return cases.concat(this.transformToCode(subTree.followElement, indentLevel, lang));
                }
                break;
            case 'InsertCase':
                {
                    elemSpan.appendChild(document.createTextNode(this.addIndentations(indentLevel) + this.translationMap[lang].InsertCase.preNormal));
                    elemSpan.appendChild(text);
                    elemSpan.appendChild(document.createTextNode(this.translationMap[lang].InsertCase.post));
                    let content = [elemSpan];
                    content = content.concat(this.transformToCode(subTree.followElement, indentLevel + 1, lang));

                    let endContent = document.createElement('span');
                    endContent.appendChild(document.createTextNode(this.addIndentations(indentLevel + 1) + this.translationMap[lang].InsertCase.postpost));
                    content.push(endContent);
                    return content;
                }
                break;
            }
        }
    }

    /**
     * Get the currently selected code language
     */
    prepareTransforming() {
        var lang = document.getElementById('SourcecodeSelect').value;
        // start the transformation
        startTransforming(lang);
    }


    /**
     * Toggle the state of the sourcecode display button
     *
     * @param   buttonId   id of the sourcecode display toggle button
     */
    displaySourcecode(buttonId) {
        if (this.presenter.getSourcecodeDisplay()) {
            document.getElementById(buttonId).textContent = "Quellcode ausblenden";
            //document.getElementById(buttonId).classList.add('btn-primary');
            document.getElementById('SourcecodeDisplay').style.display = "block";
        } else {
            document.getElementById(buttonId).textContent = "Quellcode einblenden";
            //document.getElementById(buttonId).classList.remove('btn-primary');
            document.getElementById('SourcecodeDisplay').style.display = "none";
        }
    }

}
