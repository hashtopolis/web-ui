/**
 * This module contains the form to create a new preprocessor type
 */
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ValidationPatterns } from '@services/main.config';

/**
 * Interface definition for NewPreprocessorForm
 * @prop name                 Name of preprocessor
 * @prop binaryName           Binary Basename
 * @prop url                  URL to download preprocessor from
 * @prop keyspaceCommand      Flag for keyspace options
 * @prop skipCommand          Flag for skip options
 * @prop limitCommand         Flag for limit options
 */
export interface NewEditPreprocessorForm {
  name: FormControl<string>;
  binaryName: FormControl<string>;
  url: FormControl<string>;
  keyspaceCommand: FormControl<string>;
  skipCommand: FormControl<string>;
  limitCommand: FormControl<string>;
}

/**
 * Get empty instance of NewPreprocessorForm
 * @return Form group of NewPreprocessorForm
 */
export const getNewEditPreprocessorForm = () => {
  return new FormGroup<NewEditPreprocessorForm>({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    binaryName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    url: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(ValidationPatterns.URL)]
    }),
    keyspaceCommand: new FormControl<string>('--keyspace', { nonNullable: true }),
    skipCommand: new FormControl<string>('--skip', { nonNullable: true }),
    limitCommand: new FormControl<string>('--limit', { nonNullable: true })
  });
};
