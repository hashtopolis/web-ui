import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const a = control.get('newpassword').value
  const b = control.get('confirmpass').value

  return a === b ? null : { 'mismatch': true };
}