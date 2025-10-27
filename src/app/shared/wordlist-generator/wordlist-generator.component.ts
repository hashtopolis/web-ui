
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';

import { AlertService } from '@services/shared/alert.service';

import {
  GenerateWordListForm,
  GenerateWordListFormGroup
} from '@src/app/shared/wordlist-generator/wordlist-generator.form';
import { ui } from '@src/app/shared/wordlist-generator/wordlist-generator.ui';
import { Wordpolis } from '@src/app/shared/wordlist-generator/wordpolis-wrapper';

/**
 * Component for generating a wordlist based on user-provided parameters.
 * Provides a form to collect names, special dates, attributes, and various generation options.
 * Handles validation, form state, and candidate file generation.
 */
@Component({
  selector: 'wordlist-generator',
  templateUrl: './wordlist-generator.component.html',
  standalone: false
})
export class WordlistGeneratorComponent implements OnInit {
  /** Reactive form group for wordlist generation. */
  form: GenerateWordListFormGroup;

  /** Indicates if the form was submitted. Used for validation feedback. */
  submitted = false;

  /** UI text and configuration imported const in seperated ts file. */
  ui = ui;

  /**
   * Constructor.
   * @param cdr ChangeDetectorRef for manual change detection on dynamic form updates.
   * @param alert AlertService to display error messages to the user.
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private alert: AlertService
  ) {}

  /**
   * Angular lifecycle hook.
   * Initializes the form on component load.
   */
  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * Builds and initializes the wordlist form.
   */
  buildForm(): void {
    this.form = new GenerateWordListFormGroup();
  }

  /**
   * Getter for the 'names' FormArray.
   * @returns {FormArray} The FormArray containing name controls.
   */
  get names(): FormArray {
    return this.form.get('names') as FormArray;
  }

  /**
   * Getter for the 'sparetext' FormArray.
   * @returns {FormArray} The FormArray containing attribute controls.
   */
  get sparetext(): FormArray {
    return this.form.get('sparetext') as FormArray;
  }

  /**
   * Adds a new empty control to the form.
   * @param controlName Name of the FormArray control.
   */
  addControl(controlName: keyof GenerateWordListForm) {
    this.form.addControlToArray(controlName);
    this.cdr.detectChanges();
  }

  /**
   * Removes an item from the form by index.
   * @param controlName
   * @param index
   */
  removeItem(controlName: keyof GenerateWordListForm, index: number) {
    this.form.removeControlFromArray(controlName, index);
    this.cdr.detectChanges();
  }

  /**
   * Type-casts an AbstractControl to FormControl.
   * @param control The AbstractControl to cast.
   * @returns {FormControl} The cast FormControl.
   */
  getFormControl(control: AbstractControl): FormControl {
    return control as FormControl;
  }

  /**
   * Handles form submission.
   * Validates the form, gathers input data, and invokes candidate generation.
   * Displays errors via the alert service if generation fails.
   */
  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      const formData = this.form.value;

      const {
        names,
        specialdates,
        sparetext,
        useSpecCharacters,
        usePermutations,
        isCapitalize,
        isAlternated,
        isUppercase,
        isLowercase,
        isSimilarVowels,
        isSimilarConsonant,
        isSimilarSpecialChars,
        filename
      } = formData;

      const options = {
        useSpecialchars: useSpecCharacters,
        usePermutations: usePermutations,
        isCapitalize: isCapitalize,
        isAlternated: isAlternated,
        isUppercase: isUppercase,
        isLowercase: isLowercase,
        isSimilarVowels: isSimilarVowels,
        isSimilarConsonant: isSimilarConsonant,
        isSimilarSpecialchars: isSimilarSpecialChars,
        filename: filename
      };

      try {
        Wordpolis.generateCandidates(names, specialdates, sparetext, options);
      } catch (error) {
        console.error(ui.submitError, error);
        this.alert.showErrorMessage(ui.submitError);
      } finally {
        this.submitted = false;
      }
    }
  }
}
