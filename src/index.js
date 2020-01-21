import { model } from './model/main'
import { Presenter } from './presenter/main'
import { Structogram } from './views/structogram'
import { CodeView } from './views/code'
import { ImportExport } from './views/importExport'
import { generateHtmltree } from './helpers/generator'
import { generateResetButton } from './helpers/generator'
import { templates } from './templates.js'

import './assets/scss/structog.scss'

window.onload = function () {
    // manipulate the localStorage before loading the presenter
    if (typeof (Storage) !== 'undefined') {
        const url = new URL(window.location.href)
        const template = url.searchParams.get('template')
        if (template in templates) {
            if ('model' in templates[template]) {
                window.localStorage.tree = JSON.stringify(templates[template].model)
                model.setTree(templates[template].model)
            }
            if ('lang' in templates[template]) {
                window.localStorage.lang = templates[template].lang
            }
            if ('displaySourcecode' in templates[template]) {
                window.localStorage.displaySourcecode = templates[template].displaySourcecode
            }
        }
    }

    generateHtmltree()
    // create presenter object
    const presenter = new Presenter(model)
    // TODO: this should not be necessary, but some functions depend on moveId and nextInsertElement
    model.setPresenter(presenter)

    // create our view objects
    const structogram = new Structogram(presenter, document.getElementById('editorDisplay'))
    presenter.addView(structogram)
    const code = new CodeView(presenter, document.getElementById('editorDisplay'))
    presenter.addView(code)
    const importExport = new ImportExport(presenter, document.getElementById('Export'))
    presenter.addView(importExport)

    generateResetButton(presenter)
    presenter.init()
}
