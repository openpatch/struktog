export class ImportExport {
  constructor (presenter, domRoot) {
    this.presenter = presenter
    this.domRoot = domRoot
    this.printHeight = 32

    this.preRender()
  }

  render (model) {}

  preRender () {
    const importDiv = document.createElement('div')
    importDiv.classList.add('options-element', 'uploadIcon', 'tooltip', 'tooltip-bottom', 'hand')
    importDiv.setAttribute('data-tooltip', 'Laden')
    const importInput = document.createElement('input')
    importInput.setAttribute('type', 'file')
    importInput.addEventListener('change', (e) => this.presenter.readFile(e))
    importDiv.addEventListener('click', () => importInput.click())
    document.getElementById('optionButtons').appendChild(importDiv)

    const saveDiv = document.createElement('div')
    saveDiv.classList.add('options-element', 'saveIcon', 'tooltip', 'tooltip-bottom', 'hand')
    saveDiv.setAttribute('data-tooltip', 'Speichern')
    saveDiv.addEventListener('click', () => this.presenter.saveDialog())
    document.getElementById('optionButtons').appendChild(saveDiv)

    // right now only png export exists, in the future a dialog should be opened
    const exportDiv = document.createElement('div')
    exportDiv.classList.add('options-element', 'exportIcon', 'tooltip', 'tooltip-bottom', 'hand')
    exportDiv.setAttribute('data-tooltip', 'Bildexport')
    exportDiv.addEventListener('click', () => this.exportAsPng(this.presenter.getModelTree()))
    document.getElementById('optionButtons').appendChild(exportDiv)
  }

  /**
     * Render the current tree element on a canvas position and call to render childs
     *
     * @param    subTree   object of the current element / sub tree of the struktogramm
     * @param    ctx       instance of the canvas
     * @param    x         current x position on the canvas to start drawing
     * @param    xmax      absolute x position until then may be drawn
     * @param    y         current y position on the canvas to start drawing
     * @return   int       max y positon to which was drawn already, so the parent element knows where to draw the next element
     */
  renderTreeAsCanvas (subTree, ctx, x, xmax, y) {
    // uses a recursive structure, termination condition is no definied element to be drawn
    if (subTree === null) {
      return y
    } else {
      const defaultMargin = 22
      // use for every possible element type a different drawing strategie
      switch (subTree.type) {
        case 'InsertNode':
          return this.renderTreeAsCanvas(subTree.followElement, ctx, x, xmax, y)

        case 'Placeholder':
        {
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(xmax, y)
          ctx.moveTo(x, y)
          ctx.lineTo(x, y + this.printHeight)
          ctx.moveTo(xmax, y)
          ctx.lineTo(xmax, y + this.printHeight)
          ctx.stroke()
          ctx.beginPath()
          let centerX = x + (xmax - x) / 2
          let centerY = y + this.printHeight / 2
          ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
          ctx.moveTo(centerX - 11, centerY + 11)
          ctx.lineTo(centerX + 11, centerY - 11)
          ctx.stroke()
          return y + this.printHeight
        }

        case 'InputNode':
        {
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(xmax, y)
          ctx.moveTo(x, y)
          ctx.lineTo(x, y + this.printHeight)
          ctx.moveTo(xmax, y)
          ctx.lineTo(xmax, y + this.printHeight)
          ctx.stroke()
          ctx.beginPath()
          ctx.fillText('E: ' + subTree.text, x + 15, y + defaultMargin)
          ctx.stroke()
          return this.renderTreeAsCanvas(subTree.followElement, ctx, x, xmax, y + this.printHeight)
        }

        case 'OutputNode':
        {
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(xmax, y)
          ctx.moveTo(x, y)
          ctx.lineTo(x, y + this.printHeight)
          ctx.moveTo(xmax, y)
          ctx.lineTo(xmax, y + this.printHeight)
          ctx.stroke()
          ctx.beginPath()
          ctx.fillText('A: ' + subTree.text, x + 15, y + defaultMargin)
          ctx.stroke()
          return this.renderTreeAsCanvas(subTree.followElement, ctx, x, xmax, y + this.printHeight)
        }

        case 'TaskNode':
        {
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(xmax, y)
          ctx.moveTo(x, y)
          ctx.lineTo(x, y + this.printHeight)
          ctx.moveTo(xmax, y)
          ctx.lineTo(xmax, y + this.printHeight)
          ctx.stroke()
          ctx.beginPath()
          ctx.fillText(subTree.text, x + 15, y + defaultMargin)
          ctx.stroke()
          return this.renderTreeAsCanvas(subTree.followElement, ctx, x, xmax, y + this.printHeight)
        }

        case 'BranchNode':
        {
          ctx.rect(x, y, xmax - x, 2 * this.printHeight)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + (xmax - x) / 2, y + 2 * this.printHeight)
          ctx.moveTo(xmax, y)
          ctx.lineTo(x + (xmax - x) / 2, y + 2 * this.printHeight)
          ctx.stroke()
          // center the text
          let textWidth = ctx.measureText(subTree.text)
          ctx.beginPath()
          ctx.fillText(subTree.text, x + Math.abs(((xmax - x) - textWidth.width)) / 2, y + defaultMargin)
          ctx.stroke()
          ctx.beginPath()
          ctx.fillText('Wahr', x + 15, y + this.printHeight + defaultMargin)
          ctx.fillText('Falsch', xmax - 15 - ctx.measureText('Falsch').width, y + this.printHeight + defaultMargin)
          ctx.stroke()
          let trueChildY = this.renderTreeAsCanvas(subTree.trueChild, ctx, x, x + (xmax - x) / 2, y + 2 * this.printHeight)
          let falseChildY = this.renderTreeAsCanvas(subTree.falseChild, ctx, x + (xmax - x) / 2, xmax, y + 2 * this.printHeight)

          // determine which child sub tree is deeper y wise
          if (trueChildY < falseChildY) {
            trueChildY = falseChildY
          }
          ctx.rect(x, y, xmax - x, trueChildY - y)
          ctx.stroke()
          return this.renderTreeAsCanvas(subTree.followElement, ctx, x, xmax, trueChildY)
        }

        case 'CountLoopNode':
        case 'HeadLoopNode':
        {
          let childY = this.renderTreeAsCanvas(subTree.child, ctx, x + ((xmax - x) / 12), xmax, y + this.printHeight)
          ctx.rect(x, y, xmax - x, childY - y)
          ctx.stroke()
          ctx.beginPath()
          ctx.fillText(subTree.text, x + 15, y + defaultMargin)
          ctx.stroke()
          return this.renderTreeAsCanvas(subTree.followElement, ctx, x, xmax, childY)
        }

        case 'FootLoopNode':
        {
          let childY = this.renderTreeAsCanvas(subTree.child, ctx, x + ((xmax - x) / 12), xmax, y)
          ctx.rect(x, y, xmax - x, childY - y + this.printHeight)
          ctx.stroke()
          ctx.beginPath()
          ctx.fillText(subTree.text, x + 15, childY + defaultMargin)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x + ((xmax - x) / 12), childY)
          ctx.lineTo(xmax, childY)
          ctx.stroke()
          return this.renderTreeAsCanvas(subTree.followElement, ctx, x, xmax, childY + this.printHeight)
        }

        case 'CaseNode':
        {
          ctx.rect(x, y, xmax - x, 2 * this.printHeight)
          let caseCount = subTree.cases.length
          if (subTree.defaultOn) {
            caseCount = caseCount + 1
          }
          // calculate the x and y distance between each case
          // yStep ist used for the positioning of the vertical lines on the diagonal line
          let xStep = (xmax - x) / caseCount
          let yStep = (this.printHeight) / subTree.cases.length
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x, y)
          if (subTree.defaultOn) {
            ctx.lineTo(xmax - xStep, y + this.printHeight)
            ctx.lineTo(xmax, y)
            ctx.moveTo(xmax - xStep, y + this.printHeight)
            ctx.lineTo(xmax - xStep, y + 2 * this.printHeight)
          } else {
            ctx.lineTo(xmax, y + this.printHeight)
          }
          ctx.stroke()
          let textWidth = ctx.measureText(subTree.text)
          ctx.beginPath()
          ctx.fillText(subTree.text, xmax - xStep - (textWidth.width / 2), y + defaultMargin)
          ctx.stroke()
          let xPos = x
          // determine the deepest tree by the y coordinate
          let yFinally = y + 3 * this.printHeight
          for (const element of subTree.cases) {
            let childY = this.renderTreeAsCanvas(element, ctx, xPos, xPos + xStep, y + this.printHeight)
            if (childY > yFinally) {
              yFinally = childY
            }
            xPos = xPos + xStep
          }
          if (subTree.defaultOn) {
            let childY = this.renderTreeAsCanvas(subTree.defaultNode, ctx, xPos, xmax, y + this.printHeight)
            if (childY > yFinally) {
              yFinally = childY
            }
          }
          // draw the vertical lines
          for (let i = 1; i <= subTree.cases.length; i++) {
            ctx.beginPath()
            ctx.moveTo(x + i * xStep, y + i * yStep)
            ctx.lineTo(x + i * xStep, yFinally)
            ctx.stroke()
          }
          return this.renderTreeAsCanvas(subTree.followElement, ctx, x, xmax, yFinally)
        }

        case 'InsertCase':
        {
          let textWidth = ctx.measureText(subTree.text)
          ctx.beginPath()
          ctx.fillText(subTree.text, x + Math.abs(((xmax - x) - textWidth.width)) / 2, y + defaultMargin)
          ctx.stroke()
          return this.renderTreeAsCanvas(subTree.followElement, ctx, x, xmax, y + this.printHeight)
        }
      }
    }
  }

  /**
     * Create a PNG file of the current model and append a button for downloading
     */
  exportAsPng (model) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const width = document.getElementById('structogram').parentElement.parentElement.clientWidth
    canvas.width = width
    canvas.height = document.getElementById('structogram').clientHeight

    ctx.font = '16px sans-serif'
    ctx.lineWidth = '1'
    // render the tree on the canvas
    const lastY = this.renderTreeAsCanvas(model, ctx, 0, width, 0)
    ctx.rect(0, 0, width, lastY)
    ctx.stroke()

    // define filename
    const exportFileDefaultName = 'struktog_' + (new Date(Date.now()).toJSON()).substring(0, 10) + '.png'

    // create button / anker element
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', canvas.toDataURL('image/png'))
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  resetButtons () {}
  displaySourcecode () {}
  setLang () {}
}
