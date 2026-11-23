import { FileSizePipe } from '@src/app/core/_pipes/file-size.pipe';

describe('FileSizePipe', () => {
  const pipe = new FileSizePipe();

  it.each([
    [49_152, false, '48 KB'],
    [49_152, true, '48 Kilobytes'],
    [1_234_567, false, '1205.63 KB']
  ])('formats %s bytes with longForm=%s', (size, longForm, expected) => {
    const result = pipe.transform(size, longForm);

    expect(result).toBe(expected);
  });

  it.each([0, -1, 0.5])('returns zero bytes for a size below one: %s', (size) => {
    const result = pipe.transform(size, false);

    expect(result).toBe('0 B');
  });

  it.each([
    [1, '1 B '],
    [1024, '1 KB'],
    [1025, '1025 B '],
    [1024 ** 2, '1024 KB']
  ])('uses the existing scale at the threshold for %s bytes', (size, expected) => {
    const result = pipe.transform(size, false);

    expect(result).toBe(expected);
  });

  it('uses a custom base and threshold', () => {
    const result = pipe.transform(1_234_567, false, 1000, 1000);

    expect(result).toBe('1234.57 KB');
  });

  it('uses a custom threshold independently of the base', () => {
    const result = pipe.transform(1024, false, 1024, 512);

    expect(result).toBe('1024 B ');
  });

  it('caps the unit at the largest available unit', () => {
    const result = pipe.transform(1024 ** 9, false);

    expect(result).toBe('1024 YB');
  });
});
