/**
 * This module contains form definitions for creating new files (dictionaries, rules, etc.)
 */

import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Interface definition for NewFilesForm
 */
export interface NewFilesForm {
  filename: FormControl<string>;
  isSecret: FormControl<boolean>;
  fileType: FormControl<number | null>;
  accessGroupId: FormControl<number>;
  sourceType: FormControl<string>;
  sourceData: FormControl<string>;
  url: FormControl<string>;
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
    filename: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    isSecret: new FormControl<boolean>(true, { nonNullable: true }),
    fileType: new FormControl<number | null>(null),
    accessGroupId: new FormControl<number>(1, { nonNullable: true }),
    sourceType: new FormControl<string>('import', { nonNullable: true }),
    sourceData: new FormControl<string>('', { nonNullable: true }),
    url: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  });
};
