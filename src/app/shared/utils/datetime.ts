//import moment from 'moment';

import { DateFormat, TimeFormat } from '@constants/settings.config';

type Seconds = number;
type Days = number;
type UnixTimestampSeconds = number;

/**
 * Returns a copy of the given date set to the start of its local-time calendar day (00:00:00.000).
 * Non-mutating: the input is not modified.
 */
export const startOfDay = (date: Date): Date => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

/**
 * Returns a copy of the given date set to the end of its local-time calendar day (23:59:59.999).
 * Non-mutating: the input is not modified.
 */
export const endOfDay = (date: Date): Date => {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
};

/**
 * Returns 00:00:00.000 of the day after the given date in local time.
 */
export const startOfNextDay = (date: Date): Date => {
  const copy = startOfDay(date);
  copy.setDate(copy.getDate() + 1);
  return copy;
};

/**
 * Given an exclusive end-of-validity cutoff in unix seconds (i.e. the first
 * instant at which a token is considered expired), returns the unix second
 * at which it is still valid for the last time.
 */
export const lastValidSecond = (endValidSec: Seconds): number => endValidSec - 1;

/**
 * Calculate a Unix timestamp for a date in the past.
 *
 * @param {number} days - The number of days to go back in the past.
 * @returns {number} The Unix timestamp (in seconds) for the specified date in the past.
 */
export const unixTimestampInPast = (days: Days): UnixTimestampSeconds => {
  const currentDate = new Date();
  const inPast = new Date(currentDate.getTime() - days * 24 * 60 * 60 * 1000);

  return unixTimestampFromDate(inPast);
};

/**
 * Returns the number of whole days between two dates, rounded to the nearest day.
 * The result is signed: positive when `until` is after `from`, negative when before.
 * Caller is responsible for clamping if non-positive ranges should be excluded.
 */
export const daysBetween = (from: Date, until: Date): Days => {
  return Math.round((until.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
};

/**
 * Converts a Date to a Unix timestamp in seconds, flooring sub-second precision
 * to match Unix epoch convention.
 */
export const unixTimestampFromDate = (date: Date): UnixTimestampSeconds => {
  return Math.floor(date.getTime() / 1000);
};

export const TimePrecision = {
  MINUTES: 'minutes',
  SECONDS: 'seconds'
} as const;
export type TimePrecision = (typeof TimePrecision)[keyof typeof TimePrecision];

/**
 * Builds a time format from the user's clock convention and the precision the usage site needs.
 */
export const timeFormat = (clock: TimeFormat, precision: TimePrecision): string => {
  const seconds = precision === TimePrecision.SECONDS ? ':ss' : '';

  return clock === TimeFormat.TWELVE_HOUR ? `h:mm${seconds} a` : `HH:mm${seconds}`;
};

/**
 * Builds a combined date-time format. Date and clock are configured separately so a usage site
 * can render just the date where the time carries no information.
 */
export const dateTimeFormat = (dateFmt: DateFormat, clock: TimeFormat, precision: TimePrecision): string =>
  `${dateFmt} ${timeFormat(clock, precision)}`;

/**
 * Formats a Unix timestamp into a date-time string using a custom format.
 *
 * @param unixTimestamp The Unix timestamp to format, in seconds.
 * @param fmt The format string to define the output format, see {@link formatDate}.
 *
 * @returns The formatted date-time string.
 */
export function formatUnixTimestamp(unixTimestamp: number, fmt: string): string {
  if (unixTimestamp === 0) {
    return 'N/A';
  }
  //return moment.unix(unixTimestamp).format(fmt)
  const date = new Date(unixTimestamp * 1000);

  return formatDate(date, fmt);
}

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const FORMAT_TOKENS = /yyyy|yy|MMM|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|a/g;

/**
 * Formats a Date into a date-time string using a custom format.
 *
 * @param date The date to format.
 * @param fmt The format string to define the output format. Supported placeholders:
 *   - yy: 2-digit year
 *   - yyyy: 4-digit year
 *   - MMM: Abbreviated month name (Jan-Dec)
 *   - MM: Zero-padded month (01-12)
 *   - M: Month (1-12)
 *   - dd: Zero-padded day of the month (01-31)
 *   - d: Day of the month (1-31)
 *   - HH: Zero-padded hours in 24-hour format (00-23)
 *   - H: Hours in 24-hour format (0-23)
 *   - hh: Zero-padded hours in 12-hour format (01-12)
 *   - h: Hours in 12-hour format (1-12)
 *   - mm: Zero-padded minutes (00-59)
 *   - m: Minutes (0-59)
 *   - ss: Zero-padded seconds (00-59)
 *   - s: Seconds (0-59)
 *   - a: AM/PM marker
 *
 * @returns The formatted date-time string.
 */
export function formatDate(date: Date, fmt: string): string {
  //return moment(date).format(fmt)
  const pad = (value: number) => (value < 10 ? `0${value}` : value.toString());
  const hours12 = date.getHours() % 12 || 12;

  const values: Record<string, string> = {
    yyyy: date.getFullYear().toString(),
    yy: date.getFullYear().toString().slice(-2),
    MMM: SHORT_MONTHS[date.getMonth()],
    MM: pad(date.getMonth() + 1),
    M: (date.getMonth() + 1).toString(),
    dd: pad(date.getDate()),
    d: date.getDate().toString(),
    HH: pad(date.getHours()),
    H: date.getHours().toString(),
    hh: pad(hours12),
    h: hours12.toString(),
    mm: pad(date.getMinutes()),
    m: date.getMinutes().toString(),
    ss: pad(date.getSeconds()),
    s: date.getSeconds().toString(),
    a: date.getHours() < 12 ? 'AM' : 'PM'
  };

  return fmt.replace(FORMAT_TOKENS, (token) => values[token]);
}

/**
 * Formats a duration in seconds into a string representing days, hours, minutes, and seconds.
 * Example output: "3 Days 04:15:30"
 *
 * @param seconds - The duration in seconds to format.
 * @returns A formatted string representing the duration.
 */
export const formatSeconds = (seconds: number) => {
  if (seconds < 1) {
    return '-';
  }

  const secondsInDay = 60 * 60 * 24;
  let formatted = '';

  if (seconds >= secondsInDay) {
    const days = Math.floor(seconds / secondsInDay);
    const dayLabel = days === 1 ? ' Day ' : ' Days ';
    const daysFormatted = `${days}${dayLabel}`;

    seconds = seconds - days * secondsInDay; // Remaining Time
    formatted += daysFormatted;
  }

  const date = new Date(seconds * 1000);
  const timeString = date.toISOString().slice(11, 19);

  formatted += timeString;
  return formatted;
};
