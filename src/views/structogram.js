export class Structogram {
    constructor(presenter, domRoot) {
        this.presenter = presenter;
        this.domRoot = domRoot;
        this.size = 7;
        this.buttonList = [{
            id: 'InputButton',
            text: 'Eingabe-Feld',
            icon: 'taskIcon'
        },{
            id: 'OutputButton',
            text: 'Ausgabe-Feld',
            icon: 'taskIcon'
        },{
            id: 'TaskButton',
            text: 'Anweisung',
            icon: 'taskIcon'
        },{
            id: 'CountLoopButton',
            text: 'Zählergesteuerte Schleife',
            icon: 'countLoopIcon'
        },{
            id: 'HeadLoopButton',
            text: 'Kopfgesteuerte Schleife',
            icon: 'countLoopIcon'
        },{
            id: 'FootLoopButton',
            text: 'Fußgesteuerte Schleife',
            icon: 'footLoopIcon'
        },{
            id: 'BranchButton',
            text: 'Verzweigung',
            icon: 'branchIcon'
        },{
            id: 'CaseButton',
            text: 'Fallunterscheidung',
            icon: 'caseIcon'
        }];

        this.preRender();
    }


    preRender() {
        let divInsert = document.createElement('div');
        divInsert.classList.add('columnEditorFull');
        let divHeader = document.createElement('div');
        //divHeader.classList.add('elementButtonColumns');
        let spanHeader = document.createElement('strong');
        spanHeader.classList.add('margin-small');
        spanHeader.appendChild(document.createTextNode('Element wählen:'));
        divHeader.appendChild(spanHeader);
        divInsert.appendChild(divHeader);

        let divButtons = document.createElement('div');
        divButtons.classList.add('container');
        for (const item of this.buttonList) {
            divButtons.appendChild(this.createButton(item));
        }
        divInsert.appendChild(divButtons);

        let divEditorHeadline = document.createElement('div');
        divEditorHeadline.classList.add('columnEditorFull');
        let editorHeadline = document.createElement('strong');
        editorHeadline.classList.add('margin-small');
        editorHeadline.appendChild(document.createTextNode('Editor:'));
        divEditorHeadline.appendChild(editorHeadline);

        let divWorkingArea = document.createElement('div');
        divWorkingArea.classList.add('columnEditorStructogram');
        //divWorkingArea.classList.add('col-' + this.size);
        divWorkingArea.id = 'Sizelimiter';
        // dirty workaround
        divWorkingArea.innerHTML = `<div class="frameLeftRight">
                                        <div id="structogram" class="frameBottom"></div>
                                    </div>`;

        this.domRoot.prepend(divWorkingArea);
        this.domRoot.prepend(divEditorHeadline);
        this.domRoot.prepend(divInsert);
        this.domRoot = document.getElementById('structogram');

        // add option buttons
        // let sizeButtons = document.createElement('div');
        // //sizeButtons.classList.add('column', 'col-auto', 'hide-md');
        // let sizeText = document.createElement('span');
        // sizeText.appendChild(document.createTextNode('Breite ändern:'));
        // let sizeDecrease = document.createElement('button');
        // //sizeDecrease.classList.add('btn', 'cubic');
        // sizeDecrease.addEventListener('click', () => this.decreaseSize());
        // sizeDecrease.appendChild(document.createTextNode('-'));
        // let sizeIncrease = document.createElement('button');
        // //sizeIncrease.classList.add('btn', 'cubic');
        // sizeIncrease.addEventListener('click', () => this.increaseSize());
        // sizeIncrease.appendChild(document.createTextNode('+'));

        // sizeButtons.appendChild(sizeText);
        // sizeButtons.appendChild(document.createTextNode(' '));
        // sizeButtons.appendChild(sizeDecrease);
        // sizeButtons.appendChild(document.createTextNode(' '));
        // sizeButtons.appendChild(sizeIncrease);
        // document.getElementById('optionButtons').appendChild(sizeButtons);
    }

    createButton(button) {
        let div = document.createElement('div');
        div.classList.add('columnInput', 'insertButton');
        //let anker = document.createElement('a');
        div.classList.add('hand');
        //anker.style.height = '3em';
        div.id = button.id;
        div.draggable = 'true';
        div.addEventListener('click', (event) => this.presenter.insertNode(button.id, event));
        div.addEventListener('dragstart', (event) => this.presenter.insertNode(button.id, event));
        div.addEventListener('dragend', () => this.presenter.resetDrop());
        let spanText = document.createElement('span');
        spanText.appendChild(document.createTextNode(button.text));
        let divIcon = document.createElement('div');
        divIcon.classList.add(button.icon, 'buttonLogo');
        //divIcon.classList.add('p-centered');

        div.append(divIcon);
        div.append(spanText);
        //div.appendChild(anker);
        return div
    }

    render(tree) {
        // remove content
        while (this.domRoot.hasChildNodes()) {
            this.domRoot.removeChild(this.domRoot.lastChild);
        }
        //this.domRoot.appendChild(this.prepareRenderTree(tree, false, false));
        for (const elem of this.renderElement(tree, false, false)) {
            this.domRoot.appendChild(elem);
        }
    }


    renderElement(subTree, parentIsMoving, noInsert) {
        let elemArray = [];
        if (subTree === null) {
            return elemArray;
        } else {
            if (!(this.presenter.getMoveId() === null) && subTree.id == this.presenter.getMoveId()) {
                parentIsMoving = true;
                noInsert = true;
            }

            const background = document.createElement('div');
            background.classList.add('vcontainer', 'columnAuto');
            const container = document.createElement('div');
            if (subTree.id) {
                container.id = subTree.id;
            }
            container.classList.add('vcontainer', 'frameTop', 'columnAuto');
            //const element = document.createElement('div');
            //element.classList.add('column', 'vcontainer', 'frameTop');
            //container.appendChild(element);

            switch (subTree.type) {
            case 'InsertNode':
                {
                    if (parentIsMoving) {
                        return this.renderElement(subTree.followElement, false, false);
                    } else {
                        if (noInsert) {
                            return this.renderElement(subTree.followElement, false, true);
                        } else {
                            if (this.presenter.getInsertMode()) {
                                //container.classList.add('line');
                                const div = document.createElement('div');
                                div.classList.add('container', 'fixedHalfHeight', 'symbol', 'hand', 'text-center');
                                div.addEventListener('dragover', function(event) {
                                    event.preventDefault();
                                });
                                div.addEventListener('drop', () => this.presenter.appendElement(subTree.id));
                                div.addEventListener('click', () => this.presenter.appendElement(subTree.id));

                                if (this.presenter.getMoveId() && subTree.followElement && subTree.followElement.id == this.presenter.getMoveId()) {
                                    const bold = document.createElement('strong');
                                    bold.appendChild(document.createTextNode('Verschieben abbrechen'));
                                    div.appendChild(bold);
                                } else {
                                    const symbol = document.createElement('div');
                                    symbol.classList.add('insertIcon', 'symbolHeight');
                                    div.appendChild(symbol);
                                }
                                container.appendChild(div);
                                elemArray.push(container);

                                if (subTree.followElement === null || subTree.followElement.type == 'Placeholder') {
                                    return elemArray;
                                } else {
                                    return elemArray.concat(this.renderElement(subTree.followElement, false, noInsert));
                                }
                            } else {
                                return this.renderElement(subTree.followElement, parentIsMoving, noInsert);
                            }
                        }
                    }
                }
                break;
            case 'Placeholder':
                {
                    const div = document.createElement('div');
                    div.classList.add('container', 'fixedHeight');
                    const symbol = document.createElement('div');
                    symbol.classList.add('placeholder', 'symbolHeight', 'symbol');
                    div.appendChild(symbol);
                    container.appendChild(div);
                    elemArray.push(container);
                    return elemArray;
                }
                break;
            case 'InsertCase':
                {
                    container.classList.remove('frameTop', 'columnAuto');
                    container.classList.add('fixedHeight');
                }
            case 'InputNode':
            case 'OutputNode':
            case 'TaskNode':
                {
                    const div = document.createElement('div');
                    div.classList.add('fixedHeight', 'container');

                    const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id);
                    const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
                    div.appendChild(textDiv);
                    div.appendChild(optionDiv);

                    //container.classList.add('line');
                    container.appendChild(div);
                    elemArray.push(container);

                    return elemArray.concat(this.renderElement(subTree.followElement, parentIsMoving, noInsert));
                }
                break;
            case 'BranchNode':
                {
                    // //container.classList.add('fix');
                    const div = document.createElement('div');
                    div.classList.add('columnAuto', 'vcontainer');

                    const divHead = document.createElement('div');
                    divHead.classList.add('branchSplit', 'vcontainer', 'fixedDoubleHeight');

                    const divHeadTop = document.createElement('div');
                    divHeadTop.classList.add('fixedHeight', 'container');

                    const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id);
                    const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
                    divHeadTop.appendChild(textDiv);
                    divHeadTop.appendChild(optionDiv);

                    const divHeadBottom = document.createElement('div');
                    divHeadBottom.classList.add('fixedHeight', 'container', 'padding');

                    const divHeaderTrue = document.createElement('div');
                    divHeaderTrue.classList.add('columnAuto', 'text-left', 'bottomHeader');
                    divHeaderTrue.appendChild(document.createTextNode("Wahr"));

                    const divHeaderFalse = document.createElement('div');
                    divHeaderFalse.classList.add('columnAuto', 'text-right', 'bottomHeader');
                    divHeaderFalse.appendChild(document.createTextNode("Falsch"));

                    divHeadBottom.appendChild(divHeaderTrue);
                    divHeadBottom.appendChild(divHeaderFalse);

                    divHead.appendChild(divHeadTop);
                    divHead.appendChild(divHeadBottom);
                    div.appendChild(divHead);

                    const divChildren = document.createElement('div');
                    divChildren.classList.add('columnAuto', 'branchCenter', 'container');

                    const divTrue = document.createElement('div');
                    divTrue.classList.add('columnAuto', 'vcontainer', 'ov-hidden');
                    for (const elem of this.renderElement(subTree.trueChild, false, noInsert)) {
                        divTrue.appendChild(elem);
                    }

                    const divFalse = document.createElement('div');
                    divFalse.classList.add('columnAuto', 'vcontainer', 'ov-hidden');
                    for (const elem of this.renderElement(subTree.falseChild, false, noInsert)) {
                        divFalse.appendChild(elem);
                    }

                    divChildren.appendChild(divTrue);
                    divChildren.appendChild(divFalse);
                    div.appendChild(divChildren);
                    container.appendChild(div);
                    elemArray.push(container);

                    return elemArray.concat(this.renderElement(subTree.followElement, parentIsMoving, noInsert));
                }
            case 'HeadLoopNode':
            case 'CountLoopNode':
                {
                    const div = document.createElement('div');
                    div.classList.add('columnAuto', 'vcontainer');

                    const divHead = document.createElement('div');
                    divHead.classList.add('container', 'fixedHeight');

                    const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id);
                    const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
                    divHead.appendChild(textDiv);
                    divHead.appendChild(optionDiv);
                    div.appendChild(divHead);

                    const divChild = document.createElement('div');
                    divChild.classList.add('columnAuto', 'container', 'loopShift');

                    const divLoop = document.createElement('div');
                    divLoop.classList.add('loopWidth', 'frameLeft', 'vcontainer');

                    for (const elem of this.renderElement(subTree.child, false, noInsert)) {
                        divLoop.appendChild(elem);
                    }

                    divChild.appendChild(divLoop);
                    div.appendChild(divChild);
                    container.appendChild(div);
                    elemArray.push(container);

                    return elemArray.concat(this.renderElement(subTree.followElement, parentIsMoving, noInsert));
                }
            case 'FootLoopNode':
                {
                    const div = document.createElement('div');
                    div.classList.add('columnAuto', 'vcontainer');

                    const divChild = document.createElement('div');
                    divChild.classList.add('columnAuto', 'container', 'loopShift');

                    const divLoop = document.createElement('div');
                    divLoop.classList.add('loopWidth', 'frameLeftBottom', 'vcontainer');

                    for (const elem of this.renderElement(subTree.child, false, noInsert)) {
                        divLoop.appendChild(elem);
                    }

                    divChild.appendChild(divLoop);
                    div.appendChild(divChild);

                    const divFoot = document.createElement('div');
                    divFoot.classList.add('container', 'fixedHeight');

                    const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id);
                    const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
                    divFoot.appendChild(textDiv);
                    divFoot.appendChild(optionDiv);
                    div.appendChild(divFoot);

                    container.appendChild(div);
                    elemArray.push(container);

                    return elemArray.concat(this.renderElement(subTree.followElement, parentIsMoving, noInsert));
                }
            case 'CaseNode':
                {
                    const div = document.createElement('div');
                    div.classList.add('columnAuto', 'vcontainer');

                    const divHead = document.createElement('div');
                    divHead.classList.add('vcontainer', 'fixedHeight');
                    if (subTree.defaultOn) {
                        divHead.classList.add('caseHead-' + subTree.cases.length);
                    } else {
                        divHead.classList.add('caseHead-noDefault-' + subTree.cases.length);
                    }

                    let nrCases = subTree.cases.length;
                    if (!subTree.defaultOn) {
                        nrCases = nrCases + 2;
                    }
                    const textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id, nrCases);
                    const optionDiv = this.createOptionDiv(subTree.type, subTree.id);
                    divHead.appendChild(textDiv);
                    divHead.appendChild(optionDiv);
                    div.appendChild(divHead);

                    const divChildren = document.createElement('div');
                    divChildren.classList.add('columnAuto', 'container');
                    if (subTree.defaultOn) {
                        divChildren.classList.add('caseBody-' + subTree.cases.length);
                    } else {
                        const level = subTree.cases.length - 1;
                        divChildren.classList.add('caseBody-' + level);
                    }

                    for (const caseElem of subTree.cases) {
                        let divCase = document.createElement('div');
                        divCase.classList.add('columnAuto', 'vcontainer', 'ov-hidden');

                        for (const elem of this.renderElement(caseElem, false, noInsert)) {
                            divCase.appendChild(elem);
                        }
                        divChildren.appendChild(divCase);
                    }

                    if (subTree.defaultOn) {
                        let divCase = document.createElement('div');
                        divCase.classList.add('columnAuto', 'vcontainer', 'ov-hidden');
                        for (const elem of this.renderElement(subTree.defaultNode, false, noInsert)) {
                            divCase.appendChild(elem);
                        }
                        divChildren.appendChild(divCase);
                    }

                    div.appendChild(divChildren);
                    container.appendChild(div);
                    elemArray.push(container);

                    return elemArray.concat(this.renderElement(subTree.followElement, parentIsMoving, noInsert));
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
            document.getElementById(button.id).classList.remove('btn-primary');
        }
    }


    /**
     * Increase the size of the working area
     */
    increaseSize() {
        // only allow a max size of ten (flexbox)
        if (this.size < 10) {
            let element = document.getElementById('Sizelimiter');
            element.classList.remove('col-' + this.size);
            this.size = this.size + 1;
            element.classList.add('col-' + this.size);
        }
    }


    /**
     * Decrease the size of the working area
     */
    decreaseSize() {
        // only allow a minimal size of 6 (flexbox)
        if (this.size > 6) {
            var element = document.getElementById('Sizelimiter');
            element.classList.remove('col-' + this.size);
            this.size = this.size - 1;
            element.classList.add('col-' + this.size);
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
    addCssWrapper(div, inserting, moving) {
        let innerDiv = document.createElement('div');
        innerDiv.classList.add('column');
        innerDiv.classList.add('col-12');
        innerDiv.classList.add('lineTop');

        let box = document.createElement('div');
        box.classList.add('row');

        // element is a InsertNode
        if (inserting) {
            box.classList.add('bg-secondary');
            box.classList.add('simpleBorder');
        }
        // element is original InsertNode while moving a block
        if (moving) {
            box.classList.add('bg-primary');
            box.classList.add('simpleBorder');
        }

        innerDiv.appendChild(div);
        box.appendChild(innerDiv);

        return box
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
        let optionDiv = document.createElement('div');
        optionDiv.classList.add('optionContainer');




        // case nodes have two additional options
        if (type == 'CaseNode') {
            // add another new case
            let addingCase = document.createElement('div');
            addingCase.classList.add('addCaseIcon');
            addingCase.classList.add('optionIcon');
            addingCase.classList.add('hand');
            addingCase.classList.add('tooltip');
            addingCase.classList.add('tooltip-bottoml');
            addingCase.setAttribute('data-tooltip', 'Fall hinzufügen');
            addingCase.addEventListener('click', () => this.presenter.addCase(uid));
            optionDiv.appendChild(addingCase);

            // switch the default state option
            let switchDefault = document.createElement('div');
            switchDefault.classList.add('switchDefaultCaseIcon');
            switchDefault.classList.add('optionIcon');
            switchDefault.classList.add('hand');
            switchDefault.classList.add('tooltip');
            switchDefault.classList.add('tooltip-bottoml');
            switchDefault.setAttribute('data-tooltip', 'Sonst-Zweig schalten');
            switchDefault.addEventListener('click', () => this.presenter.switchDefaultState(uid));
            optionDiv.appendChild(switchDefault);
        }

        // all elements can be moved, except InsertCases they are bind to the case node
        if (type != 'InsertCase') {
            let moveElem = document.createElement('div');
            moveElem.classList.add('moveIcon');
            moveElem.classList.add('optionIcon');
            moveElem.classList.add('hand');
            moveElem.classList.add('tooltip');
            moveElem.classList.add('tooltip-bottoml');
            moveElem.setAttribute('data-tooltip', 'Verschieben');
            moveElem.addEventListener('click', () => this.presenter.moveElement(uid));
            optionDiv.appendChild(moveElem);
        }

        // every element can be deleted
        let deleteElem = document.createElement('div');
        deleteElem.classList.add('deleteIcon');
        deleteElem.classList.add('optionIcon');
        deleteElem.classList.add('hand');
        deleteElem.classList.add('tooltip');
        deleteElem.classList.add('tooltip-bottoml');
        deleteElem.setAttribute('data-tooltip', 'Entfernen');
        deleteElem.addEventListener('click', () => this.presenter.removeElement(uid));
        optionDiv.appendChild(deleteElem);

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
    createTextDiv(type, content, uid, nrCases = null) {
        // create the parent container
        let textDiv = document.createElement('div');
        textDiv.classList.add('columnAuto', 'symbol');

        // this div contains the hidden inputfield
        let editDiv = document.createElement('div');
        //editDiv.classList.add('column');
        //editDiv.classList.add('col-12');
        editDiv.classList.add('input-group', 'editField', 'padding');
        //editDiv.classList.add('input-inline');
        //editDiv.classList.add('editField');
        editDiv.style.display = 'none';

        if (type == 'FootLoopNode') {
            editDiv.classList.add(uid);
        }

        // inputfield with eventlisteners
        let editText = document.createElement('input');
        //editText.classList.add('form-input');
        editText.type = 'text';
        editText.value = content;
        // TODO: move to presenter
        editText.addEventListener('keyup', event => {
            if (event.keyCode == 13) {
                this.presenter.editElement(uid, editText.value);
            }
            if (event.keyCode == 27) {
                this.presenter.renderAllViews();
            }
        });

        // add apply button
        let editApply = document.createElement('div');
        editApply.classList.add('acceptIcon', 'hand');
        //editApply.classList.add('btn-primary');
        //editApply.classList.add('input-group-btn');
        //editApply.classList.add('cubic');
        //let acceptDiv = document.createElement('div');
        //acceptDiv.classList.add('acceptIcon');
        //acceptDiv.classList.add('p-centered');
        //editApply.appendChild(acceptDiv);
        editApply.addEventListener('click', () => this.presenter.editElement(uid, editText.value));

        // add dismiss button
        let editDismiss = document.createElement('div');
        //editDismiss.classList.add('squareButton');
        //editDismiss.classList.add('input-group-btn');
        //editDismiss.classList.add('cubic');
        //let dismissDiv = document.createElement('div');
        editDismiss.classList.add('deleteIcon', 'hand');
        //dismissDiv.classList.add('p-centered');
        //editDismiss.appendChild(dismissDiv);
        editDismiss.addEventListener('click', () => this.presenter.renderAllViews());

        // some types need additional text or a different position
        switch (type) {
        case 'InputNode':
            content = "E: " + content;
            break;
        case 'OutputNode':
            content = "A: " + content;
            break;
        case 'BranchNode':
        case 'InsertCase':
            textDiv.classList.add('text-center');
            break;
        }

        // add displayed text when not in editing mode
        let innerTextDiv = document.createElement('div');
        //innerTextDiv.classList.add('column');
        //innerTextDiv.classList.add('col-12');
        // special handling for the default case of case nodes
        if (!(type == 'InsertCase' && content == 'Sonst')) {
            innerTextDiv.classList.add('padding');
            if (!this.presenter.getInsertMode()) {
                innerTextDiv.classList.add('hand');
            }
            innerTextDiv.addEventListener('click', () => {
                this.presenter.renderAllViews();
                this.presenter.switchEditState(uid);
            });
        }

        // insert text
        const textSpan = document.createElement('span');
        if (type == 'CaseNode') {
            textSpan.style.marginLeft = 'calc(' + (nrCases/(nrCases+1))*100 + '% - 2em)';
        }
        let text = document.createTextNode(content);

        editDiv.appendChild(editText);
        editDiv.appendChild(editApply);
        editDiv.appendChild(editDismiss);

        textSpan.appendChild(text);
        innerTextDiv.appendChild(textSpan);
        textDiv.appendChild(innerTextDiv);
        textDiv.appendChild(editDiv);

        return textDiv
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
        if (subTree === null || subTree.type == 'InsertNode' && subTree.followElement === null && !this.presenter.getInsertMode()) {
            return document.createTextNode("")
        } else {
            // create outlining structure
            let innerDiv = document.createElement('div');
            innerDiv.classList.add('column');
            innerDiv.classList.add('col-12');

            let box = document.createElement('div');
            box.classList.add('columns');
            if (subTree.type != 'InsertCase') {
                box.classList.add('lineTop');
            }
            // render every element and append it to the outlining structure
            this.renderTree(subTree, parentIsMoving, noInsert).forEach(function(childElement) {
                innerDiv.appendChild(childElement);
            });
            box.appendChild(innerDiv);

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
    renderTree(subTree, parentIsMoving, noInsert) {
        if (subTree === null) {
            return []
        } else {
            if (!(this.presenter.getMoveId() === null) && subTree.id == this.presenter.getMoveId()) {
                parentIsMoving = true;
                noInsert = true;
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
                                let div = document.createElement('div');
                                div.id = subTree.id;
                                //div.classList.add('c-hand');
                                //div.classList.add('text-center');
                                div.addEventListener('dragover', function(event) {
                                    event.preventDefault();
                                });
                                div.addEventListener('drop', () => this.presenter.appendElement(subTree.id));
                                div.addEventListener('click', () => this.presenter.appendElement(subTree.id));
                                let text = document.createElement('div');
                                if (this.presenter.getMoveId() && subTree.followElement && subTree.followElement.id == this.presenter.getMoveId()) {
                                    let bold = document.createElement('strong');
                                    bold.appendChild(document.createTextNode('Verschieben abbrechen'));
                                    text.appendChild(bold);
                                } else {
                                    text.classList.add('insertIcon');
                                }
                                //text.classList.add('p-centered');
                                div.appendChild(text);
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
                break;

            case 'Placeholder':
                {
                    if (this.presenter.getInsertMode()) {
                        return []
                    } else {
                        let div = document.createElement('div');
                        div.classList.add('text-center');
                        let text = document.createElement('div');
                        text.classList.add('emptyStateIcon');
                        text.classList.add('p-centered');
                        div.appendChild(text);
                        return [div]
                    }
                }
                break;

            case 'InputNode':
            case 'OutputNode':
            case 'TaskNode':
                {
                    let div = document.createElement('div');
                    div.id = subTree.id;
                    div.classList.add('columns');
                    div.classList.add('element');

                    let textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id);
                    let optionDiv = this.createOptionDiv(subTree.type, subTree.id);
                    div.appendChild(textDiv);
                    div.appendChild(optionDiv);

                    return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
                }
                break;

            case 'BranchNode':
                {
                    let div = document.createElement('div');
                    div.id = subTree.id;

                    let divHead = document.createElement('div');
                    divHead.classList.add('columns');
                    divHead.classList.add('element');
                    divHead.classList.add('stBranch');

                    let textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id);
                    let optionDiv = this.createOptionDiv(subTree.type, subTree.id);

                    let bufferDiv = document.createElement('div');
                    bufferDiv.classList.add('column');
                    bufferDiv.classList.add('col-1');

                    divHead.appendChild(bufferDiv);
                    divHead.appendChild(textDiv);
                    divHead.appendChild(optionDiv);

                    let divPreSubHeader = document.createElement('div');
                    divPreSubHeader.classList.add('column');
                    divPreSubHeader.classList.add('col-12');

                    let divSubHeader = document.createElement('div');
                    divSubHeader.classList.add('columns');

                    let divSubHeaderTrue = document.createElement('div');
                    divSubHeaderTrue.classList.add('column');
                    divSubHeaderTrue.classList.add('col-6');
                    divSubHeaderTrue.appendChild(document.createTextNode("Wahr"));

                    let divSubHeaderFalse = document.createElement('div');
                    divSubHeaderFalse.classList.add('column');
                    divSubHeaderFalse.classList.add('col-6');
                    divSubHeaderFalse.classList.add('text-right');
                    divSubHeaderFalse.appendChild(document.createTextNode("Falsch"));

                    divSubHeader.appendChild(divSubHeaderTrue);
                    divSubHeader.appendChild(divSubHeaderFalse);
                    divPreSubHeader.appendChild(divSubHeader);
                    divHead.appendChild(divPreSubHeader);

                    let divTrue = document.createElement('div');
                    divTrue.classList.add('column');
                    divTrue.classList.add('col-6');
                    divTrue.appendChild(this.prepareRenderTree(subTree.trueChild, false, noInsert));

                    let divFalse = document.createElement('div');
                    divFalse.classList.add('column');
                    divFalse.classList.add('col-6');
                    divFalse.appendChild(this.prepareRenderTree(subTree.falseChild, false, noInsert));

                    let divChildren = document.createElement('div');
                    divChildren.classList.add('columns');
                    divChildren.classList.add('middleBranch');
                    divChildren.appendChild(divTrue);
                    divChildren.appendChild(divFalse);

                    div.appendChild(divHead);
                    div.appendChild(divChildren);

                    return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
                }
                break;

            case 'HeadLoopNode':
            case 'CountLoopNode':
                {
                    let div = document.createElement('div');
                    div.id = subTree.id;

                    let divHead = document.createElement('div');
                    divHead.classList.add('columns');
                    divHead.classList.add('element');

                    let textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id);
                    let optionDiv = this.createOptionDiv(subTree.type, subTree.id);
                    divHead.appendChild(textDiv);
                    divHead.appendChild(optionDiv);

                    let divLoopSubSub = document.createElement('div');
                    divLoopSubSub.classList.add('column');
                    divLoopSubSub.classList.add('col-12');
                    divLoopSubSub.appendChild(this.prepareRenderTree(subTree.child, false, noInsert));
                    let divLoopSub = document.createElement('div');
                    divLoopSub.classList.add('columns');
                    divLoopSub.appendChild(divLoopSubSub);

                    let divLoop = document.createElement('div');
                    divLoop.classList.add('column');
                    divLoop.classList.add('col-11');
                    divLoop.classList.add('col-ml-auto');
                    divLoop.classList.add('lineLeft');
                    divLoop.appendChild(divLoopSub);

                    let divChild = document.createElement('div');
                    divChild.classList.add('columns');
                    divChild.appendChild(divLoop);

                    div.appendChild(divHead);
                    div.appendChild(divChild);

                    return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
                }
                break;

            case 'FootLoopNode':
                {
                    let div = document.createElement('div');
                    div.id = subTree.id;

                    let divFoot = document.createElement('div');
                    divFoot.classList.add('columns');
                    divFoot.classList.add('element');
                    divFoot.classList.add('lineTopFootLoop');

                    let textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id);
                    let optionDiv = this.createOptionDiv(subTree.type, subTree.id);
                    divFoot.appendChild(textDiv);
                    divFoot.appendChild(optionDiv);

                    let divLoop = document.createElement('div');
                    divLoop.classList.add('column');
                    divLoop.classList.add('col-11');
                    divLoop.classList.add('col-ml-auto');
                    divLoop.classList.add('lineLeft');
                    divLoop.appendChild(this.prepareRenderTree(subTree.child, false, noInsert));

                    let divChild = document.createElement('div');
                    divChild.classList.add('columns');
                    divChild.appendChild(divLoop);

                    div.appendChild(divChild);
                    div.appendChild(divFoot);

                    return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
                }
                break;

            case 'CaseNode':
                {
                    let div = document.createElement('div');
                    div.id = subTree.id;

                    let divHead = document.createElement('div');
                    divHead.classList.add('columns');
                    divHead.classList.add('element');
                    if (subTree.defaultOn) {
                        divHead.classList.add('caseHead-' + subTree.cases.length);
                    } else {
                        divHead.classList.add('caseHead-noDefault-' + subTree.cases.length);
                    }

                    let textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id);
                    let optionDiv = this.createOptionDiv(subTree.type, subTree.id);

                    let bufferDiv = document.createElement('div');
                    bufferDiv.classList.add('column');
                    bufferDiv.classList.add('col-1');

                    divHead.appendChild(bufferDiv);
                    divHead.appendChild(textDiv);
                    divHead.appendChild(optionDiv);

                    let divPreSubHeader = document.createElement('div');
                    divPreSubHeader.classList.add('column');
                    divPreSubHeader.classList.add('col-12');

                    let divChildren = document.createElement('div');
                    divChildren.classList.add('columns');
                    if (subTree.defaultOn) {
                        divChildren.classList.add('caseBody-' + subTree.cases.length);
                    } else {
                        let level = subTree.cases.length - 1;
                        divChildren.classList.add('caseBody-' + level);
                    }
                    for (const caseElem of subTree.cases) {
                        let divCase = document.createElement('div');
                        divCase.classList.add('column');
                        divCase.appendChild(this.prepareRenderTree(caseElem, false, noInsert));
                        divChildren.appendChild(divCase);
                    }

                    if (subTree.defaultOn) {
                        let divCase = document.createElement('div');
                        divCase.classList.add('column');
                        divCase.appendChild(this.prepareRenderTree(subTree.defaultNode, false, noInsert));
                        divChildren.appendChild(divCase);
                    }

                    div.appendChild(divHead);
                    div.appendChild(divChildren);

                    return [this.addCssWrapper(div, false, parentIsMoving), this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
                }
                break;

            case 'InsertCase':
                {
                    let div = document.createElement('div');
                    div.id = subTree.id;
                    div.classList.add('columns');
                    div.classList.add('element');

                    let bufferDiv = document.createElement('div');
                    bufferDiv.classList.add('column');
                    bufferDiv.classList.add('col-1');
                    let textDiv = this.createTextDiv(subTree.type, subTree.text, subTree.id);
                    let optionDiv = this.createOptionDiv(subTree.type, subTree.id);
                    div.appendChild(bufferDiv);
                    div.appendChild(textDiv);
                    div.appendChild(optionDiv);
                    return [div, this.prepareRenderTree(subTree.followElement, parentIsMoving, noInsert)]
                }
                break;

            default:
                return this.renderTree(subTree.followElement, parentIsMoving, noInsert);
            }
        }
    }

    displaySourcecode(buttonId) {}
    setLang() {}
}
