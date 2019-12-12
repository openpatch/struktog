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
import { ImportExport } from './views/importExport';
import { templates } from './templates.js';


window.onload = function() {
    // manipulate the localStorage before loading the presenter
    if (typeof(Storage) !== "undefined") {
        const url = new URL(window.location.href);
        const template = url.searchParams.get("template");
        if (template in templates) {
            if ('model' in templates[template]) {
                localStorage.tree = JSON.stringify(templates[template].model);
                model.setTree(templates[template].model);
            }
            if ('lang' in templates[template]) {
                localStorage.lang = templates[template].lang;
            }
            if ('displaySourcecode' in templates[template]) {
                localStorage.displaySourcecode = templates[template].displaySourcecode;
            }
        }
    }
    // create presenter object
    const presenter = new Presenter(model);
    // TODO: this should not be necessary, but some functions depend on moveId and nextInsertElement
    model.setPresenter(presenter);

    // create our view objects
    const structogram = new Structogram(presenter, document.getElementById("editorDisplay"));
    presenter.addView(structogram);
    const code = new CodeView(presenter, document.getElementById("editorDisplay"));
    presenter.addView(code);
    const importExport = new ImportExport(presenter, document.getElementById('Export'));
    presenter.addView(importExport);

    // reset button must be last defined
    let resetButtonDiv = document.createElement('div');
    resetButtonDiv.classList.add('options-element', 'resetIcon', 'tooltip', 'tooltip-bottom', 'hand');
    resetButtonDiv.setAttribute('data-tooltip', 'Reset');
    resetButtonDiv.addEventListener('click', () => {
        const content = document.getElementById('modal-content');
        const footer = document.getElementById('modal-footer');
        while (content.hasChildNodes()) {
            content.removeChild(content.lastChild);
        }
        while (footer.hasChildNodes()) {
            footer.removeChild(footer.lastChild);
        }
        content.appendChild(document.createTextNode("Alles löschen?"));
        const doButton = document.createElement('div');
        doButton.classList.add('modal-buttons', 'acceptIcon', 'hand');
        doButton.addEventListener('click', () => presenter.resetModel());
        footer.appendChild(doButton);
        const cancelButton = document.createElement('div');
        cancelButton.classList.add('modal-buttons', 'deleteIcon', 'hand');
        cancelButton.addEventListener('click', () => document.getElementById('IEModal').classList.remove('active'));
        footer.appendChild(cancelButton);

        document.getElementById('IEModal').classList.add('active');
    });
    document.getElementById('optionButtons').appendChild(resetButtonDiv);

    presenter.init();
}
