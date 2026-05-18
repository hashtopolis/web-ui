import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates that the attack command contains the hashlist alias and
 * has additional non-whitespace content besides the alias itself.
 */
export function attackCommandWithAliasValidator(alias: string = '#HL#'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rawValue = control.value;
    const value = typeof rawValue === 'string' ? rawValue : '';

    // Leave empty checks to Validators.required.
    if (!value.trim()) {
      return null;
    }

    if (!value.includes(alias)) {
      return { missingHashlistAlias: true };
    }

    const contentWithoutAlias = value.split(alias).join('').trim();
    if (!contentWithoutAlias) {
      return { attackCommandNeedsAdditionalContent: true };
    }

    return null;
  };
}
