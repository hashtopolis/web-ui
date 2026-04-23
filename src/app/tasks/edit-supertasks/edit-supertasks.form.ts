import { FormControl, FormGroup } from '@angular/forms';

export interface EditSupertaskViewForm {
  supertaskId: FormControl<number>;
  supertaskName: FormControl<string>;
}

export function getEmptyEditSupertaskViewForm(): FormGroup<EditSupertaskViewForm> {
  return new FormGroup<EditSupertaskViewForm>({
    supertaskId: new FormControl<number>({ value: 0, disabled: true }, { nonNullable: true }),
    supertaskName: new FormControl<string>({ value: '', disabled: true }, { nonNullable: true })
  });
}
