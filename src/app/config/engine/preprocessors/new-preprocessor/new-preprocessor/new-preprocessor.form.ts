/**
 * This module contains the form to create a new preprocessor type
 */
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Interface definition for NewPreprocessorForm
 * @prop name                 Name of preprocessor
 * @prop binaryName           Binary Basename
 * @prop url                  URL to download preprocessor from
 * @prop keyspaceCommand      Flag for keyspace options
 * @prop skipCommand          Flag for skip options
 * @prop limitCommand         Flag for limit options
 */
export interface NewPreprocessorForm {
  name: FormControl<string>;
  binaryName: FormControl<boolean>;
  url: FormControl<string>;
  keyspaceCommand: FormControl<string>;
  skipCommand: FormControl<string>;
  limitCommand: FormControl<string>;
}

/**
 * Get empty instance of NewPreprocessorForm
 * @return Form group of NewPreprocessorForm
 */
export const getNewPreprocessorForm = () => {
  return new FormGroup<NewPreprocessorForm>({
    name: new FormControl('', [Validators.required]),
    binaryName: new FormControl(undefined, [Validators.required]),
    url: new FormControl('', [Validators.required]),
    keyspaceCommand: new FormControl('--keyspace'),
    skipCommand: new FormControl('--skip'),
    limitCommand: new FormControl('--limit')
  });
};
