/**
 * This module contains form definitions for the new tasks page.
 */
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UIConfigService } from '@services/shared/storage.service';

import { environment } from '@src/environments/environment';

/**
 * Form to create a new task
 */
export interface NewTaskForm {
  taskName: FormControl<string>;
  notes: FormControl<string>;
  hashlistId: FormControl<number>;
  attackCmd: FormControl<string>;
  priority: FormControl<number>;
  maxAgents: FormControl<number>;
  chunkTime: FormControl<number>;
  statusTimer: FormControl<number>;
  color: FormControl<string>;
  isCpuTask: FormControl<boolean>;
  skipKeyspace: FormControl<number>;
  crackerBinaryId: FormControl<number>;
  crackerBinaryTypeId: FormControl<number>;
  isArchived: FormControl<boolean>;
  staticChunks: FormControl<number>;
  chunkSize: FormControl<number>;
  forcePipe: FormControl<boolean>;
  preprocessorId: FormControl<number>;
  preprocessorCommand: FormControl<string>;
  isSmall: FormControl<boolean>;
  useNewBench: FormControl<boolean>;
  files: FormControl<number[]>;
}

/**
 * Get empty NewTaskForm
 * @returns Empty Instance of NewTaskForm
 */
export const getNewTaskForm = (uiService: UIConfigService) => {
  const attackCmdSetting = uiService.getUIsettings('hashlistAlias');
  const chunktimeSetting = uiService.getUIsettings('chunktime');
  const statustimerSetting = uiService.getUIsettings('statustimer');
  const priority = environment.config.tasks.priority;
  const maxAgents = environment.config.tasks.maxAgents;
  const chunkSize = environment.config.tasks.chunkSize;
  return new FormGroup<NewTaskForm>({
    taskName: new FormControl('', [Validators.required, Validators.minLength(1)]),
    notes: new FormControl(''),
    hashlistId: new FormControl(undefined, [Validators.required]),
    attackCmd: new FormControl(attackCmdSetting ? attackCmdSetting.value : '', [Validators.required]),
    priority: new FormControl(priority, [Validators.required, Validators.pattern('^[0-9]*$')]),
    maxAgents: new FormControl(maxAgents),
    chunkTime: new FormControl(chunktimeSetting ? Number(chunktimeSetting.value) : null),
    statusTimer: new FormControl(statustimerSetting ? Number(statustimerSetting.value) : null),
    color: new FormControl(''),
    isCpuTask: new FormControl(false),
    skipKeyspace: new FormControl(0),
    crackerBinaryId: new FormControl(1),
    crackerBinaryTypeId: new FormControl(),
    isArchived: new FormControl(false),
    staticChunks: new FormControl(0),
    chunkSize: new FormControl(chunkSize),
    forcePipe: new FormControl(false),
    preprocessorId: new FormControl(0),
    preprocessorCommand: new FormControl(''),
    isSmall: new FormControl(false),
    useNewBench: new FormControl(true),
    files: new FormControl([])
  });
};
