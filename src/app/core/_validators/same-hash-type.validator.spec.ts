import { FormControl } from '@angular/forms';

import { JHashlist } from '@models/hashlist.model';

import { sameHashTypeValidator } from '@src/app/core/_validators/same-hash-type.validator';

const hashlist = (id: number, hashTypeId: number): JHashlist => ({
  id,
  type: 'hashlist',
  hashTypeId,
  accessGroupId: 1,
  brainFeatures: 0,
  name: 'test',
  isHexSalt: false,
  isSecret: false,
  isSalted: false,
  useBrain: false,
  hashCount: 0,
  cracked: 0,
  notes: '',
  isArchived: false
});

describe('sameHashTypeValidator', () => {
  it.each([null, [], [1], 'invalid'])('accepts fewer than two selected IDs or non-array value %s', (value) => {
    const getHashlists = vi.fn().mockName('getHashlists');
    expect(sameHashTypeValidator(getHashlists)(new FormControl(value))).toBeNull();
    expect(getHashlists).not.toHaveBeenCalled();
  });

  it('accepts selections when hashlists are not loaded', () => {
    expect(sameHashTypeValidator(() => [])(new FormControl([1, 2]))).toBeNull();
  });

  it('accepts same types and ignores unknown IDs', () => {
    const validate = sameHashTypeValidator(() => [hashlist(1, 10), hashlist(2, 10)]);
    expect(validate(new FormControl([1, 2, 3]))).toBeNull();
    expect(validate(new FormControl([3, 4]))).toBeNull();
  });

  it('rejects mixed known types even when an ID is unknown', () => {
    const validate = sameHashTypeValidator(() => [hashlist(1, 10), hashlist(2, 20)]);
    expect(validate(new FormControl([1, 3, 2]))).toStrictEqual({ mixedHashTypes: true });
  });

  it('uses the latest hashlists on each validation', () => {
    let hashlists = [hashlist(1, 10), hashlist(2, 10)];
    const validate = sameHashTypeValidator(() => hashlists);
    const control = new FormControl([1, 2]);
    expect(validate(control)).toBeNull();
    hashlists = [hashlist(1, 10), hashlist(2, 20)];
    expect(validate(control)).toStrictEqual({ mixedHashTypes: true });
  });
});
