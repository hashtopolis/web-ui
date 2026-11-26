import { FormControl } from '@angular/forms';

import { emailValidator } from '@src/app/core/_validators/email.validator';

describe('emailValidator', () => {
  it.each([null, '', undefined])('accepts empty value %s', (value) => {
    expect(emailValidator(new FormControl(value))).toBeNull();
  });

  it.each(['user@example.com', "first.last+tag!#$%&'*+/=?^_`{|}~-@sub.example.co", 'a@b.de'])('accepts %s', (value) => {
    expect(emailValidator(new FormControl(value))).toBeNull();
  });

  it.each([
    'a..b@example.com',
    '.a@example.com',
    'a.@example.com',
    'a@localhost',
    'a@-example.com',
    'a@example-.com',
    'a@example.c',
    'a b@example.com',
    'a@example.com ',
    'abc'
  ])('rejects %s', (value) => {
    expect(emailValidator(new FormControl(value))).toStrictEqual({ email: true });
  });
});
