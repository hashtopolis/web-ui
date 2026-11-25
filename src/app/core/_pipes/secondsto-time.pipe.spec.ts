import { SecondsToTimePipe } from '@src/app/core/_pipes/secondsto-time.pipe';

describe('SecondsToTimePipe', () => {
  const pipe = new SecondsToTimePipe();

  it.each([
    [1, '00:00:01'],
    [3661, '01:01:01'],
    [1.999, '00:00:01'],
    [86_399, '23:59:59'],
    [86_400, '1 Day 00:00:00'],
    [90_061, '1 Day 01:01:01'],
    [172_861, '2 Days 00:01:01']
  ])('formats %s seconds as %s', (seconds, expected) => {
    const result = pipe.transform(seconds);

    expect(result).toBe(expected);
  });

  it.each([NaN, -1, 0, 0.5])('returns N/A for invalid or insufficient seconds: %s', (seconds) => {
    const result = pipe.transform(seconds);

    expect(result).toBe('N/A');
  });
});
