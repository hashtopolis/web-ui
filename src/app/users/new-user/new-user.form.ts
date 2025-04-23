/**
 * This module contains the form to create a new user
 */
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Interface definition for NewUserForm
 * @prop username                     Username
 * @prop email                    Email
 * @prop globalPermissionGroupId  ID of permission group
 * @prop isValid                  User activated/deactivated
 */
export interface NewUserForm {
  username: FormControl<string>;
  email: FormControl<string>;
  globalPermissionGroupId: FormControl<number>;
  isValid: FormControl<boolean>;
}

/**
 * Get empty instance of NewUserForm
 * @return Form group of NewUserForm
 */
export const getNewUserForm = () => {
  return new FormGroup<NewUserForm>({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    globalPermissionGroupId: new FormControl(undefined, [Validators.required]),
    isValid: new FormControl(false)
  });
};
