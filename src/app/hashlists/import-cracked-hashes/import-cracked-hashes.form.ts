import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Interface definition for import of pre cracked hashes
 */
export interface ImportCrackedHashesForm {
  name: FormControl<string>;
  hashlistFormat: FormControl<string>;
  fieldSeparator: FormControl<string>;
  isSalted: FormControl<boolean>;
  hashCount: FormControl<number>;
  separator: FormControl<string>;
  sourceType: FormControl<string>;
  sourceData: FormControl<string>;
  hashes: FormControl<string>;
  conflictResolution?: FormControl<boolean>;
}

/**
 * Get empty instance of ImportCrackedHashesForm
 */
export const getImportCrackedHashesForm = () => {
  return new FormGroup<ImportCrackedHashesForm>({
    name: new FormControl({ value: '', disabled: true }),
    hashlistFormat: new FormControl({ value: '', disabled: true }),
    fieldSeparator: new FormControl('', {
      validators: [Validators.required]
    }),
    isSalted: new FormControl({ value: false, disabled: true }),
    hashCount: new FormControl({ value: 0, disabled: true }),
    separator: new FormControl(''),
    sourceType: new FormControl('paste'),
    sourceData: new FormControl(''),
    hashes: new FormControl(''),
    conflictResolution: new FormControl(false)
  });
};
