/**
 * This module contains form definitions to update a user's attributes and password
 */
import { FormControl, FormGroup } from '@angular/forms';

import { JGlobalPermissionGroup } from '@src/app/core/_models/global-permission-group.model';

/**
 * Interface definition for the updatable user attributes
 */
export interface UserUpdateData {
  globalPermissionGroupId: FormControl<number | null>;
  isValid: FormControl<boolean>;
}

/**
 * Interface definition for form to edit an user
 */
export interface EditUserForm {
  id: FormControl<number | null>;
  name: FormControl<string>;
  email: FormControl<string>;
  registered: FormControl<string>;
  lastLogin: FormControl<string>;
  globalPermissionGroup: FormControl<JGlobalPermissionGroup | null | undefined>;
  updateData: FormGroup<UserUpdateData>;
}

/**
 * Interface definition for form to update user's password
 */
export interface UpdatePassForm {
  password: FormControl<string>;
}

/**
 * Get empty instance of EditUserForm
 */
export const getEditUserForm = () => {
  return new FormGroup<EditUserForm>({
    id: new FormControl<number | null>({ value: null, disabled: true }),
    name: new FormControl<string>({ value: '', disabled: true }, { nonNullable: true }),
    email: new FormControl<string>({ value: '', disabled: true }, { nonNullable: true }),
    registered: new FormControl<string>({ value: '', disabled: true }, { nonNullable: true }),
    lastLogin: new FormControl<string>({ value: '', disabled: true }, { nonNullable: true }),
    globalPermissionGroup: new FormControl<JGlobalPermissionGroup | null>({ value: null, disabled: true }),
    updateData: new FormGroup({
      globalPermissionGroupId: new FormControl<number | null>(null),
      isValid: new FormControl<boolean>(false, { nonNullable: true })
    })
  });
};

/**
 * Get empty instance of UpdatePassForm
 */
export const getUpdatePassForm = () => {
  return new FormGroup({
    password: new FormControl<string>('', { nonNullable: true })
  });
};
