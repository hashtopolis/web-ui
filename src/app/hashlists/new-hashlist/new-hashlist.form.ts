/**
 * This module contains form definitions for the new hashlit page.
 */
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Form to create a new hashlist
 */
export interface NewHashlistForm {
  name: FormControl<string>;
  hashTypeId: FormControl<string>;
  format: FormControl<number>;
  separator: FormControl<string>;
  isSalted: FormControl<boolean>;
  isHexSalt: FormControl<boolean>;
  accessGroupId: FormControl<number>;
  useBrain: FormControl<boolean>;
  brainFeatures: FormControl<number>;
  notes: FormControl<string>;
  sourceType: FormControl<string>;
  sourceData: FormControl<string>;
  hashCount: FormControl<number>;
  isArchived: FormControl<boolean>;
  isSecret: FormControl<boolean>;
}

/**
 * Get empty NewHashlistForm
 * @returns Empty Instance of NewHashlistForm
 */
export const getNewHashlistForm = () => {
  return new FormGroup<NewHashlistForm>({
    name: new FormControl('', [Validators.required]),
    hashTypeId: new FormControl('', [Validators.required]),
    format: new FormControl(0),
    separator: new FormControl(':'),
    isSalted: new FormControl(false),
    isHexSalt: new FormControl(false),
    accessGroupId: new FormControl(undefined, [Validators.required]),
    useBrain: new FormControl(false),
    brainFeatures: new FormControl(3),
    notes: new FormControl(''),
    sourceType: new FormControl('upload'),
    sourceData: new FormControl(''),
    hashCount: new FormControl(0),
    isArchived: new FormControl(false),
    isSecret: new FormControl(true)
  });
};
