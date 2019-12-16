import { model } from './model/main'
import { Presenter } from './presenter/main'
import { Structogram } from './views/structogram'
import { CodeView } from './views/code'
import { ImportExport } from './views/importExport'
import { generateHtmltree } from './helpers/generator'
import { templates } from './templates.js';

import './assets/scss/structog.scss'

window.onload = function () {
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

  // reset button must be last defined
  let resetButtonDiv = document.createElement('div')
  resetButtonDiv.classList.add('options-element', 'resetIcon', 'tooltip', 'tooltip-bottom', 'hand')
  resetButtonDiv.setAttribute('data-tooltip', 'Reset')
  resetButtonDiv.addEventListener('click', () => {
    const content = document.getElementById('modal-content')
    const footer = document.getElementById('modal-footer')
    while (content.hasChildNodes()) {
      content.removeChild(content.lastChild)
    }
    while (footer.hasChildNodes()) {
      footer.removeChild(footer.lastChild)
    }
    content.appendChild(document.createTextNode('Alles löschen?'))
    const doButton = document.createElement('div')
    doButton.classList.add('modal-buttons', 'acceptIcon', 'hand')
    doButton.addEventListener('click', () => presenter.resetModel())
    footer.appendChild(doButton)
    const cancelButton = document.createElement('div')
    cancelButton.classList.add('modal-buttons', 'deleteIcon', 'hand')
    cancelButton.addEventListener('click', () => document.getElementById('IEModal').classList.remove('active'))
    footer.appendChild(cancelButton)

    document.getElementById('IEModal').classList.add('active')
  })
  document.getElementById('optionButtons').appendChild(resetButtonDiv)

  presenter.init()
}
