import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AccessGroupId, HashlistId } from '@models/id.types';

/**
 * Interface definition for EditHashlistForm
 */
export interface EditHashlistForm {
  hashlistId: FormControl<HashlistId | null>;
  accessGroupId: FormControl<AccessGroupId | null>;
  useBrain: FormControl<boolean | null>;
  format: FormControl<string | null>;
  hashCount: FormControl<number | null>;
  cracked: FormControl<number | null>;
  remaining: FormControl<number | null>;
  updateData: FormGroup<{
    name: FormControl<string | null>;
    notes: FormControl<string | null>;
    isSecret: FormControl<boolean | null>;
    accessGroupId: FormControl<AccessGroupId | null>;
  }>;
}

/**
 * Get empty instance of EditHashlistForm
 */
export const getEditHashlistForm = (): FormGroup<EditHashlistForm> => {
  return new FormGroup<EditHashlistForm>({
    hashlistId: new FormControl<number | null>({ value: null, disabled: true }),
    accessGroupId: new FormControl<number | null>({ value: null, disabled: true }),
    useBrain: new FormControl<boolean | null>({ value: null, disabled: true }),
    format: new FormControl<string | null>({ value: null, disabled: true }),
    hashCount: new FormControl<number | null>({ value: null, disabled: true }),
    cracked: new FormControl<number | null>({ value: null, disabled: true }),
    remaining: new FormControl<number | null>({ value: null, disabled: true }),
    updateData: new FormGroup({
      name: new FormControl<string | null>(null, [Validators.required]),
      notes: new FormControl<string | null>(null),
      isSecret: new FormControl<boolean | null>(null),
      accessGroupId: new FormControl<number | null>(null)
    })
  });
};
