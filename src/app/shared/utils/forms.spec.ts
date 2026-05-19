import { isColorLight } from '@src/app/shared/utils/forms';

describe('isColorLight', () => {
  it('returns true for white', () => {
    expect(isColorLight('#FFFFFF')).toBeTrue();
  });

  it('returns true for a light yellow', () => {
    expect(isColorLight('#FFEE99')).toBeTrue();
  });

  it('returns false for black', () => {
    expect(isColorLight('#000000')).toBeFalse();
  });

  it('returns false for a saturated blue', () => {
    expect(isColorLight('#1A33CC')).toBeFalse();
  });

  it('returns false for null/undefined/empty', () => {
    expect(isColorLight(null)).toBeFalse();
    expect(isColorLight(undefined)).toBeFalse();
    expect(isColorLight('')).toBeFalse();
  });

  it('returns false for malformed input', () => {
    expect(isColorLight('#zzz')).toBeFalse();
    expect(isColorLight('#zzzzzz')).toBeFalse();
  });
});
