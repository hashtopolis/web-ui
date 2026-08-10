/**
 * This module contains form definitions for the new hashlit page.
 */
import { HashListFormat, HashSource, HashcatBrainFeature } from '@constants/hashlist.config';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AccessGroupId } from '@models/id.types';

/**
 * Form to create a new hashlist
 */
export interface NewHashlistForm {
  name: FormControl<string>;
  hashTypeId: FormControl<string>;
  format: FormControl<HashListFormat>;
  separator: FormControl<string>;
  isSalted: FormControl<boolean>;
  isHexSalt: FormControl<boolean>;
  accessGroupId: FormControl<AccessGroupId | null>;
  useBrain: FormControl<boolean>;
  brainFeatures: FormControl<HashcatBrainFeature>;
  notes: FormControl<string>;
  sourceType: FormControl<HashSource>;
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
    format: new FormControl<HashListFormat>(HashListFormat.TEXT, { nonNullable: true }),
    separator: new FormControl<string>(':', { nonNullable: true }),
    isSalted: new FormControl<boolean>(false, { nonNullable: true }),
    isHexSalt: new FormControl<boolean>(false, { nonNullable: true }),
    accessGroupId: new FormControl<number | null>(null, [Validators.required]),
    useBrain: new FormControl<boolean>(false, { nonNullable: true }),
    brainFeatures: new FormControl<HashcatBrainFeature>(HashcatBrainFeature.HASHED_PASSWORDS_AND_ATTACK_POSITIONS, {
      nonNullable: true
    }),
    notes: new FormControl<string>('', { nonNullable: true }),
    sourceType: new FormControl<HashSource>(HashSource.UPLOAD, { nonNullable: true }),
    sourceData: new FormControl<string>('', { nonNullable: true }),
    hashCount: new FormControl<number>(0, { nonNullable: true }),
    isArchived: new FormControl<boolean>(false, { nonNullable: true }),
    isSecret: new FormControl<boolean>(true, { nonNullable: true })
  });
};
