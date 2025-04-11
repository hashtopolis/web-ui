import { generateCandidates } from 'wordpolis';

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'wordlist-generator',
  templateUrl: './wordlist-generator.component.html'
})
export class WordlisGeneratorComponent implements OnInit {
  /** Form group for the password candidates. */
  form: FormGroup;

  // Dialog title
  dialogTitle = 'WordList Generator';

  // Form hints
  namehint = 'Name, Middle, Surname. Include as many middle names as necessary.';
  specialdatehint = 'Birthday,family member date. ';
  specialhint =
    'Job Title,Platform Name (i.e., github),Social Media username,Pet name,Lovers name/surname,Street name,Street number,Old Password,favorite cars, bikes, hobbies, phone number';
  filenamehint = 'Default wordlist.txt';

  // Names form array
  namesArrayName = 'names';
  nameInputLabel = 'Name';
  nameInputPlaceholder = 'Enter name';
  nameTooltip = "Target's name hint";

  // Sparetext form array
  sparetextArrayName = 'sparetext';
  specialAttributeInputLabel = 'Special Attribute';
  specialAttributeInputPlaceholder = 'Enter Special Attribute';
  specialAttributeTooltip = "Target's special attribute hint";

  // Special Date form control
  specialDateInputLabel = 'Special Date';
  specialDateFormControlName = 'specialdates';
  specialDateInputName = 'specialdate';
  specialDateInputPlaceholder = 'Enter special date';

  // Additional Options
  additionalOptionsTitle = 'Additional Options';
  fileNameInputLabel = 'File Name';
  fileNameFormControlName = 'filename';
  fileNameInputName = 'filename';
  fileNameInputPlaceholder = 'Wordlist.txt';
  fileNameHint = 'Hint for file name';

  // Checkboxes
  specCharsCheckboxFormControlName = 'useSpecCharacters';
  permutationsCheckboxFormControlName = 'usePermutations';
  capitalizeCheckboxFormControlName = 'isCapitalize';
  alternateCapitalizeCheckboxFormControlName = 'isAlternated';
  allUppercaseCheckboxFormControlName = 'isUppercase';
  allLowercaseCheckboxFormControlName = 'isLowercase';
  similarVowelsCheckboxFormControlName = 'isSimilarVowels';
  similarConsonantsCheckboxFormControlName = 'isSimilarConsonant';
  similarSpecialCharsCheckboxFormControlName = 'isSimilarSpecialChars';

  // Checkbox labels
  specCharsCheckboxLabel = 'Add special chars';
  permutationsCheckboxLabel = 'Permutations';
  capitalizeCheckboxLabel = 'Capitalize';
  alternateCapitalizeCheckboxLabel = 'Alternate capitalize';
  allUppercaseCheckboxLabel = 'All Uppercase';
  allLowercaseCheckboxLabel = 'All Lowercase';
  similarVowelsCheckboxLabel = 'Similar Vowels (Replace vowels for similar numbers. ie. G = 6)';
  similarConsonantsCheckboxLabel = 'Similar Consonants (Replace consonants for similar numbers. ie. s = 5)';
  similarSpecialCharsCheckboxLabel =
    'Similar Special Chars (Replace vowels and consonants for similar special chars. ie. h = #)';

  // Button label
  generateButtonLabel = 'Generate Wordlist';

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      names: this.fb.array(['']),
      specialdates: [''],
      sparetext: this.fb.array(['']),
      useSpecCharacters: [false],
      usePermutations: [false],
      isCapitalize: [false],
      isAlternated: [false],
      isUppercase: [false],
      isLowercase: [false],
      isSimilarVowels: [false],
      isSimilarConsonant: [false],
      isSimilarSpecialChars: [false],
      filename: ['wordlist.txt']
    });
  }

  get names() {
    return this.form.get('names') as FormArray;
  }

  get sparetext() {
    return this.form.get('sparetext') as FormArray;
  }

  removeItem(index: number, controlName: string): void {
    const formArray = this.form.get(controlName) as FormArray;
    formArray.removeAt(index);
    this.cdr.detectChanges();
  }

  addControl(controlName: string): void {
    const formArray = this.form.get(controlName) as FormArray;
    formArray.push(this.fb.control(''));
    this.cdr.detectChanges();
  }

  getFormControl(control: AbstractControl): FormControl {
    return control as FormControl;
  }

  /**
   * Generates a file containing candidate passwords based on input parameters and downloads it.
   *
   * @returns {void}
   */
  onSubmit(): void {
    const formData = this.form.value;

    const {
      names,
      specialdates,
      sparetext,
      useSpecCharacters,
      usePermutations,
      isCapitalize,
      isAlternated,
      isUppercasse,
      isLowercasse,
      isSimilarVowels,
      isSimilarConsonant,
      isSimilarSpecialchars,
      filename
    } = formData;
    const options = {
      useSpecialchars: useSpecCharacters,
      usePermutations: usePermutations,
      isCapitalize: isCapitalize,
      isAlternated: isAlternated,
      isUppercase: isUppercasse,
      isLowercase: isLowercasse,
      isSimilarVowels: isSimilarVowels,
      isSimilarConsonant: isSimilarConsonant,
      isSimilarSpecialchars: isSimilarSpecialchars,
      filename: filename
    };
    generateCandidates(names, specialdates, sparetext, options);
  }
}
