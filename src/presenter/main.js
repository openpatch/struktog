import {guidGenerator} from '../helpers/generator';

export class Presenter {
    constructor(model) {
        this.model = model;
        this.insertMode = false;
        this.views = [];
        this.moveId = null;
        this.nextInsertElement = null;
    }


    addView(view) {
        this.views.push(view);
    }


    getInsertMode() {
        return this.insertMode;
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


    /**
     * Update the model stored in the browser store
     */
    updateBrowserStore() {
        // check if browser supports web storage
        if (typeof(Storage) !== "undefined") {
            // update the model as stringified JSON data
            localStorage.tree = JSON.stringify(this.model.getTree());
            //localStorage.displaySourcecode = JSON.stringify(model.displaySourcecode);
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
     * Prepare for inserting an element
     *
     * @param   buttonId   id of the selected button
     */
    insertNode(id) {
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
        let button = document.getElementById(id);
        if (button.classList.contains('btn-primary')) {
            this.resetButtons();
            this.reset();
        } else {
            // prepare insert by updating the model data
            this.resetButtons();
            this.insertMode = true;
            button.classList.add('btn-primary');
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
        this.model.reset();
        this.updateBrowserStore();
        this.renderAllViews();
    }

    /**
     * Switch the state of the default case
     *
     * @param   uid   id of the clicked element in the struktogramm
     */
    switchDefaultState(uid) {
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
        this.model.setTree(this.model.findAndAlterElement(uid, this.model.getTree(), this.model.removeNode, false, ""));
        this.updateBrowserStore();
        this.renderAllViews();
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
        // work around for FootLoopNodes, duo to HTML structure, the last element has to be found and edited
        for (var i = 0; i < elem.children.length; i++) {
            if (elem.children[i].classList.contains('element')) {
                elem = elem.children[i];
                break;
            }
        }
        // get the input field and display it
        elem = elem.getElementsByClassName('input-group editField')[0];
        elem.previousSibling.style.display = 'none';
        elem.style.display = 'inline-flex';
        // automatic set focus on the input
        elem.getElementsByTagName('input')[0].select();
    }
}
