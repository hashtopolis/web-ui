/**
 * This module contains form definitions to update a user's attributes and password
 */
import { FormControl, FormGroup } from '@angular/forms';
import { JGlobalPermissionGroup } from '@src/app/core/_models/global-permission-group.model';

/**
 * Interface definition for the updatable user attributes
 */
export interface UserUpdateData {
  globalPermissionGroupId: FormControl<number>;
  isValid: FormControl<boolean>;
}

/**
 * Interface definition for form to edit an user
 */
export interface EditUserForm {
  id: FormControl<number>;
  name: FormControl<string>;
  email: FormControl<string>;
  registered: FormControl<string>;
  lastLogin: FormControl<string>;
  globalPermissionGroup: FormControl<JGlobalPermissionGroup>;
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
    id: new FormControl({ value: undefined, disabled: true }),
    name: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    registered: new FormControl({ value: '', disabled: true }),
    lastLogin: new FormControl({ value: '', disabled: true }),
    globalPermissionGroup: new FormControl({ value: undefined, disabled: true }),
    updateData: new FormGroup({
      globalPermissionGroupId: new FormControl(undefined),
      isValid: new FormControl(false)
    })
  });
};

/**
 * Get empty instance of UpdatePassForm
 */
export const getUpdatePassForm = () => {
  return new FormGroup({
    password: new FormControl('')
  });
};
