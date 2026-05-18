import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validates email-adresses with a regex, which mirrors PHP's FILTER_VALIDATE_EMAIL internal implementation
 */
export const emailValidator = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string;
  if (!value) return null;

  const phpEmailRegex =
    /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

  return phpEmailRegex.test(value) ? null : { email: true };
};
