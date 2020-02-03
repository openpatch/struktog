import {guidGenerator} from '../helpers/generator';

export class Presenter {
    constructor(model) {
        this.model = model;
        this.insertMode = false;
        this.views = [];
        this.moveId = null;
        this.nextInsertElement = null;
        this.displaySourcecode = false;
        this.undoList = [];
        this.redoList = [];
    }


    addView(view) {
        this.views.push(view);
    }


    getInsertMode() {
        return this.insertMode;
    }


    getModelTree() {
        return this.model.getTree();
    }

    getElementByUid(uid) {
        return this.model.getElementInTree(uid, this.model.getTree());
    }

    resetButtons() {
        for (const view of this.views) {
            view.resetButtons();
        }
    }


    reset() {
        // reset the model fields connected to inserting
        this.insertMode = false;
        this.nextInsertElement = null;
        this.moveId = null;
    }


    setSourcecodeDisplay(state) {
        this.displaySourcecode = state;
    }


    getSourcecodeDisplay() {
        return this.displaySourcecode
    }


    /**
     * Update the model stored in the browser store
     */
    updateBrowserStore() {
        // check if browser supports web storage
        if (typeof(Storage) !== "undefined") {
            // update the model as stringified JSON data
            localStorage.tree = JSON.stringify(this.model.getTree());
            localStorage.displaySourcecode = this.displaySourcecode;
        }
    }


    getMoveId() {
        return this.moveId;
    }


    getNextInsertElement() {
        return this.nextInsertElement;
    }


    renderAllViews() {
        for (const view of this.views) {
            view.render(this.model.getTree());
        }
    }


    init() {
        this.renderAllViews();
    }


    /**
     * Start the tranformation of the model tree to sourcecode
     *
     * @param   lang   programming language to which the translation happens
     */
    startTransforming(event) {
        for (const view of this.views) {
            view.setLang(event.target.value);
        }
        this.renderAllViews();
    }


    /**
     * Toggle the rendering of sourcecode
     *
     * @param   buttonId   id of the sourcecode display button
     */
    alterSourcecodeDisplay(buttonId) {
        if (this.displaySourcecode) {
            this.displaySourcecode = false;
        } else {
            this.displaySourcecode = true;
        }
        this.updateBrowserStore();
        for (const view of this.views) {
            view.displaySourcecode('ToggleSourcecode');
        }
    }


