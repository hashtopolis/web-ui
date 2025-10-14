/**
 * This module contains form definitions for the new tasks page.
 */
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Form interface to add users to access group
 */
export interface AddUserForm {
  userIds: FormControl<number[]>;
}

export interface AddAgentsForm {
  agentIds: FormControl<number[]>;
}

/**
 * Get empty AddUsersForm
 * @returns Empty Instance of AddUsersForm
 */
export const getAddUsersForm = () => {
  return new FormGroup<AddUserForm>({
    userIds: new FormControl(undefined, [Validators.required])
  });
};

/**
 * Get empty AddUAgentsForm
 * @returns Empty Instance of AddUsersForm
 */
export const getAddAgentsForm = () => {
  return new FormGroup<AddAgentsForm>({
    agentIds: new FormControl(undefined, [Validators.required])
  });
};
