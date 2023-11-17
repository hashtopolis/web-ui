/**
 * Section for reusable functions used in forms
 *
 * Note: To use three-shaking is better do not use class
 * Comments use: https://tsdoc.org/
 */

/**
 * Show / Hide elements in the form
 * Used in; New Hashlist
 *
 * @param checkbox - checkbox
 * @returns Value
 * ```
 * @public
 */

export function ShowHideTypeFile(checkbox: string): void {
  const pasteObject = document.getElementById('pasteLine');
  const uploadObject = document.getElementById('uploadLine');
  const urlObject = document.getElementById('urlLine');
  switch (checkbox) {
    case 'paste':
      pasteObject.style.display = '';
      uploadObject.style.display = 'none';
      urlObject.style.display = 'none';
      break;

    case 'upload':
      pasteObject.style.display = 'none';
      uploadObject.style.display = '';
      urlObject.style.display = 'none';
      break;

    case 'download':
      pasteObject.style.display = 'none';
      uploadObject.style.display = 'none';
      urlObject.style.display = '';
      break;
  }
}

/**
 * Extract Ids
 * Used extract ids after mat-autcomplete component
 *
 * @param dataArray
 * @param idKey
 * @returns Values [1,2,3]
 * ```
 * @public
 */

export function extractIds(dataArray: any[], idKey: string): number[] {
  return dataArray
    .map((item) => {
      let id = null;
      if (Object.prototype.hasOwnProperty.call(item, idKey)) {
        id = item[idKey];
      }
      return id;
    })
    .filter((id) => id !== null) as number[];
}

/**
 * https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 *
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}

function componentToHex(c) {
  const hex = Math.floor(c).toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

export function randomColor() {
  const rgb = hslToRgb(Math.random(), 0.6, Math.random() * 0.4 + 0.4);
  return `#${componentToHex(rgb[0])}${componentToHex(rgb[1])}${componentToHex(
    rgb[2]
  )}`;
}
