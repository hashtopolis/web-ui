import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { PermissionValues } from '@src/app/core/_constants/userpermissions.config';
import { endOfDay, startOfDay } from '@src/app/shared/utils/datetime';

/**
 * Form for generating a new API key.
 *
 * Times are picked as `Date` objects in the form and converted to unix-second
 * timestamps at submit time.
 * `scopes` is an array of permission keys from the `Perm` enum tree (e.g. `permTaskRead`).
 */
export interface NewApiKeyForm {
  validFrom: FormControl<Date | null>;
  validUntil: FormControl<Date | null>;
  scopes: FormControl<PermissionValues[]>;
}

const validityRangeValidator: ValidatorFn = (control): ValidationErrors | null => {
  const { validFrom, validUntil } = (control as FormGroup<NewApiKeyForm>).controls;
  const from = validFrom.value;
  const until = validUntil.value;
  if (from && until && startOfDay(until).getTime() < startOfDay(from).getTime()) {
    return { validityRange: true };
  }
  return null;
};

export const getNewApiKeyForm = (validityDays: number): FormGroup<NewApiKeyForm> => {
  // Inclusive day count: from = today 00:00, until = day (N-1) 23:59:59 → exactly N calendar days.
  // Inclusive day count from today 00:00 to day + (N-1) 23:59:59
  const validFrom = startOfDay(new Date());
  const lastDay = new Date(validFrom);
  lastDay.setDate(lastDay.getDate() + validityDays - 1);
  const validUntil = endOfDay(lastDay);

  return new FormGroup<NewApiKeyForm>(
    {
      validFrom: new FormControl<Date | null>(validFrom, [Validators.required]),
      validUntil: new FormControl<Date | null>(validUntil, [Validators.required]),
      scopes: new FormControl<PermissionValues[]>([], { nonNullable: true, validators: [Validators.required] })
    },
    { validators: [validityRangeValidator] }
  );
};
