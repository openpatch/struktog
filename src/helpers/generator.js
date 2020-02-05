/**
 * Generate a random id string
 *
 * @ return   string   random generated
 */
export function guidGenerator () {
    const gen = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return (gen() + gen() + '-' + gen() + '-' + gen() + '-' + gen() + '-' + gen() + gen())
}

/**
 * Generate HTML tree
 *
 */
export function generateHtmltree () {
    // Header
    const header = document.createElement('header')
    header.classList.add('container')
    document.body.appendChild(header)

    const section1 = document.createElement('section')
    section1.classList.add('nav-col')
    header.appendChild(section1)

    const logoDiv = document.createElement('div')
    logoDiv.classList.add('nav-logo-container')
    section1.appendChild(logoDiv)

    const logoAnker = document.createElement('a')
    logoAnker.classList.add('column', 'container')
    let url = 'index.html';
    const browserUrl = new URL(window.location.href)
    if (browserUrl.searchParams.get('config')) {
        url = url + '?config=' + browserUrl.searchParams.get('config');
    }
    logoAnker.setAttribute('href', url)
    logoDiv.appendChild(logoAnker)

    const logo = document.createElement('div')
    logo.classList.add('logo', 'logo-container')
    logoAnker.appendChild(logo)

    const logoText = document.createElement('strong')
    logoText.classList.add('nav-col')
    logoText.appendChild(document.createTextNode('Struktog.'))
    logoAnker.appendChild(logoText)

    const section2 = document.createElement('section')
    section2.classList.add('nav-col-opt')
    header.appendChild(section2)

    const divOptions = document.createElement('div')
    divOptions.classList.add('options-container')
    divOptions.setAttribute('id', 'optionButtons')
    section2.appendChild(divOptions)

    const divider = document.createElement('div')
    divider.classList.add('divider')
    document.body.appendChild(divider)

    // main
    const main = document.createElement('main')
    document.body.appendChild(main)

    const editor = document.createElement('div')
    editor.classList.add('container')
    editor.setAttribute('id', 'editorDisplay')
    main.appendChild(editor)

    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.setAttribute('id', 'IEModal')
    main.appendChild(modal)

    const modalOverlay = document.createElement('div')
    modalOverlay.classList.add('modal-overlay')
    modalOverlay.setAttribute('aria-label', 'Close')
    modalOverlay.addEventListener('click', () => {
        document.getElementById('IEModal').classList.remove('active')
    })
    modal.appendChild(modalOverlay)

    const modalContainer = document.createElement('div')
    modalContainer.classList.add('modal-container')
    modal.appendChild(modalContainer)

    const modalHeader = document.createElement('div')
    modalHeader.classList.add('modal-header')
    modalContainer.appendChild(modalHeader)

    const modalHeaderClose = document.createElement('div')
    modalHeaderClose.classList.add('close', 'hand', 'cancelIcon')
    modalHeaderClose.addEventListener('click', () => {
        document.getElementById('IEModal').classList.remove('active')
    })
    modalHeader.appendChild(modalHeaderClose)

    const modalBody = document.createElement('div')
    modalBody.classList.add('modal-body')
    modalContainer.appendChild(modalBody)

    const modalBodyContent = document.createElement('div')
    modalBodyContent.classList.add('content')
    modalBodyContent.setAttribute('id', 'modal-content')
    modalBody.appendChild(modalBodyContent)

    const modalFooter = document.createElement('div')
    modalFooter.classList.add('modal-footer', 'container')
    modalFooter.setAttribute('id', 'modal-footer')
    modalContainer.appendChild(modalFooter)

    // footer
    const footer = document.createElement('footer')
    footer.classList.add('container')
    document.body.appendChild(footer)

    const footerDiv = document.createElement('div')
    footerDiv.classList.add('column')
    footer.appendChild(footerDiv)

    const footerSpan = document.createElement('span')
    footerSpan.appendChild(document.createTextNode('© 2019 Didaktik der Informatik der TU Dresden'))
    footerDiv.appendChild(footerSpan)
}

export function generateResetButton(presenter, domNode) {
    // reset button must be last defined
    let resetButtonDiv = document.createElement('div')
    resetButtonDiv.classList.add('struktoOption', 'resetIcon', 'tooltip', 'tooltip-bottom', 'hand')
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
    domNode.appendChild(resetButtonDiv)
}
