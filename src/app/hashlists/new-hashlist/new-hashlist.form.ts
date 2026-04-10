/**
 * This module contains form definitions for the new hashlit page.
 */
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AccessGroupId } from '@models/id.types';

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
  accessGroupId: FormControl<AccessGroupId | null>;
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
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    hashTypeId: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    format: new FormControl<number>(0, { nonNullable: true }),
    separator: new FormControl<string>(':', { nonNullable: true }),
    isSalted: new FormControl<boolean>(false, { nonNullable: true }),
    isHexSalt: new FormControl<boolean>(false, { nonNullable: true }),
    accessGroupId: new FormControl<number | null>(null, [Validators.required]),
    useBrain: new FormControl<boolean>(false, { nonNullable: true }),
    brainFeatures: new FormControl<number>(3, { nonNullable: true }),
    notes: new FormControl<string>('', { nonNullable: true }),
    sourceType: new FormControl<string>('upload', { nonNullable: true }),
    sourceData: new FormControl<string>('', { nonNullable: true }),
    hashCount: new FormControl<number>(0, { nonNullable: true }),
    isArchived: new FormControl<boolean>(false, { nonNullable: true }),
    isSecret: new FormControl<boolean>(true, { nonNullable: true })
  });
};
