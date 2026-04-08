/**
 * This module contains form definitions for the Edit agent page.
 */
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Form to edit an agent
 */
export interface EditAgentForm {
  isActive: FormControl<boolean>;
  userId: FormControl<number | null>;
  agentName: FormControl<string>;
  cpuOnly: FormControl<boolean | null>;
  cmdPars: FormControl<string>;
  ignoreErrors: FormControl<number | null>;
  isTrusted: FormControl<boolean>;
}

/**
 * Form to update an agent's assignment to a task
 */
export interface UpdateAssignmentForm {
  taskId: FormControl<number | null>;
}

/**
 * Get empty EditAgentForm
 * @returns Empty Instance of EditAgentForm
 */
export const getEditAgentForm = (readonly: boolean = false) => {
  return new FormGroup<EditAgentForm>({
    isActive: new FormControl<boolean>({ value: false, disabled: readonly }, { nonNullable: true, validators: [Validators.required] }),
    userId: new FormControl<number | null>({ value: null, disabled: readonly }),
    agentName: new FormControl<string>({ value: '', disabled: readonly }, { nonNullable: true, validators: [Validators.required] }),
    cpuOnly: new FormControl<boolean | null>({ value: null, disabled: readonly }),
    cmdPars: new FormControl<string>({ value: '', disabled: readonly }, { nonNullable: true }),
    ignoreErrors: new FormControl<number | null>({ value: null, disabled: readonly }),
    isTrusted: new FormControl<boolean>({ value: false, disabled: readonly }, { nonNullable: true })
  });
};

/**
 * Get empty instance of updateAssignmentForm
 */
export const getUpdateAssignmentForm = (readonly: boolean = false) => {
  return new FormGroup<UpdateAssignmentForm>({
    taskId: new FormControl<number | null>({ value: null, disabled: readonly })
  });
};
