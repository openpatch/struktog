import { model } from './model/main'
import { Presenter } from './presenter/main'
import { Structogram } from './views/structogram'
import { CodeView } from './views/code'
import { ImportExport } from './views/importExport'
import { generateHtmltree } from './helpers/generator'

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
  resetButtonDiv.classList.add('column', 'container')
  let resetButton = document.createElement('button')
  resetButton.classList.add('column')
  resetButton.addEventListener('click', () => presenter.resetModel())
  resetButton.appendChild(document.createTextNode('Reset'))

  resetButtonDiv.appendChild(resetButton)
  document.getElementById('optionButtons').appendChild(resetButtonDiv)

  presenter.init()
}
