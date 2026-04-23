import { FormControl, FormGroup, Validators } from '@angular/forms';

import { attackCommandWithAliasValidator } from '@src/app/core/_validators/attack-command.validator';

export interface EditPretaskUpdateDataForm {
  taskName: FormControl<string>;
  attackCmd: FormControl<string>;
  color: FormControl<string | null>;
  chunkTime: FormControl<number>;
  priority: FormControl<number>;
  maxAgents: FormControl<number>;
  isCpuTask: FormControl<boolean>;
  isSmall: FormControl<boolean>;
}

export interface EditPretaskForm {
  pretaskId: FormControl<number>;
  statusTimer: FormControl<number>;
  useNewBench: FormControl<boolean>;
  updateData: FormGroup<EditPretaskUpdateDataForm>;
}

export function getEmptyEditPretaskForm(isReadOnly: boolean): FormGroup<EditPretaskForm> {
  return new FormGroup<EditPretaskForm>({
    pretaskId: new FormControl<number>({ value: 0, disabled: true }, { nonNullable: true }),
    statusTimer: new FormControl<number>({ value: 0, disabled: true }, { nonNullable: true }),
    useNewBench: new FormControl<boolean>({ value: false, disabled: true }, { nonNullable: true }),
    updateData: new FormGroup<EditPretaskUpdateDataForm>({
      taskName: new FormControl<string>(
        { value: '', disabled: isReadOnly },
        { nonNullable: true, validators: isReadOnly ? [] : [Validators.required] }
      ),
      attackCmd: new FormControl<string>(
        { value: '', disabled: isReadOnly },
        {
          nonNullable: true,
          validators: isReadOnly ? [] : [Validators.required, attackCommandWithAliasValidator()]
        }
      ),
      color: new FormControl<string | null>({ value: null, disabled: isReadOnly }),
      chunkTime: new FormControl<number>({ value: 0, disabled: isReadOnly }, { nonNullable: true }),
      priority: new FormControl<number>({ value: 0, disabled: isReadOnly }, { nonNullable: true }),
      maxAgents: new FormControl<number>({ value: 0, disabled: isReadOnly }, { nonNullable: true }),
      isCpuTask: new FormControl<boolean>({ value: false, disabled: isReadOnly }, { nonNullable: true }),
      isSmall: new FormControl<boolean>({ value: false, disabled: isReadOnly }, { nonNullable: true })
    })
  });
}
