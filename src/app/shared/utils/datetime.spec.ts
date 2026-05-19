import { lastValidSecond, startOfNextDay, unixTimestampFromDate } from '@src/app/shared/utils/datetime';

describe('startOfNextDay', () => {
  it('returns local-time 00:00 of the next calendar day', () => {
    const input = new Date(2026, 7, 13, 15, 30, 45, 123); // 2026-08-13 15:30:45.123 local
    const result = startOfNextDay(input);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(7);
    expect(result.getDate()).toBe(14);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('does not mutate the input date', () => {
    const input = new Date(2026, 7, 13, 15, 30);
    const before = input.getTime();
    startOfNextDay(input);
    expect(input.getTime()).toBe(before);
  });

  it('rolls over the month boundary', () => {
    const input = new Date(2026, 7, 31, 12); // 2026-08-31 noon
    const result = startOfNextDay(input);
    expect(result.getMonth()).toBe(8); // September
    expect(result.getDate()).toBe(1);
  });

  it('rolls over the year boundary', () => {
    const input = new Date(2026, 11, 31, 23, 59); // 2026-12-31 23:59
    const result = startOfNextDay(input);
    expect(result.getFullYear()).toBe(2027);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
  });

  it('produces a unix-second cutoff one second after lastValidSecond of itself', () => {
    // Round-trip property: floor(startOfNextDay(d)/1000) - 1 === last valid second.
    const input = new Date(2026, 4, 15, 9);
    const cutoff = unixTimestampFromDate(startOfNextDay(input));
    expect(lastValidSecond(cutoff)).toBe(cutoff - 1);
  });
});

describe('lastValidSecond', () => {
  it('returns the input minus one', () => {
    expect(lastValidSecond(1_000)).toBe(999);
  });
});
