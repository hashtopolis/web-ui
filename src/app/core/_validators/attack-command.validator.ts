import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates that the attack command contains the hashlist alias and
 * has additional non-whitespace content besides the alias itself.
 *
 * @param alias           Hashlist alias that has to be part of the attack command
 * @param allowAliasOnly  Optional predicate; when it returns true, an attack command consisting only of the alias
 *                        is accepted. This is required for tasks using a preprocessor, where the candidates are
 *                        piped into the cracker and the attack command may legitimately be just the alias.
 */
export function attackCommandWithAliasValidator(
  alias: string = '#HL#',
  allowAliasOnly: (control: AbstractControl) => boolean = () => false
): ValidatorFn {
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
    if (!contentWithoutAlias && !allowAliasOnly(control)) {
      return { attackCommandNeedsAdditionalContent: true };
    }

    return null;
  };
}
