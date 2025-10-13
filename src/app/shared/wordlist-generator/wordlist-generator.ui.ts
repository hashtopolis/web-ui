/**
 * Centralized UI label and hint definitions for the WordList Generator component.
 *
 * This object is intended for use in templates and component code to provide all static
 * UI text, labels, tooltips, section titles, and error messages. Keeping UI strings here
 * makes the component logic cleaner, prepares for easier localization, and improves maintainability.
 *
 * @example
 *  * // Import the UI labels object into your component:
 *  * import { ui } from './wordlist-ui';
 *  *
 * @example
 * // Then Use the UI labels in your component template:
 * * <h1>{{ ui.dialogTitle }}</h1>
 * * <label>{{ ui.names.inputLabel }}</label>
 * * <input [placeholder]="ui.names.inputPlaceholder" />
 */
export const ui = {
  /**
   * Dialog title shown at the top of the dialog.
   */
  dialogTitle: 'WordList Generator',

  /**
   * Strings for the names FormArray section.
   */
  names: {
    arrayName: 'names',
    inputLabel: 'Name',
    inputPlaceholder: 'Enter name',
    tooltip: "Target's name hint",
    hint: 'Name, Middle, Surname. Include as many middle names as necessary.',
    sectionLabel: 'Names'
  },

  /**
   * Strings for the special date field.
   */
  specialDate: {
    inputLabel: 'Special Date',
    formControlName: 'specialdates',
    inputName: 'specialdate',
    inputPlaceholder: 'Enter special date',
    hint: 'Birthday, family member date.'
  },

  /**
   * Strings for the sparetext FormArray section (special attributes).
   */
  sparetext: {
    arrayName: 'sparetext',
    inputLabel: 'Special Attribute',
    inputPlaceholder: 'Enter Special Attribute',
    tooltip: "Target's special attribute hint",
    hint: 'Job Title, Platform Name (i.e., github), Social Media username, Pet name, Lovers name/surname, Street name, Street number, Old Password, favorite cars, bikes, hobbies, phone number',
    sectionLabel: 'Special Attributes'
  },

  /**
   * Strings and configuration for the additional options accordion section.
   */
  additionalOptions: {
    title: 'Additional Options',
    fileName: {
      inputLabel: 'File Name',
      formControlName: 'filename',
      inputName: 'filename',
      inputPlaceholder: 'Wordlist.txt',
      hint: 'Name of the generated wordlist file'
    },
    /**
     * Labels and form control names for all option checkboxes.
     */
    checkboxes: [
      { control: 'useSpecCharacters', label: 'Add special chars' },
      { control: 'usePermutations', label: 'Permutations' },
      { control: 'isCapitalize', label: 'Capitalize' },
      { control: 'isAlternated', label: 'Alternate capitalize' },
      { control: 'isUppercase', label: 'All Uppercase' },
      { control: 'isLowercase', label: 'All Lowercase' },
      { control: 'isSimilarVowels', label: 'Similar Vowels (Replace vowels for similar numbers. ie. G = 6)' },
      {
        control: 'isSimilarConsonant',
        label: 'Similar Consonants (Replace consonants for similar numbers. ie. s = 5)'
      },
      {
        control: 'isSimilarSpecialChars',
        label: 'Similar Special Chars (Replace vowels and consonants for similar special chars. ie. h = #)'
      }
    ]
  },

  /**
   * Button label for generating the wordlist.
   */
  generateButtonLabel: 'Generate Wordlist',

  /**
   * Error message shown when the required fields validation fails.
   */
  formError: 'Please fill in at least one of the fields names, special attributes, or special date.',

  submitError: 'Error generating wordlist.'
};
