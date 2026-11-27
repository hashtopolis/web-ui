import { FormControl } from '@angular/forms';

import { urlValidator } from '@src/app/core/_validators/url.validator';

describe('urlValidator', () => {
  const validate = urlValidator();

  it.each([null, '', '  '])('accepts empty value %s', (value) => {
    expect(validate(new FormControl(value))).toBeNull();
  });

  it.each(['http://example.com', ' HTTPS://example.com/path?q=1 ', 'https://localhost:8080'])('accepts %s', (value) => {
    expect(validate(new FormControl(value))).toBeNull();
  });

  it.each(['example.com', 'http:/example.com', 'ftp://example.com', 'http://', 'http://[invalid]'])(
    'rejects %s with the trimmed value',
    (value) => {
      expect(validate(new FormControl(` ${value} `))).toStrictEqual({ invalidUrl: { value } });
    }
  );
});
