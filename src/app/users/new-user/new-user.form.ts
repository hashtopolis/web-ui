/**
 * This module contains the form to create a new user
 */
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GlobalPermissionGroupId } from '@models/id.types';
import { emailValidator } from '@src/app/core/_validators/email.validator';

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
  globalPermissionGroupId: FormControl<GlobalPermissionGroupId | null>;
  isValid: FormControl<boolean>;
}

/**
 * Get empty instance of NewUserForm
 * @return Form group of NewUserForm
 */
export const getNewUserForm = () => {
  return new FormGroup<NewUserForm>({
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, emailValidator] }),
    globalPermissionGroupId: new FormControl<number | null>(null, [Validators.required]),
    isValid: new FormControl<boolean>(false, { nonNullable: true })
  });
};
