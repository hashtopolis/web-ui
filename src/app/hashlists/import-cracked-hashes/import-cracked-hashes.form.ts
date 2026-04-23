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
  conflictResolution: FormControl<boolean>;
}

/**
 * Get empty instance of ImportCrackedHashesForm
 */
export const getImportCrackedHashesForm = () => {
  return new FormGroup<ImportCrackedHashesForm>({
    name: new FormControl<string>({ value: '', disabled: true }, { nonNullable: true }),
    hashlistFormat: new FormControl<string>({ value: '', disabled: true }, { nonNullable: true }),
    fieldSeparator: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    isSalted: new FormControl<boolean>({ value: false, disabled: true }, { nonNullable: true }),
    hashCount: new FormControl<number>({ value: 0, disabled: true }, { nonNullable: true }),
    separator: new FormControl<string>('', { nonNullable: true }),
    sourceType: new FormControl<string>('paste', { nonNullable: true }),
    sourceData: new FormControl<string>('', { nonNullable: true }),
    hashes: new FormControl<string>('', { nonNullable: true }),
    conflictResolution: new FormControl<boolean>(false, { nonNullable: true })
  });
};
