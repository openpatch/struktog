export function newElement (type, classes = [], parent = false) {
  const domElement = document.createElement(type)
  for (const item of classes) {
    domElement.classList.add(item)
  }
  if (parent) {
    parent.appendChild(domElement)
  }
  return domElement
}
