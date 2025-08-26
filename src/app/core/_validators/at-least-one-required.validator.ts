import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Creates a validator that ensures at least one of the given fields is non-empty.
 *
 * @param fieldNames Array of control names to check.
 */
export function atLeastOneFieldRequiredValidator(fieldNames: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control || !fieldNames?.length) {
      return null;
    }

    const hasValue = fieldNames.some((fieldName) => {
      const field = control.get(fieldName);

      if (!field) return false;

      const value = field.value;

      if (Array.isArray(value)) {
        return value.some((v) => v && v.toString().trim() !== '');
      }

      return value !== null && value !== undefined && value.toString().trim() !== '';
    });

    return hasValue ? null : { atLeastOneRequired: true };
  };
}
