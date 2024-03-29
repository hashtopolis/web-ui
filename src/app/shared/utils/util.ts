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

  const percentage = (value / total) * 100;
  const formattedPercentage = percentage.toFixed(1);

  return `${formattedPercentage}%`;
};

/**
 * Formats a file size in bytes into a human-readable string.
 *
 * @param sizeInBytes - The size in bytes to be formatted.
 * @param useLongForm - If true, use long-form units (e.g., "Kilobytes" instead of "KB").
 * @param baseSize - The base for size conversion (default is 1024).
 * @param threshold - The threshold for switching to the next unit (default is 1024).
 *
 * @returns A human-readable string representing the file size.
 */
export const formatFileSize = (
  sizeInBytes: number,
  suffix: 'short' | 'long' | 'none',
  baseSize = 1024,
  threshold = 1024
): string => {
  const fileSizeUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const fileSizeUnitsLong = [
    'Bytes',
    'Kilobytes',
    'Megabytes',
    'Gigabytes',
    'Pettabytes',
    'Exabytes',
    'Zettabytes',
    'Yottabytes'
  ];
  let units: string[] = [];

  if (suffix === 'short') {
    units = fileSizeUnits;
  } else if (suffix === 'long') {
    units = fileSizeUnitsLong;
  }

  let formattedSize: number | string = 0;

  if (sizeInBytes < 1) {
    return '0';
  }

  const scale = sizeInBytes > threshold ? sizeInBytes / threshold : sizeInBytes;
  const power = Math.min(
    Math.round(Math.log(scale) / Math.log(baseSize)),
    units.length - 1
  );
  const size = sizeInBytes / Math.pow(baseSize, power);
  const unit = units ? units[power] : '';

  formattedSize = Math.round(size * 100) / 100;

  return `${formattedSize} ${unit}`;
};
