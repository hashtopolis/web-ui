/**
 * This module contains form definitions for the Edit agent page.
 */
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Form to edit an agent
 */
export interface EditAgentForm {
  isActive: FormControl<boolean>;
  userId: FormControl<number>;
  agentName: FormControl<string>;
  token: FormControl<string>;
  cpuOnly: FormControl<number>;
  cmdPars: FormControl<string>;
  ignoreErrors: FormControl<number>;
  isTrusted: FormControl<boolean>;
}

/**
 * Form to update an agent's assignment to a task
 */
export interface UpdateAssignmentForm {
  taskId: FormControl<number>;
}

/**
 * Get empty EditAgentForm
 * @returns Empty Instance of EditAgentForm
 */
export const getEditAgentForm = () => {
  return new FormGroup<EditAgentForm>({
    isActive: new FormControl(false, [Validators.required]),
    userId: new FormControl(undefined),
    agentName: new FormControl('', [Validators.required]),
    token: new FormControl(''),
    cpuOnly: new FormControl(undefined),
    cmdPars: new FormControl(''),
    ignoreErrors: new FormControl(undefined),
    isTrusted: new FormControl(false)
  });
};

/**
 * Get empty instance of updateAssignmentForm
 */
export const getUpdateAssignmentForm = () => {
  return new FormGroup<UpdateAssignmentForm>({
    taskId: new FormControl(0)
  });
};
