import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('newPassword')?.value;
    const confirmNewPassword = control.get('confirmNewPassword')?.value;

    if (newPassword !== confirmNewPassword) {
      control.get('confirmNewPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const confirmCtrl = control.get('confirmNewPassword');
      if (confirmCtrl?.hasError('passwordMismatch')) {
        confirmCtrl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
      return null;
    }
  };
}
