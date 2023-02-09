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
  const pasteObject = document.getElementById("pasteLine");
  const uploadObject = document.getElementById("uploadLine");
  const importObject = document.getElementById("importLine");
  const downloadObject = document.getElementById("downloadLine");
  switch (checkbox) {
    case 'paste':
      pasteObject.style.display = '';
      uploadObject.style.display = 'none';
      importObject.style.display = 'none';
      downloadObject.style.display = 'none';
      break;

    case 'upload':
      pasteObject.style.display = 'none';
      uploadObject.style.display = '';
      importObject.style.display = 'none';
      downloadObject.style.display = 'none';
      break;

    case 'import':
      pasteObject.style.display = 'none';
      uploadObject.style.display = 'none';
      importObject.style.display = '';
      downloadObject.style.display = 'none';
      break;

    case 'url':
      pasteObject.style.display = 'none';
      uploadObject.style.display = 'none';
      importObject.style.display = 'none';
      downloadObject.style.display = '';
      break;
  }
}
