import { FormControl, FormGroup } from '@angular/forms';

import { atLeastOneFieldRequiredValidator } from '@src/app/core/_validators/at-least-one-required.validator';

describe('atLeastOneFieldRequiredValidator', () => {
  it('accepts an empty field list', () => {
    expect(atLeastOneFieldRequiredValidator([])(new FormGroup({}))).toBeNull();
  });

  it('rejects missing, null, undefined, whitespace and empty array fields', () => {
    const group = new FormGroup({
      a: new FormControl(null),
      b: new FormControl(undefined),
      c: new FormControl('  '),
      d: new FormControl([null, '', '  ', 0, false])
    });
    expect(atLeastOneFieldRequiredValidator(['missing', 'a', 'b', 'c', 'd'])(group)).toStrictEqual({
      atLeastOneRequired: true
    });
  });

  it.each([['text'], [0], [false], [['', ' value ']], [[0, 42]]])(
    'accepts a non-empty scalar or array value %s',
    (value) => {
      const group = new FormGroup({ field: new FormControl(value) });
      expect(atLeastOneFieldRequiredValidator(['missing', 'field'])(group)).toBeNull();
    }
  );
});
