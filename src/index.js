/**
 * Main javascript of the Struktog. software
 *
 *
 * @author       Klaus Ramm <klaus@ramm-web.de>
 * @copyright    Klaus Ramm 25.06.2019
 * @licence      MIT License (MIT), see license.md
 * @version      0.5
 * @link         struktog.ramm-web.de
 */

import { model } from './model/main';
import { Presenter } from './presenter/main';
import { Structogram } from './views/structogram';


// check the web storage for old data
if (typeof(Storage) !== "undefined") {
    if ('tree' in localStorage) {
        model.setTree(JSON.parse(localStorage.tree));
        // TODO: model.displaySourcecode = JSON.parse(localStorage.displaySourcecode);
    }
}


window.onload = function() {
    // create presenter object
    const presenter = new Presenter(model);
    // TODO: this should not be necessary, but some functions depend on moveId and nextInsertElement
    model.setPresenter(presenter);

    // create our view objects
    const structogram = new Structogram(presenter, document.getElementById("editorDisplay"));
    presenter.addView(structogram);
    presenter.init();
}
