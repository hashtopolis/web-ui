// url.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Creates an Angular ValidatorFn that validates whether a control's value is a valid URL.
 * This validator attempts to parse the value using the browser's native URL API.
 * @returns A ValidatorFn function to use in Angular Reactive Forms.
 */
export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rawValue = control.value?.trim();
    if (!rawValue) {
      // Don't validate empty values; leave that to Validators.required
      return null;
    }
    if (URL.canParse(rawValue)) {
      const { hostname } = new URL(rawValue);
      return hostname ? null : { invalidUrl: { value: rawValue } };
    }
    return { invalidUrl: { value: rawValue } };
  };
}
