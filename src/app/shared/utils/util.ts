/**
 * Section for reusable functions
 *
 * Note: To use three-shaking is better do not use class
 * Comments use: https://tsdoc.org/
 */

/**
 * Validate the file extension
 * Notes: This function is not in place but it could be usefule in the section of files
 *
 * @param filename - File name with extension (.xls, .txt)
 * @returns true or false
 * ```
 * @beta
 */

export function validateFileExt(filename: string): boolean {
  const filext = filename.split('.').pop();
  switch (filext.toLowerCase()) {
    case 'zip':
    case 'dic':
    case 'txt':
      // Add more extensions
      return true;
  }
  return false;
}

/**
 * Converts any URL path, local or http to base64 image.
 * Notes: Only tested with png
 *
 * @param url - url patch i.e ../../assets/img/backgroung.png
 * @returns data:image/png;base64,(encode picture)
 * ```
 * @beta
 */

export function getBase64ImageFromURL(url: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL('image/png');

      resolve(dataURL);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = url;
  });
}

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) {
    return '';
  }
  return `${convertToLocale((value / total) * 100)}%`;
};

/**
 * Formats a file size in bytes into a human-readable string.
 *
 * @param sizeInBytes - The size in bytes to be formatted.
 * @param suffix - define type of suffix
 * @param baseSize - The base for size conversion (default is 1024).
 * @param threshold - The threshold for switching to the next unit (default is 1024).
 *
 * @returns A human-readable string representing the file size.
 */
export const formatFileSize = (
  sizeInBytes: number,
  suffix: 'short' | 'long' | 'none' = 'short',
  baseSize = 1024
): string => {
  if (sizeInBytes < 1) return '0 B';

  const fileSizeUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const fileSizeUnitsLong = [
    'Bytes',
    'Kilobytes',
    'Megabytes',
    'Gigabytes',
    'Terabytes',
    'Petabytes',
    'Exabytes',
    'Zettabytes',
    'Yottabytes'
  ];

  const units = suffix === 'long' ? fileSizeUnitsLong : fileSizeUnits;

  const power = Math.min(Math.floor(Math.log(sizeInBytes) / Math.log(baseSize)), units.length - 1);
  const size = sizeInBytes / Math.pow(baseSize, power);

  return `${convertToLocale(size)} ${units[power]}`;
};

/**
 * Convert a given speed from number to string containing a unit
 * @param speed - speed to convert
 */
export const convertCrackingSpeed = (speed: number): string => {
  const units: Array<string> = ['H/s', 'kH/s', 'MH/s', 'GH/s', 'TH/s'];
  const splitter: number = 1000;
  let hashSpeed: number = speed;

  for (const unit of units) {
    if (hashSpeed < splitter) {
      return `${convertToLocale(hashSpeed)}\u00A0${unit}`;
    }
    hashSpeed /= splitter;
  }

  hashSpeed *= splitter;
  return `${convertToLocale(hashSpeed)}\u00A0${units[-1]}`;
};

/**
 * Convert a given number to a locale string (thousand and decimal separators) with to decimal places
 * @param value - numeric value to convert
 * @return formatted string with two decimal places
 */
export const convertToLocale = (value: number) => {
  return (Math.round(value * 100) / 100).toLocaleString();
};
