import { HashRatePipe, getHashRateFormatComponents } from '@src/app/core/_pipes/hashrate-pipe';

describe('HashRatePipe', () => {
  const pipe = new HashRatePipe();

  it('formats a hashrate as a human-readable string', () => {
    expect(pipe.transform(5_000_000)).toBe('5 MH/s');
  });
});

describe('getHashRateFormatComponents', () => {
  it('exposes value, unit and scale (divisor) in object form', () => {
    expect(getHashRateFormatComponents(5_000_000)).toEqual({ value: 5, unit: 'MH/s', scale: 1_000_000 });
  });

  it('returns scale 1 for non-positive values', () => {
    expect(getHashRateFormatComponents(0)).toEqual({ value: 0, unit: 'H/s', scale: 1 });
  });
});
