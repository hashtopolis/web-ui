/**
 * This module contains the form to create a new cracker type
 */
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Interface definition for NewUserForm
 * @prop typeName                 Name of cracker type
 * @prop isChunkingAvailable      Flag indicating if cracker supports chunking
 */
export interface NewCrackerForm {
  typeName: FormControl<string>;
  // Only crackers with chunking are supported right now: isChunkingAvailable: FormControl<boolean | null>;
}

/**
 * Get empty instance of NewUserForm
 * @return Form group of NewUserForm
 */
export const getNewCrackerForm = () => {
  return new FormGroup<NewCrackerForm>({
    typeName: new FormControl<string>('Hashcat', { nonNullable: true, validators: [Validators.required] })
    // Only crackers with chunking are supported right now: isChunkingAvailable: new FormControl<boolean | null>(null, [Validators.required])
  });
};
