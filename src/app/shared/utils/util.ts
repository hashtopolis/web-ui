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
  switch (filext.toLowerCase()){
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
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL("image/png");

      resolve(dataURL);
    };

    img.onerror = error => {
      reject(error);
    };

    img.src = url;

  });}






