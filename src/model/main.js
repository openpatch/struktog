import {guidGenerator} from '../helpers/generator';

class Model {
    constructor(tree = {'id': guidGenerator(),
                        'type': 'InsertNode',
                        'followElement': {'type': 'Placeholder'}
                       }) {
        this.tree = tree;
        this.presenter = null;
    }


    setPresenter(presenter) {
        this.presenter = presenter;
    }


    getTree() {
        return this.tree;
    }


    setTree(content) {
        this.tree = content;
    }

    reset() {
        this.tree = {'id': guidGenerator(),
                     'type': 'InsertNode',
                     'followElement': {'type': 'Placeholder'}
                    };
    }

    /**
     * Find an element by id in the tree and use a function on that element
     *
     * @param    subTree         part of the tree with all children of current element
     * @param    alterFunction   function to be executed on the found element
     * @param    hasRealParent   indicates, if the parent element was a container node
     * @param    text            the new text for the node
     * @return   subTree         altered subTree object
     */
    findAndAlterElement(uid, subTree, alterFunction, hasRealParent, text) {
        // end the recursion
        if (subTree === null || subTree.type == 'Placeholder') {
            return subTree
        } else {
            if (subTree.id === uid) {
                // call the given function
                alterFunction = alterFunction.bind(this);
                subTree = alterFunction(subTree, hasRealParent, text);
                // reset the insert buttons, on drag and drop
                if (this.presenter.getMoveId() === null) {
                    this.presenter.resetButtons();
                }
                return subTree;
            } else {
                switch (subTree.type) {
                case 'InsertNode':
                    subTree.followElement = this.findAndAlterElement(uid, subTree.followElement, alterFunction, hasRealParent, text);
                    return subTree;
                    break;

                case 'InputNode':
                case 'OutputNode':
                case 'TaskNode':
                    subTree.followElement = this.findAndAlterElement(uid, subTree.followElement, alterFunction, true, text);
                    return subTree;
                    break;

                case 'HeadLoopNode':
                case 'FootLoopNode':
                case 'CountLoopNode':
                    subTree.child = this.findAndAlterElement(uid, subTree.child, alterFunction, false, text);
                    subTree.followElement = this.findAndAlterElement(uid, subTree.followElement, alterFunction, true, text);
                    return subTree;
                    break;

                case 'BranchNode':
                    subTree.trueChild = this.findAndAlterElement(uid, subTree.trueChild, alterFunction, false, text);
                    subTree.falseChild = this.findAndAlterElement(uid, subTree.falseChild, alterFunction, false, text);
                    subTree.followElement = this.findAndAlterElement(uid, subTree.followElement, alterFunction, true, text);
                    return subTree;
                    break;

                case 'CaseNode':
                    let nodes = [];
                    for (const element of subTree.cases) {
                        let val = this.findAndAlterElement(uid, element, alterFunction, false, text);
                        if (!(val === null)) {
                            nodes.push(val);
                        }
                    }
                    if (nodes.length >= 2) {
                        subTree.cases = nodes;
                    }
                    let valDefault = this.findAndAlterElement(uid, subTree.defaultNode, alterFunction, false, text);
                    if (valDefault === null) {
                        subTree.defaultOn = false;
                    } else {
                        subTree.defaultNode = valDefault;
                    }

                    subTree.followElement = this.findAndAlterElement(uid, subTree.followElement, alterFunction, true, text);
                    return subTree;
                    break;
                case 'InsertCase':
                    subTree.followElement = this.findAndAlterElement(uid, subTree.followElement, alterFunction, hasRealParent, text);
                    return subTree;
                    break;
                }
            }
        }
    }


    /**
     * Remove the node and reconnect the follow element
     *
     * @param    subTree         part of the tree with all children of current element
     * @param    hasRealParent   indicates if an Placeholder node has to be added
     * @param    text            not used in this function
     * @return   subTree         altered subTree object (without removed element)
     */
    removeNode(subTree, hasRealParent, text) {
        // InsertCases are just completly removed, they do not have follow elements
        if (subTree.type == 'InsertCase') {
            return null
        }
        // remove a node, but check if the parent is a container and a placeholder must be inserted
        if (subTree.followElement.followElement === null && !hasRealParent) {
            return {'type': 'Placeholder'}
        }
        // alter followElement of the node to the follow element of the next node
        return subTree.followElement.followElement
    }


