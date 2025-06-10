import { FormControl, FormGroup } from '@angular/forms';

/**
 * Interface definition for import of pre cracked hashes
 */
export interface ImportCrackedHashesForm {
  name: FormControl<string>;
  format: FormControl<string>;
  isSalted: FormControl<boolean>;
  hashCount: FormControl<number>;
  separator: FormControl<string>;
  hashes: FormControl<string>;
}

/**
 * Get empty instance of ImportCrackedHashesForm
 */
export const getImportCrackedHashesForm = () => {
  return new FormGroup<ImportCrackedHashesForm>({
    name: new FormControl({ value: '', disabled: true }),
    format: new FormControl({ value: '', disabled: true }),
    isSalted: new FormControl({ value: false, disabled: true }),
    hashCount: new FormControl({ value: 0, disabled: true }),
    separator: new FormControl(''),
    hashes: new FormControl('')
  });
};
