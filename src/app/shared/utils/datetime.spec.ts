import { DateFormat, TimeFormat } from '@constants/settings.config';

import {
  TimePrecision,
  dateTimeFormat,
  formatDate,
  formatUnixTimestamp,
  lastValidSecond,
  startOfNextDay,
  timeFormat,
  unixTimestampFromDate
} from '@src/app/shared/utils/datetime';

describe('formatDate', () => {
  const afternoon = new Date(2023, 6, 6, 14, 3, 1);

  it('renders every offered date format', () => {
    expect(formatDate(afternoon, DateFormat.DAY_MONTH_YEAR_SLASH)).toBe('06/07/2023');
    expect(formatDate(afternoon, DateFormat.DAY_MONTH_YEAR_DOT)).toBe('06.07.2023');
    expect(formatDate(afternoon, DateFormat.DAY_MONTH_YEAR_SHORT)).toBe('6/7/23');
    expect(formatDate(afternoon, DateFormat.MONTH_DAY_YEAR_SLASH)).toBe('07/06/2023');
    expect(formatDate(afternoon, DateFormat.MONTH_DAY_YEAR_SHORT)).toBe('7/6/23');
    expect(formatDate(afternoon, DateFormat.YEAR_MONTH_DAY_DASH)).toBe('2023-07-06');
    expect(formatDate(afternoon, DateFormat.YEAR_MONTH_DAY_SLASH)).toBe('2023/07/06');
    expect(formatDate(afternoon, DateFormat.DAY_MONTH_NAME_YEAR)).toBe('6 Jul 2023');
    expect(formatDate(afternoon, DateFormat.MONTH_NAME_DAY_YEAR)).toBe('Jul 6, 2023');
  });

  it('renders HH as 24-hour and h as 12-hour', () => {
    expect(formatDate(afternoon, 'HH:mm:ss')).toBe('14:03:01');
    expect(formatDate(afternoon, 'h:mm:ss a')).toBe('2:03:01 PM');
  });

  it('marks morning times as AM and midnight as 12 on a 12-hour clock', () => {
    const midnight = new Date(2023, 6, 6, 0, 5);

    expect(formatDate(midnight, 'h:mm a')).toBe('12:05 AM');
    expect(formatDate(new Date(2023, 6, 6, 9, 3), 'h:mm a')).toBe('9:03 AM');
    expect(formatDate(new Date(2023, 6, 6, 12, 0), 'h:mm a')).toBe('12:00 PM');
  });

  it('renders a month name and an AM/PM marker in the same format', () => {
    expect(formatDate(new Date(2023, 2, 4, 9, 0), 'MMM d, yyyy h:mm a')).toBe('Mar 4, 2023 9:00 AM');
  });
});

describe('formatUnixTimestamp', () => {
  it('returns N/A for a missing or unusable timestamp', () => {
    expect(formatUnixTimestamp(0, DateFormat.DAY_MONTH_YEAR_DOT)).toBe('N/A');
    expect(formatUnixTimestamp(NaN, DateFormat.DAY_MONTH_YEAR_DOT)).toBe('N/A');
    expect(formatUnixTimestamp(undefined as unknown as number, DateFormat.DAY_MONTH_YEAR_DOT)).toBe('N/A');
  });
});

describe('timeFormat', () => {
  it('appends seconds only when the usage site asks for them', () => {
    expect(timeFormat(TimeFormat.TWENTY_FOUR_HOUR, TimePrecision.MINUTES)).toBe('HH:mm');
    expect(timeFormat(TimeFormat.TWENTY_FOUR_HOUR, TimePrecision.SECONDS)).toBe('HH:mm:ss');
    expect(timeFormat(TimeFormat.TWELVE_HOUR, TimePrecision.MINUTES)).toBe('h:mm a');
    expect(timeFormat(TimeFormat.TWELVE_HOUR, TimePrecision.SECONDS)).toBe('h:mm:ss a');
  });
});

describe('dateTimeFormat', () => {
  it('joins the configured date format with the time format', () => {
    expect(dateTimeFormat(DateFormat.DAY_MONTH_YEAR_DOT, TimeFormat.TWENTY_FOUR_HOUR, TimePrecision.SECONDS)).toBe(
      'dd.MM.yyyy HH:mm:ss'
    );
    expect(dateTimeFormat(DateFormat.MONTH_DAY_YEAR_SHORT, TimeFormat.TWELVE_HOUR, TimePrecision.MINUTES)).toBe(
      'M/d/yy h:mm a'
    );
  });
});

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
