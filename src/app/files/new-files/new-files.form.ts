/**
 * This module contains form definitions for creating new files (dictionaries, rules, etc.)
 */

import { FormControl, FormGroup } from '@angular/forms';

/**
 * Interface definition for NewFilesForm
 */
export interface NewFilesForm {
  filename: FormControl<string>;
  isSecret: FormControl<boolean>;
  fileType: FormControl<number>;
  accessGroupId: FormControl<number>;
  sourceType: FormControl<string>;
  sourceData: FormControl<string>;
}

/**
 * Interface for prepared form data used handled in onBeforeSubmit method
 */
export interface PreparedFormData {
  update: FormGroup<NewFilesForm>['value'];
  status: boolean;
}

/**
 * Get empty instance of NewFilesForm
 */
export const getNewFilesForm = () => {
  return new FormGroup<NewFilesForm>({
    filename: new FormControl(''),
    isSecret: new FormControl(false),
    fileType: new FormControl(null),
    accessGroupId: new FormControl(1),
    sourceType: new FormControl('import'),
    sourceData: new FormControl('')
  });
};