    /**
     * Prepare for inserting an element
     *
     * @param   buttonId   id of the selected button
     */
    insertNode(id, event) {
        switch (id) {
        case 'InputButton':
            this.nextInsertElement = {'id': guidGenerator(),
                                      'type': 'InputNode',
                                      'text': "",
                                      'followElement': {'id': guidGenerator(),
                                                        'type': 'InsertNode',
                                                        'followElement': null
                                                       }
                                     };
            break;
        case 'OutputButton':
            this.nextInsertElement = {'id': guidGenerator(),
                                      'type': 'OutputNode',
                                      'text': "",
                                      'followElement': {'id': guidGenerator(),
                                                        'type': 'InsertNode',
                                                        'followElement': null
                                                       }
                                     };
            break;
        case 'TaskButton':
            this.nextInsertElement = {'id': guidGenerator(),
                                      'type': 'TaskNode',
                                      'text': "Anweisung",
                                      'followElement': {'id': guidGenerator(),
                                                        'type': 'InsertNode',
                                                        'followElement': null
                                                       }
                                     };
            break;
        case 'BranchButton':
            this.nextInsertElement = {'id': guidGenerator(),
                                      'type': 'BranchNode',
                                      'text': "Bedingung",
                                      'followElement': {'id': guidGenerator(),
                                                        'type': 'InsertNode',
                                                        'followElement': null
                                                       },
                                      'trueChild': {'id': guidGenerator(),
                                                    'type': 'InsertNode',
                                                    'followElement': {'type': 'Placeholder'}
                                                   },
                                      'falseChild': {'id': guidGenerator(),
                                                     'type': 'InsertNode',
                                                     'followElement': {'type': 'Placeholder'}
                                                    }
                                     };
            break;
        case 'CaseButton':
            this.nextInsertElement = {'id': guidGenerator(),
                                      'type': 'CaseNode',
                                      'text': "Variable",
                                      'followElement': {'id': guidGenerator(),
                                                        'type': 'InsertNode',
                                                        'followElement': null
                                                       },
                                      'defaultOn': true,
                                      'defaultNode': {'id': guidGenerator(),
                                                      'type': 'InsertCase',
                                                      'text': "Sonst",
                                                      'followElement': {'id': guidGenerator(),
                                                                        'type': 'InsertNode',
                                                                        'followElement': {'type': 'Placeholder'}
                                                                       }
                                                     },
                                      'cases': [{'id': guidGenerator(),
                                                 'type': 'InsertCase',
                                                 'text': "Fall",
                                                 'followElement': {'id': guidGenerator(),
                                                                   'type': 'InsertNode',
                                                                   'followElement': {'type': 'Placeholder'}
                                                                  }
                                                },
                                                {'id': guidGenerator(),
                                                 'type': 'InsertCase',
                                                 'text': "Fall",
                                                 'followElement': {'id': guidGenerator(),
                                                                   'type': 'InsertNode',
                                                                   'followElement': {'type': 'Placeholder'}
                                                                  }
                                                }]
                                     };
            break;
        case 'CountLoopButton':
            this.nextInsertElement = {'id': guidGenerator(),
                                      'type': 'CountLoopNode',
                                      'text': "Zählbedingung",
                                      'followElement': {'id': guidGenerator(),
                                                        'type': 'InsertNode',
                                                        'followElement': null
                                                       },
                                      'child': {'id': guidGenerator(),
                                                'type': 'InsertNode',
                                                'followElement': {'type': 'Placeholder'}
                                               }
                                     };
            break;
        case 'HeadLoopButton':
            this.nextInsertElement = {'id': guidGenerator(),
                                      'type': 'HeadLoopNode',
                                      'text': "Gültigkeitsbedingung",
                                      'followElement': {'id': guidGenerator(),
                                                        'type': 'InsertNode',
                                                        'followElement': null
                                                       },
                                      'child': {'id': guidGenerator(),
                                                'type': 'InsertNode',
                                                'followElement': {'type': 'Placeholder'}
                                               }
                                     };
            break;
        case 'FootLoopButton':
            this.nextInsertElement = {'id': guidGenerator(),
                                      'type': 'FootLoopNode',
                                      'text': "Gültigkeitsbedingung",
                                      'followElement': {'id': guidGenerator(),
                                                        'type': 'InsertNode',
                                                        'followElement': null
                                                       },
                                      'child': {'id': guidGenerator(),
                                                'type': 'InsertNode',
                                                'followElement': {'type': 'Placeholder'}
                                               }
                                     };
            break;
        }
        if (event.dataTransfer !== undefined) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text', id);
        }
        let button = document.getElementById(id);
        if (button.classList.contains('boldText')) {
            this.resetButtons();
            this.reset();
        } else {
            // prepare insert by updating the model data
            this.resetButtons();
            this.insertMode = true;
            button.classList.add('boldText');
        }
        // rerender the struktogramm
        this.renderAllViews();
    }


    /**
     * Helper function to correctly abort while using drag and drop
     */
    resetDrop() {
        // while drag and droping an inserting element, the user can drop everywhere
        // if the location is not valid, one step more must be done to abort everything
        if (this.insertMode) {
            this.reset();
            this.resetButtons();
            this.renderAllViews();
        } else {
            this.resetButtons();
        }
    }


    resetModel() {
        this.updateUndo();
        this.model.reset();
        this.updateBrowserStore();
        this.renderAllViews();
        document.getElementById('IEModal').classList.remove('active');
    }

    /**
     * Switch the state of the default case
     *
     * @param   uid   id of the clicked element in the struktogramm
     */
    switchDefaultState(uid) {
        this.updateUndo();
        this.model.setTree(this.model.findAndAlterElement(uid, this.model.getTree(), this.model.switchDefaultCase, false, ""));
        this.updateBrowserStore();
        this.renderAllViews();
    }


    /**
     * Add another new case
     *
     * @param   uid   id of the clicked element in the struktogramm
     */
    addCase(uid) {
        this.updateUndo();
        this.model.setTree(this.model.findAndAlterElement(uid, this.model.getTree(), this.model.insertNewCase, false, ""));
        this.updateBrowserStore();
        this.renderAllViews();
    }


    /**
     * Remove the element from the tree
     *
     * @param   uid   id of the clicked element in the struktogramm
     */
    removeElement(uid) {
        const deleteElem = this.model.getElementInTree(uid, this.model.getTree());
        switch (deleteElem.type) {
        case 'TaskNode':
        case 'InputNode':
        case 'OutputNode':
            this.removeNodeFromTree(uid);
            break;
        case 'HeadLoopNode':
        case 'CountLoopNode':
        case 'FootLoopNode':
            if (deleteElem.child.followElement.type != 'Placeholder') {
                this.prepareRemoveQuestion(uid);
            } else {
                this.removeNodeFromTree(uid);
            }
            break;
        case 'BranchNode':
            if (deleteElem.trueChild.followElement.type != 'Placeholder' || deleteElem.falseChild.followElement.type != 'Placeholder') {
                this.prepareRemoveQuestion(uid);
            } else {
                this.removeNodeFromTree(uid);
            }
            break;
        case 'CaseNode':
            console.log(deleteElem);
            let check = false;
            for (const item of deleteElem.cases) {
                if (item.followElement.followElement.type != 'Placeholder') {
                    check = true;
                }
            }
            if (deleteElem.defaultNode.followElement.followElement.type != 'Placeholder') {
                check = true;
            }
            if (check) {
                this.prepareRemoveQuestion(uid);
            } else {
                this.removeNodeFromTree(uid);
            }
            break;
        case 'InsertCase':
            if (deleteElem.followElement.followElement.type != 'Placeholder') {
                this.prepareRemoveQuestion(uid);
            } else {
                this.removeNodeFromTree(uid);
            }
            break;
        }
    }

    prepareRemoveQuestion(uid) {
        const content = document.getElementById('modal-content');
        const footer = document.getElementById('modal-footer');
        while (content.hasChildNodes()) {
            content.removeChild(content.lastChild);
        }
        while (footer.hasChildNodes()) {
            footer.removeChild(footer.lastChild);
        }
        content.appendChild(document.createTextNode('Dieses Element und alle darin erstellten Blöcke löschen?'));
        const doButton = document.createElement('div');
        doButton.classList.add('modal-buttons', 'acceptIcon', 'hand');
        doButton.addEventListener('click', () => this.removeNodeFromTree(uid, true));
        footer.appendChild(doButton);
        const cancelButton = document.createElement('div');
        cancelButton.classList.add('modal-buttons', 'deleteIcon', 'hand');
        cancelButton.addEventListener('click', () => document.getElementById('IEModal').classList.remove('active'));
        footer.appendChild(cancelButton);

        document.getElementById('IEModal').classList.add('active');
    }

    removeNodeFromTree(uid, closeModal = false) {
        this.updateUndo();
        this.model.setTree(this.model.findAndAlterElement(uid, this.model.getTree(), this.model.removeNode, false, ""));
        this.updateBrowserStore();
        this.renderAllViews();
        if (closeModal) {
            document.getElementById('IEModal').classList.remove('active');
        }
    }


    /**
     * Prepare moving of an element of the struktogramm
     *
     * @param   uid   id of the clicked element in the struktogramm
     */
    moveElement(uid) {
        // prepare data
        this.moveId = uid;
        this.insertMode = true;
        this.nextInsertElement = this.model.getElementInTree(uid, this.model.getTree());
        this.nextInsertElement.followElement.followElement = null;
        // rerender
        this.renderAllViews();
    }


    editElement(uid, textValue) {
        this.updateUndo();
        this.model.setTree(this.model.findAndAlterElement(uid, this.model.getTree(), this.model.editElement, false, textValue));
        this.updateBrowserStore();
        this.renderAllViews();
    }

    /**
     * Append an element in the tree
     *
     * @param   uid   id of the clicked InsertNode in the struktogramm
     */
    appendElement(uid) {
        this.updateUndo();
        // remove old node, when moving is used
        let moveState = this.moveId;
        if (moveState) {
            this.model.setTree(this.model.findAndAlterElement(this.moveId, this.model.getTree(), this.model.removeNode, false, ""));
        }
        // insert the new node, on moving, its the removed
        let elemId = this.nextInsertElement.id;
        this.model.setTree(this.model.findAndAlterElement(uid, this.model.getTree(), this.model.insertElement, false, ""));
        // reset the buttons if moving occured
        if (moveState) {
            // TODO
            this.resetButtons();
        }
        // rerender
        this.reset();
        this.updateBrowserStore();
        this.renderAllViews();
        // on new inserted elements start the editing mode of the element
        if (!moveState) {
            this.switchEditState(elemId);
        }
    }


    /**
     * Switch an element in the struktogramm to the editing state
     *
     * @param   uid   id of the desired element in the struktogramm
     */
    switchEditState(uid) {
        let elem = document.getElementById(uid);
        // get the input field and display it
        // work around for FootLoopNodes, duo to HTML structure, the last element has to be found and edited
        if (elem.getElementsByClassName('input-group editField ' + uid).length) {
            elem = elem.getElementsByClassName('input-group editField ' + uid)[0];
        } else {
            elem = elem.getElementsByClassName('input-group editField')[0];
        }
        elem.previousSibling.style.display = 'none';
        elem.style.display = 'inline-flex';
        // automatic set focus on the input
        elem.getElementsByTagName('input')[0].select();
    }


    getStringifiedTree() {
        return JSON.stringify(this.model.getTree());
    }


    saveDialog() {
        // define the data url to start a download on click
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(this.getStringifiedTree());
        // create filename with current date in the name
        const exportFileDefaultName = 'struktog_' + (new Date(Date.now()).toJSON()).substring(0, 10) + '.json';
        // generate the download button element and append it to the node
        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }


    /**
     * Read input from a JSON file and replace the current model
     */
    readFile(event) {
        // create a FileReader instance
        const reader = new FileReader();
        // read file and parse JSON, then update model
        reader.onload = (event) => {
            const newModel = JSON.parse(event.target.result);
            this.updateUndo();
            this.model.setTree(newModel);
            this.renderAllViews();
            this.updateBrowserStore();
        }
        // start the reading process
        reader.readAsText(event.target.files[0]);
    }

    updateUndo() {
        this.undoList.push(this.getStringifiedTree());
        for (const item of document.getElementsByClassName('UndoIconButtonOverlay')) {
            console.log(item);
            item.classList.remove('disableIcon');
        }
        this.redoList = [];
        for (const item of document.getElementsByClassName('RedoIconButtonOverlay')) {
            item.classList.add('disableIcon');
        }
    }

    undo() {
        if (this.undoList.length) {
            this.redoList.unshift(this.getStringifiedTree());
            this.model.setTree(JSON.parse(this.undoList[this.undoList.length - 1]));
            this.undoList.pop();
            if (this.undoList == 0) {
                for (const item of document.getElementsByClassName('UndoIconButtonOverlay')) {
                    item.classList.add('disableIcon');
                }
            }
            for (const item of document.getElementsByClassName('RedoIconButtonOverlay')) {
                item.classList.remove('disableIcon');
            }
            this.renderAllViews();
            this.updateBrowserStore();
        }
    }

    redo() {
        if (this.redoList.length) {
            this.undoList.push(this.getStringifiedTree());
            this.model.setTree(JSON.parse(this.redoList[0]));
            this.redoList.shift();
            if (this.redoList.length == 0) {
                for (const item of document.getElementsByClassName('RedoIconButtonOverlay')) {
                    item.classList.add('disableIcon');
                }
            }
            for (const item of document.getElementsByClassName('UndoIconButtonOverlay')) {
                item.classList.remove('disableIcon');
            }
            this.renderAllViews();
            this.updateBrowserStore();
        }
    }
}
