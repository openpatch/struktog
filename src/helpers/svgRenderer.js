/**
 * SVG Renderer Helper
 * Provides utilities for creating SVG elements for structogram visualization
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Create an SVG element with the given tag name
 */
export function createSVGElement(tagName, attributes = {}) {
  const elem = document.createElementNS(SVG_NS, tagName);
  for (const [key, value] of Object.entries(attributes)) {
    elem.setAttribute(key, value);
  }
  return elem;
}

/**
 * Create an SVG container with specified dimensions
 */
export function createSVGContainer(width, height, className = '') {
  const svg = createSVGElement('svg', {
    width: width || '100%',
    height: height || '100%',
    xmlns: SVG_NS
  });
  if (className) {
    svg.setAttribute('class', className);
  }
  return svg;
}

/**
 * Create a rectangle
 */
export function createRect(x, y, width, height, attrs = {}) {
  return createSVGElement('rect', {
    x,
    y,
    width,
    height,
    ...attrs
  });
}

/**
 * Create a line
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
 * Create a polyline
 */
export function createPolyline(points, attrs = {}) {
  return createSVGElement('polyline', {
    points,
    stroke: 'black',
    'stroke-width': '1.5',
    fill: 'none',
    ...attrs
  });
}

/**
 * Create a polygon
 */
export function createPolygon(points, attrs = {}) {
  return createSVGElement('polygon', {
    points,
    stroke: 'black',
    'stroke-width': '1.5',
    fill: 'transparent',
    ...attrs
  });
}

/**
 * Create an SVG text element
 */
export function createText(x, y, content, attrs = {}) {
  const text = createSVGElement('text', {
    x,
    y,
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
    ...attrs
  });
  text.textContent = content;
  return text;
}

/**
 * Create an SVG text element with tspan for multiline support
 */
export function createMultilineText(x, y, lines, attrs = {}) {
  const text = createSVGElement('text', {
    x,
    y,
    'text-anchor': 'middle',
    ...attrs
  });
  
  lines.forEach((line, index) => {
    const tspan = createSVGElement('tspan', {
      x,
      dy: index === 0 ? 0 : '1.2em'
    });
    tspan.textContent = line;
    text.appendChild(tspan);
  });
  
  return text;
}

/**
 * Wrap text to fit within a given width
 * Returns array of lines
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

/**
 * Create a group element
 */
export function createGroup(attrs = {}) {
  return createSVGElement('g', attrs);
}

/**
 * Create a foreignObject for embedding HTML content
 */
export function createForeignObject(x, y, width, height, content) {
  const fo = createSVGElement('foreignObject', {
    x,
    y,
    width,
    height
  });
  
  const div = document.createElement('div');
  div.style.width = '100%';
  div.style.height = '100%';
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.style.justifyContent = 'center';
  
  if (typeof content === 'string') {
    div.textContent = content;
  } else if (content instanceof HTMLElement) {
    div.appendChild(content);
  }
  
  fo.appendChild(div);
  return fo;
}
