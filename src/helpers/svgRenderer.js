/**
 * SVG Renderer Helper Utilities
 * 
 * NOTE: These utilities are currently not used by the main implementation.
 * The current implementation in structogram.js directly uses document.createElementNS
 * for creating inline SVG elements for branch and case nodes.
 * 
 * These utilities are kept as a foundation for future enhancements:
 * - Text wrapping within triangular shapes in branch nodes
 * - More sophisticated SVG-based rendering of complex nodes
 * - Potential migration to full SVG-based structogram rendering
 * 
 * If future development doesn't need these utilities, this file can be removed.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Create an SVG element with the given tag name and attributes
 */
export function createSVGElement(tagName, attributes = {}) {
  const elem = document.createElementNS(SVG_NS, tagName);
  for (const [key, value] of Object.entries(attributes)) {
    elem.setAttribute(key, value);
  }
  return elem;
}

/**
 * Create a line element
 */
export function createLine(x1, y1, x2, y2, attrs = {}) {
  return createSVGElement('line', {
    x1,
    y1,
    x2,
    y2,
    stroke: 'black',
    'stroke-width': '1.5',
    ...attrs
  });
}

/**
 * Wrap text to fit within a given width
 * Returns array of lines
 * Useful for future text wrapping in triangular shapes
 */
export function wrapText(text, maxCharsPerLine) {
  if (!text || text.length <= maxCharsPerLine) {
    return [text || ''];
  }
  
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

