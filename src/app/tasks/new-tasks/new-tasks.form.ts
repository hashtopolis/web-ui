/**
 * This module contains form definitions for the new tasks page.
 */
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CrackerBinaryId, CrackerBinaryTypeId, FileId, HashlistId, PreprocessorId } from '@models/id.types';
import { UIConfigService } from '@services/shared/storage.service';

import { attackCommandWithAliasValidator } from '@src/app/core/_validators/attack-command.validator';
import { environment } from '@src/environments/environment';

/**
 * Form to create a new task
 */
export interface NewTaskForm {
  taskName: FormControl<string>;
  notes: FormControl<string>;
  hashlistId: FormControl<HashlistId | null>;
  attackCmd: FormControl<string>;
  priority: FormControl<number>;
  maxAgents: FormControl<number>;
  chunkTime: FormControl<number | null>;
  statusTimer: FormControl<number | null>;
  color: FormControl<string>;
  isCpuTask: FormControl<boolean>;
  skipKeyspace: FormControl<number>;
  crackerBinaryId: FormControl<CrackerBinaryId>;
  crackerBinaryTypeId: FormControl<CrackerBinaryTypeId | null>;
  isArchived: FormControl<boolean>;
  staticChunks: FormControl<number>;
  chunkSize: FormControl<number>;
  forcePipe: FormControl<boolean>;
  preprocessorId: FormControl<PreprocessorId>;
  preprocessorCommand: FormControl<string>;
  isSmall: FormControl<boolean>;
  useNewBench: FormControl<boolean>;
  files: FormControl<FileId[]>;
}

/**
 * Get empty NewTaskForm
 * @returns Empty Instance of NewTaskForm
 */
export const getNewTaskForm = (uiService: UIConfigService) => {
  const priority = environment.config.tasks.priority;
  const maxAgents = environment.config.tasks.maxAgents;
  const chunkSize = environment.config.tasks.chunkSize;
  return new FormGroup<NewTaskForm>({
    taskName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)]
    }),
    notes: new FormControl<string>('', { nonNullable: true }),
    hashlistId: new FormControl<number | null>(null, [Validators.required]),
    attackCmd: new FormControl<string>(uiService.getUISettings()?.hashlistAlias ?? '', {
      nonNullable: true,
      validators: [Validators.required, attackCommandWithAliasValidator()]
    }),
    priority: new FormControl<number>(priority, {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('^[0-9]*$')]
    }),
    maxAgents: new FormControl<number>(maxAgents, { nonNullable: true }),
    chunkTime: new FormControl<number | null>(uiService.getUISettings()?.chunktime ?? null),
    statusTimer: new FormControl<number | null>(uiService.getUISettings()?.statustimer ?? null),
    color: new FormControl<string>('', { nonNullable: true }),
    isCpuTask: new FormControl<boolean>(false, { nonNullable: true }),
    skipKeyspace: new FormControl<number>(0, { nonNullable: true }),
    crackerBinaryId: new FormControl<number>(1, { nonNullable: true, validators: [Validators.required] }),
    crackerBinaryTypeId: new FormControl<number | null>(null, [Validators.required]),
    isArchived: new FormControl<boolean>(false, { nonNullable: true }),
    staticChunks: new FormControl<number>(0, { nonNullable: true }),
    chunkSize: new FormControl<number>(chunkSize, { nonNullable: true }),
    forcePipe: new FormControl<boolean>(false, { nonNullable: true }),
    preprocessorId: new FormControl<number>(0, { nonNullable: true }),
    preprocessorCommand: new FormControl<string>('', { nonNullable: true }),
    isSmall: new FormControl<boolean>(false, { nonNullable: true }),
    useNewBench: new FormControl<boolean>(true, { nonNullable: true }),
    files: new FormControl<number[]>([], { nonNullable: true })
  });
};

/**
 * Data structure for attack command preparation
 */
export interface AttackCommandData {
  attackCmd: string;
  preprocessorCommand?: string;
  files: FileId[];
  otherFiles?: FileId[];
}
