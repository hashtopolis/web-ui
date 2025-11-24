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
export const getEditAgentForm = (readonly: boolean = false) => {
  return new FormGroup<EditAgentForm>({
    isActive: new FormControl({ value: false, disabled: readonly }, [Validators.required]),
    userId: new FormControl({ value: undefined, disabled: readonly }),
    agentName: new FormControl({ value: '', disabled: readonly }, [Validators.required]),
    token: new FormControl({ value: '', disabled: readonly }),
    cpuOnly: new FormControl({ value: undefined, disabled: readonly }),
    cmdPars: new FormControl({ value: '', disabled: readonly }),
    ignoreErrors: new FormControl({ value: undefined, disabled: readonly }),
    isTrusted: new FormControl({ value: false, disabled: readonly })
  });
};

/**
 * Get empty instance of updateAssignmentForm
 */
export const getUpdateAssignmentForm = (readonly: boolean = false) => {
  return new FormGroup<UpdateAssignmentForm>({
    taskId: new FormControl({ value: undefined, disabled: readonly })
  });
};
