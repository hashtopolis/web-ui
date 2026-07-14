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

  it('steps up to the next unit exactly at the 1000 boundary', () => {
    expect(getHashRateFormatComponents(1000)).toEqual({ value: 1, unit: 'kH/s', scale: 1000 });
  });

  it('stays in the lower unit just below the boundary', () => {
    expect(getHashRateFormatComponents(999)).toEqual({ value: 999, unit: 'H/s', scale: 1 });
  });

  it('keeps scale = 1000 ** i in step with the chosen unit at higher tiers', () => {
    expect(getHashRateFormatComponents(2_500_000_000)).toEqual({ value: 2.5, unit: 'GH/s', scale: 1_000_000_000 });
  });

  it('clamps at the largest unit instead of running past the units array', () => {
    // 3 EH/s worth of H/s: no unit above PH/s, so it stays PH/s with the value left large.
    expect(getHashRateFormatComponents(3e18)).toEqual({ value: 3000, unit: 'PH/s', scale: 1e15 });
  });

  it('rounds the scaled value to the requested decimals', () => {
    expect(getHashRateFormatComponents(1_234_567).value).toBe(1.23);
    expect(getHashRateFormatComponents(1_234_567, 0).value).toBe(1);
  });
});
