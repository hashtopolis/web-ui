import { FormControl } from '@angular/forms';

import { attackCommandWithAliasValidator } from '@src/app/core/_validators/attack-command.validator';

describe('attackCommandWithAliasValidator', () => {
  const validate = (value: unknown, allowAliasOnly?: () => boolean) =>
    attackCommandWithAliasValidator(undefined, allowAliasOnly)(new FormControl(value));

  it('should leave empty values to Validators.required', () => {
    expect(validate('')).toBeNull();
    expect(validate('   ')).toBeNull();
    expect(validate(null)).toBeNull();
  });

  it('should report a missing hashlist alias', () => {
    expect(validate('-a 0 dict.txt')).toStrictEqual({ missingHashlistAlias: true });
  });

  it('should require additional content besides the alias by default', () => {
    expect(validate('#HL#')).toStrictEqual({ attackCommandNeedsAdditionalContent: true });
    expect(validate('  #HL#  ')).toStrictEqual({ attackCommandNeedsAdditionalContent: true });
  });

  it('should accept an alias-only command when allowAliasOnly returns true', () => {
    expect(validate('#HL#', () => true)).toBeNull();
  });

  it('should still require the alias when allowAliasOnly returns true', () => {
    expect(validate('-a 0 dict.txt', () => true)).toStrictEqual({ missingHashlistAlias: true });
  });

  it('should accept a command with alias and additional content', () => {
    expect(validate('-a 0 #HL# dict.txt')).toBeNull();
  });

  it('should support a custom alias', () => {
    const validator = attackCommandWithAliasValidator('#LIST#');
    expect(validator(new FormControl('-a 0 #LIST# dict.txt'))).toBeNull();
    expect(validator(new FormControl('-a 0 #HL# dict.txt'))).toStrictEqual({ missingHashlistAlias: true });
  });
});
