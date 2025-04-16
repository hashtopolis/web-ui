import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UIConfigService } from '@services/shared/storage.service';

import { environment } from '@src/environments/environment';

/**
 * Interface definition for form to create new pretasks
 */
export interface NewPretaskForm {
  taskName: FormControl<string>;
  attackCmd: FormControl<string>;
  maxAgents: FormControl<number>;
  chunkTime: FormControl<number>;
  statusTimer: FormControl<number>;
  priority: FormControl<number>;
  color: FormControl<string>;
  isCpuTask: FormControl<boolean>;
  crackerBinaryTypeId: FormControl<number>;
  isSmall: FormControl<boolean>;
  useNewBench: FormControl<boolean>;
  isMaskImport: FormControl<boolean>;
  files: FormControl<number[]>;
}

/**
 * Get an empty instance of NewPretaskForm
 */
export function getNewPretaskForm(uiService: UIConfigService): FormGroup<NewPretaskForm> {
  return new FormGroup<NewPretaskForm>({
    taskName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    attackCmd: new FormControl(uiService.getUIsettings('hashlistAlias').value, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    maxAgents: new FormControl(environment.config.tasks.maxAgents, { nonNullable: true }),
    chunkTime: new FormControl(Number(uiService.getUIsettings('chunktime').value), { nonNullable: true }),
    statusTimer: new FormControl(Number(uiService.getUIsettings('statustimer').value), { nonNullable: true }),
    priority: new FormControl(environment.config.tasks.priority, { nonNullable: true }),
    color: new FormControl(''),
    isCpuTask: new FormControl(false, { nonNullable: true }),
    crackerBinaryTypeId: new FormControl(1, { nonNullable: true }),
    isSmall: new FormControl(false, { nonNullable: true }),
    useNewBench: new FormControl(true, { nonNullable: true }),
    isMaskImport: new FormControl(false, { nonNullable: true }),
    files: new FormControl([], { nonNullable: true })
  });
}
