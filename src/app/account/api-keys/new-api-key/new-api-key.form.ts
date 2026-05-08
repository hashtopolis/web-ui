import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { endOfDay, startOfDay } from '@src/app/shared/utils/datetime';

/**
 * Reactive form shape for the New API Key page.
 *
 * Times are picked as `Date` objects in the form and converted to unix-second
 * timestamps at submit time (the only place the conversion happens, to keep the
 * UI free of timestamp arithmetic).
 *
 * `scopes` is an array of permission name strings (e.g. `permTaskRead`).
 * Numeric indices were considered but rejected: the backend matches scopes by
 * name against the user's right-group permission map, so passing names through
 * unchanged avoids an avoidable id↔name lookup.
 */
export interface NewApiKeyForm {
  validFrom: FormControl<Date | null>;
  validUntil: FormControl<Date | null>;
  scopes: FormControl<string[]>;
}

const DEFAULT_VALIDITY_DAYS = 90;

const validityRangeValidator: ValidatorFn = (group): ValidationErrors | null => {
  const from = group.get('validFrom')?.value as Date | null;
  const until = group.get('validUntil')?.value as Date | null;
  if (from && until && until.getTime() <= from.getTime()) {
    return { validityRange: true };
  }
  return null;
};

/** Build a New API Key form pre-filled with sensible defaults (90-day validity, no scopes). */
export const getNewApiKeyForm = (): FormGroup<NewApiKeyForm> => {
  // Inclusive day count: from = today 00:00, until = day (N-1) 23:59:59 → exactly N calendar days.
  // Using +DEFAULT_VALIDITY_DAYS would inclusive-count to N+1 and the help text would disagree.
  const validFrom = startOfDay(new Date());
  const lastDay = new Date(validFrom);
  lastDay.setDate(lastDay.getDate() + DEFAULT_VALIDITY_DAYS - 1);
  const validUntil = endOfDay(lastDay);

  return new FormGroup<NewApiKeyForm>(
    {
      validFrom: new FormControl<Date | null>(validFrom, [Validators.required]),
      validUntil: new FormControl<Date | null>(validUntil, [Validators.required]),
      scopes: new FormControl<string[]>([], { nonNullable: true, validators: [Validators.required] })
    },
    { validators: [validityRangeValidator] }
  );
};
