import { Buffer } from 'buffer';

/**
 * Section for reusable functions used in forms
 *
 * Note: To use three-shaking is better do not use class
 * Comments use: https://tsdoc.org/
 */

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
 * Transforms API response options based on a field mapping configuration.
 *
 * @param apiOptions - The options received from an API response.
 * @param field - The field configuration that contains the mapping between form fields and API fields.
 *
 * @returns An array of transformed select options to be used in the form.
 */
export function transformSelectOptions(apiOptions: any[], field: any): any[] {
  return apiOptions.map((apiOption: any) => {
    const transformedOption: any = {};

    for (const formField of Object.keys(field.fieldMapping)) {
      const apiField = field.fieldMapping[formField];

      if (Object.prototype.hasOwnProperty.call(apiOption, apiField)) {
        transformedOption[formField] = apiOption[apiField];
      } else if (apiField == "id" && Object.prototype.hasOwnProperty.call(apiOption, apiField)) {
        transformedOption[formField] = apiOption[apiField];
      } else {
        // Handle the case where the API field doesn't exist in the response
        transformedOption[formField] = null; // or set a default value
      }
    }

    return transformedOption;
  });
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

/**
 * Compare two version strings.
 *
 * @param {Object} a - The first version object with a 'version' property.
 * @param {string} a.version - The version string to compare.
 * @param {Object} b - The second version object with a 'version' property.
 * @param {string} b.version - The version string to compare.
 * @returns {number} - Returns -1 if version A is less than version B,
 *                    1 if version A is greater than version B,
 *                    or 0 if both versions are equal.
 *
 * @example
 * const result = compareVersions({ version: '1.2.3' }, { version: '1.2.4' });
 * console.log(result); // Output: -1
 */
export function compareVersions(a, b): number {
  // Split the version strings into arrays of integers
  const versionA = a.version.split('.').map(Number);
  const versionB = b.version.split('.').map(Number);

  // Compare each segment of the version numbers
  for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
    const partA = versionA[i] || 0;
    const partB = versionB[i] || 0;

    if (partA < partB) {
      return -1;
    } else if (partA > partB) {
      return 1;
    }
  }

  // If all segments are equal, return 0
  return 0;
}

/**
 * Removes the fake path prefix from the given file path.
 *
 * @param {string} originalPath - The original file path that may contain a fake path prefix.
 * @returns {string} The file path with the fake path prefix removed.
 * @throws {Error} Throws an error if the provided path is not a string.
 */
export function removeFakePath(originalPath: string): string {
  const fakePathPrefix = 'C:\\fakepath\\';

  // Ensure originalPath is a string
  if (typeof originalPath !== 'string') {
    throw new Error('Input must be a string.');
  }

  // Remove fake path prefix if it exists
  return originalPath.startsWith(fakePathPrefix)
    ? originalPath.slice(fakePathPrefix.length)
    : originalPath;
}

/**
 * Handles the encoding of source data based on the selected file type.
 *
 * @param {string} fileSource - The source data to be encoded.
 * @returns {string} The encoded source data in base64 format.
 */
export function handleEncode(fileSource: string): string {
  return Buffer.from(fileSource).toString('base64');
}
