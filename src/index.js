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
import { CodeView } from './views/code';


window.onload = function() {
    // create presenter object
    const presenter = new Presenter(model);
    // TODO: this should not be necessary, but some functions depend on moveId and nextInsertElement
    model.setPresenter(presenter);

    // create our view objects
    const structogram = new Structogram(presenter, document.getElementById("editorDisplay"));
    presenter.addView(structogram);
    const code = new CodeView(presenter, document.getElementById("editorDisplay"));
    presenter.addView(code);

    // reset button must be last defined
    let resetButtonDiv = document.createElement('div');
    resetButtonDiv.classList.add('column', 'col-mr-auto');
    let resetButton = document.createElement('button');
    resetButton.classList.add('btn', 'float-right');
    resetButton.addEventListener('click', () => presenter.resetModel());
    resetButton.appendChild(document.createTextNode('Reset'));

    resetButtonDiv.appendChild(resetButton);
    document.getElementById('optionButtons').appendChild(resetButtonDiv);

    presenter.init();
}
