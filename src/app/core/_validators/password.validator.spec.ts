import { FormControl, FormGroup } from '@angular/forms';

import { passwordMatchValidator } from '@src/app/core/_validators/password.validator';

describe('passwordMatchValidator', () => {
  const validate = passwordMatchValidator();

  it('accepts missing controls', () => {
    expect(validate(new FormGroup({}))).toBeNull();
  });

  it.each([
    ['', 'secret'],
    ['secret', ''],
    ['secret', 'secret']
  ])('accepts values %s and %s', (password, confirmation) => {
    expect(
      validate(
        new FormGroup({ newPassword: new FormControl(password), confirmNewPassword: new FormControl(confirmation) })
      )
    ).toBeNull();
  });

  it('rejects different non-empty passwords', () => {
    expect(
      validate(new FormGroup({ newPassword: new FormControl('secret'), confirmNewPassword: new FormControl('Secret') }))
    ).toStrictEqual({ passwordMismatch: true });
  });
});
