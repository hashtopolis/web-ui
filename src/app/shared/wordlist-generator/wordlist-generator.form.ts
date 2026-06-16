import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { atLeastOneFieldRequiredValidator } from '@src/app/core/_validators/at-least-one-required.validator';

/**
 * Type definition for the GenerateWordListForm.
 * Represents the structure of the form used to generate a wordlist.
 */
export type GenerateWordListForm = {
  names: FormArray<FormControl<string>>;
  specialdates: FormControl<string>;
  sparetext: FormArray<FormControl<string>>;
  useSpecCharacters: FormControl<boolean>;
  usePermutations: FormControl<boolean>;
  isCapitalize: FormControl<boolean>;
  isAlternated: FormControl<boolean>;
  isUppercase: FormControl<boolean>;
  isLowercase: FormControl<boolean>;
  isSimilarVowels: FormControl<boolean>;
  isSimilarConsonant: FormControl<boolean>;
  isSimilarSpecialChars: FormControl<boolean>;
  filename: FormControl<string>;
};

/**
 * FormGroup for generating a wordlist.
 * Contains fields for names, special dates, spare text, and various options.
 * Validates that a filename is specified and at least one of the fields is filled.
 */
export class GenerateWordListFormGroup extends FormGroup<GenerateWordListForm> {
  constructor() {
    super(
      {
        names: new FormArray<FormControl<string>>([new FormControl<string>('', { nonNullable: true })]),
        specialdates: new FormControl<string>('', { nonNullable: true }),
        sparetext: new FormArray<FormControl<string>>([new FormControl<string>('', { nonNullable: true })]),
        useSpecCharacters: new FormControl<boolean>(false, { nonNullable: true }),
        usePermutations: new FormControl<boolean>(false, { nonNullable: true }),
        isCapitalize: new FormControl<boolean>(false, { nonNullable: true }),
        isAlternated: new FormControl<boolean>(false, { nonNullable: true }),
        isUppercase: new FormControl<boolean>(false, { nonNullable: true }),
        isLowercase: new FormControl<boolean>(false, { nonNullable: true }),
        isSimilarVowels: new FormControl<boolean>(false, { nonNullable: true }),
        isSimilarConsonant: new FormControl<boolean>(false, { nonNullable: true }),
        isSimilarSpecialChars: new FormControl<boolean>(false, { nonNullable: true }),
        filename: new FormControl<string>('wordlist.txt', { nonNullable: true, validators: [Validators.required] })
      },
      {
        validators: atLeastOneFieldRequiredValidator(['names', 'specialdates', 'sparetext'])
      }
    );
  }

  /**
   * Adds a new empty control to a FormArray.
   * @param controlName Name of the FormArray control to which the new control will be added.
   * @throws Error if the control is not a FormArray.
   */
  addControlToArray(controlName: keyof GenerateWordListForm): void {
    const control = this.get(controlName);
    if (control instanceof FormArray) {
      control.push(new FormControl<string>('', { nonNullable: true }));
    } else {
      throw new Error(`${controlName} is not a FormArray`);
    }
  }

  /**
   * Removes an item from a FormArray by index.
   * @param controlName Name of the FormArray control from which the item will be removed.
   * @param index Index of the item to be removed.
   * @throws Error if the control is not a FormArray.
   */
  removeControlFromArray(controlName: keyof GenerateWordListForm, index: number): void {
    const control = this.get(controlName);
    if (control instanceof FormArray) {
      control.removeAt(index);
    } else {
      throw new Error(`${controlName} is not a FormArray`);
    }
  }
}