    /**
     * Change the text of the current node
     *
     * @param    subTree         part of the tree with all children of current element
     * @param    hasRealParent   not used in this function
     * @param    text            the new text for the node
     * @return   subTree         altered subTree object (with changed text)
     */
    editElement(subTree, hasRealParent, text) {
        subTree.text = text;
        return subTree
    }


    /**
     * Insert an element in the model tree and connect children
     *
     * @param    subTree         part of the tree with all children of current element
     * @param    hasRealParent   not used in this function
     * @param    text            not used in this function
     * @return   subTree         altered subTree object (with newly inserted element)
     */
    insertElement(subTree, hasRealParent, text) {
        let element = this.presenter.getNextInsertElement();
        // check for children
        if (!(subTree.followElement === null || subTree.followElement.type == 'Placeholder')) {
            // connect children with the element to insert
            element.followElement.followElement = subTree.followElement;
        }
        // insert the new element
        subTree.followElement = element;

        return subTree
    }


    /**
     * Switch the display of the default case
     *
     * @param    subTree         part of the tree with all children of current element
     * @param    hasRealParent   not used in this function
     * @param    text            not used in this function
     * @return   subTree         altered subTree object (with changed state of default case)
     */
    switchDefaultCase(subTree, hasRealParent, text) {
        if (subTree.defaultOn) {
            subTree.defaultOn = false;
        } else {
            subTree.defaultOn = true;
        }
        return subTree
    }


    /**
     * Insert a new empty case element
     *
     * @param    subTree         part of the tree with all children of current element
     * @param    hasRealParent   not used in this function
     * @param    text            not used in this function
     * @return   subTree         altered subTree object (with inserted case element)
     */
    insertNewCase(subTree, hasRealParent, text) {
        // check for max number of cases, duo to rendering issues
        if (subTree.cases.length < 7) {
            // add a new case
            subTree.cases.push({'id': guidGenerator(),
                                'type': 'InsertCase',
                                'text': "Fall",
                                'followElement': {'id': guidGenerator(),
                                                  'type': 'InsertNode',
                                                  'followElement': {'type': 'Placeholder'}
                                                 }
                               });
        }
        return subTree
    }


    /**
     * Recursive function to get a real copy of an element by his id
     *
     * @param    id              id of the element, which to find
     * @param    subTree         part of the tree with all children of current element
     * @return   subTree         copy of the subTree object
     */
    getElementInTree(uid, subTree) {
        // stop recursion if the end of a sub tree is reached
        if (subTree === null || subTree.type == 'Placeholder') {
            return null
        } else {
            if (subTree.id === uid) {
                // return a real copy
                return JSON.parse(JSON.stringify(subTree));
            } else {
                switch (subTree.type) {
                case 'InsertNode':
                case 'InputNode':
                case 'OutputNode':
                case 'TaskNode':
                case 'InsertCase':
                    return this.getElementInTree(uid, subTree.followElement)
                    break;
                case 'HeadLoopNode':
                case 'CountLoopNode':
                case 'FootLoopNode':
                    {
                        // follow children first, then the follow node
                        let node = this.getElementInTree(uid, subTree.child);
                        if (node === null) {
                            return this.getElementInTree(uid, subTree.followElement)
                        } else {
                            return node
                        }
                    }
                    break;
                case 'BranchNode':
                    {
                        // follow both children first, then the follow node
                        let node = this.getElementInTree(uid, subTree.trueChild);
                        if (node === null) {
                            node = this.getElementInTree(uid, subTree.falseChild);
                            if (node === null) {
                                return this.getElementInTree(uid, subTree.followElement)
                            } else {
                                return node
                            }
                        } else {
                            return node
                        }
                    }
                    break;
                case 'CaseNode':
                    {
                        // follow every case first
                        let node = null;
                        for (const element of subTree.cases) {
                            let caseNode = this.getElementInTree(uid, element);
                            if (caseNode != null) {
                                node = caseNode;
                            }
                        }
                        // then the default case
                        if (node === null) {
                            node = this.getElementInTree(uid, subTree.defaultNode);
                            if (node === null) {
                                // then the follow element
                                return this.getElementInTree(uid, subTree.followElement);
                            } else {
                                return node
                            }
                        } else {
                            return node;
                        }
                    }
                    break;
                }
            }
        }
    }

}

// create a singleton of the model object
export const model = new Model();
