import { isColorLight } from '@src/app/shared/utils/forms';

describe('isColorLight', () => {
  it('returns true for white', () => {
    expect(isColorLight('#FFFFFF')).toBe(true);
  });

  it('returns true for a light yellow', () => {
    expect(isColorLight('#FFEE99')).toBe(true);
  });

  it('returns false for black', () => {
    expect(isColorLight('#000000')).toBe(false);
  });

  it('returns false for a saturated blue', () => {
    expect(isColorLight('#1A33CC')).toBe(false);
  });

  it('returns false for null/undefined/empty', () => {
    expect(isColorLight(null)).toBe(false);
    expect(isColorLight(undefined)).toBe(false);
    expect(isColorLight('')).toBe(false);
  });

  it('returns false for malformed input', () => {
    expect(isColorLight('#zzz')).toBe(false);
    expect(isColorLight('#zzzzzz')).toBe(false);
  });
});
