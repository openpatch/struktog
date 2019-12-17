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
  let section1 = document.createElement('section')
  section1.setAttribute('class', 'nav-col')

  let div = document.createElement('div')
  div.setAttribute('class', 'nav-logo-container')
  section1.appendChild(div)

  div = document.createElement('div')
  div.setAttribute('class', 'logo-container logo')
  section1.appendChild(div)

  let link = document.createElement('a')
  let text = document.createTextNode('Struktog.')
  // strong
  link.appendChild(text)
  link.title = ''
  link.href = 'index.html'
  section1.appendChild(link)

  let section2 = document.createElement('section')
  section2.setAttribute('class', 'nav-col')

  let divinner = document.createElement('div')
  divinner.setAttribute('class', 'column container')

  let divouter = document.createElement('div')
  divouter.setAttribute('class', 'options-container')
  divouter.setAttribute('id', 'optionButtons')

  divouter.appendChild(divinner)
  section2.appendChild(divouter)

  let header = document.createElement('header')
  header.setAttribute('class', 'container')
  header.appendChild(section1)
  header.appendChild(section2)

  // main
  let mdiv1 = document.createElement('div')
  mdiv1.setAttribute('class', 'container')
  mdiv1.setAttribute('id', 'editorDisplay')

  let mdiv20 = document.createElement('div')
  mdiv20.setAttribute('class', 'modal.overlay')
  mdiv20.setAttribute('aria-label', 'Close')
  mdiv20.setAttribute('onclick', "document.getElementById('IEModal').classList.remove('active');")

  let span = document.createElement('span')
  span.setAttribute('class', 'close hand')
  span.setAttribute('onclick', "document.getElementById('IEModal').classList.remove('active');")
  span.innerHTML = '&times;'
  let mdiv210 = document.createElement('div')
  mdiv210.setAttribute('class', 'modal-header')
  mdiv210.appendChild(span)

  let mdiv2110 = document.createElement('div')
  mdiv2110.setAttribute('id', 'modal-content')
  mdiv2110.setAttribute('class', 'content')
  mdiv2110.innerHTML = 'Content'
  let mdiv211 = document.createElement('div')
  mdiv211.setAttribute('class', 'modal-body')
  mdiv211.appendChild(mdiv2110)

  let mdiv212 = document.createElement('div')
  mdiv212.setAttribute('class', 'modal-footer container')
  mdiv212.setAttribute('id', 'modal-footer')
  mdiv212.innerHTML = 'Footer'

  let mdiv21 = document.createElement('div')
  mdiv21.setAttribute('class', 'modal-container')
  mdiv21.appendChild(mdiv210)
  mdiv21.appendChild(mdiv211)
  mdiv21.appendChild(mdiv212)

  let mdiv2 = document.createElement('div')
  mdiv2.setAttribute('class', 'modal')
  mdiv2.setAttribute('id', 'IEModal')
  mdiv2.appendChild(mdiv20)
  mdiv2.appendChild(mdiv21)

  let main = document.createElement('main')
  main.appendChild(mdiv1)
  main.appendChild(mdiv2)

  // footer
  let fspan1 = document.createElement('span')
  fspan1.innerHTML = ('&#169; 2019 Didaktik der Informatik')

  let fspan2 = document.createElement('span')
  fspan2.innerHTML = '('

  let fspan3 = document.createElement('span')
  fspan3.innerHTML = ')'

  let flink = document.createElement('a')
  let ftext = document.createTextNode('MIT License')
  // strong
  flink.innerHTML = ftext
  flink.title = ''
  flink.href = 'license.html'

  let fdiv = document.createElement('div')
  fdiv.setAttribute('class', 'column')
  fdiv.appendChild(fspan1)
  fdiv.appendChild(fspan2)
  fdiv.appendChild(flink)
  fdiv.appendChild(fspan3)

  let footer = document.createElement('footer')
  footer.appendChild(fdiv)

  document.body.appendChild(header)
  // append   <div class="divider"></div>
  document.body.appendChild(main)
  document.body.appendChild(footer)
}
