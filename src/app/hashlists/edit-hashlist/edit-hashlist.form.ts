import { FormControl, FormGroup } from '@angular/forms';

/**
 * Interface definition for EditHashlistForm
 */
export interface EditHashlistForm {
  hashlistId: FormControl<number>;
  accessGroupId: FormControl<number>;
  useBrain: FormControl<boolean>;
  format: FormControl<string>;
  hashCount: FormControl<number>;
  cracked: FormControl<number>;
  remaining: FormControl<number>;
  updateData: FormGroup<{
    name: FormControl<string>;
    notes: FormControl<string>;
    isSecret: FormControl<boolean>;
    accessGroupId: FormControl<number>;
  }>;
}

/**
 * Get empty instance of EditHashlistForm
 */
export const getEditHashlistForm = (): FormGroup<EditHashlistForm> => {
  return new FormGroup<EditHashlistForm>({
    hashlistId: new FormControl({ value: null, disabled: true }),
    accessGroupId: new FormControl({ value: null, disabled: true }),
    useBrain: new FormControl({ value: null, disabled: true }),
    format: new FormControl({ value: null, disabled: true }),
    hashCount: new FormControl({ value: null, disabled: true }),
    cracked: new FormControl({ value: null, disabled: true }),
    remaining: new FormControl({ value: null, disabled: true }),
    updateData: new FormGroup({
      name: new FormControl(null) as FormControl<string>,
      notes: new FormControl(null) as FormControl<string>,
      isSecret: new FormControl(null) as FormControl<boolean>,
      accessGroupId: new FormControl(null) as FormControl<number>
    })
  });
};
