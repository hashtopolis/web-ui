import { GenerateWordListFormGroup } from '@src/app/shared/wordlist-generator/wordlist-generator.form';
import { ui } from '@src/app/shared/wordlist-generator/wordlist-generator.ui';

describe('wordlist generator UI', () => {
  it('maps field names to the corresponding form controls', () => {
    const form = new GenerateWordListFormGroup();

    expect(form.get(ui.names.arrayName)).toBe(form.controls.names);
    expect(form.get(ui.sparetext.arrayName)).toBe(form.controls.sparetext);
    expect(form.get(ui.specialDate.formControlName)).toBe(form.controls.specialdates);
    expect(form.get(ui.additionalOptions.fileName.formControlName)).toBe(form.controls.filename);
  });

  it('provides one labeled checkbox for each boolean option', () => {
    const form = new GenerateWordListFormGroup();
    const checkboxes = ui.additionalOptions.checkboxes;
    const booleanControls = Object.entries(form.controls)
      .filter(([, control]) => typeof control.value === 'boolean')
      .map(([name]) => name);

    expect(checkboxes.map(({ control }) => control).sort()).toStrictEqual(booleanControls.sort());
    expect(checkboxes.every(({ label }) => label.trim().length > 0)).toBe(true);
  });

  it('provides text for the dialog, submission and validation errors', () => {
    expect(ui.dialogTitle).toBe('WordList Generator');
    expect(ui.generateButtonLabel).toBe('Generate Wordlist');
    expect(ui.formError).toBe('Please fill in at least one of the fields names, special attributes, or special date.');
    expect(ui.submitError).toBe('Error generating wordlist.');
  });
});
