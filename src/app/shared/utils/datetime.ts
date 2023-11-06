//import moment from 'moment';

/**
 * Calculate a Unix timestamp for a date in the past.
 *
 * @param {number} days - The number of days to go back in the past.
 * @returns {number} The Unix timestamp (in seconds) for the specified date in the past.
 */
export const unixTimestampInPast = (days: number): number => {
  const currentDate = new Date();
  const inPast = new Date(currentDate.getTime() - days * 24 * 60 * 60 * 1000);

  return Math.floor(inPast.getTime() / 1000);
}

/**
 * Formats a Unix timestamp into a date-time string using a custom format.
 *
 * @param unixTimestamp The Unix timestamp to format, in seconds.
 * @param fmt The format string to define the output format. Supported placeholders:
 *   - yy: 2-digit year
 *   - yyyy: 4-digit year
 *   - MM: Zero-padded month (01-12)
 *   - M: Month (1-12)
 *   - dd: Zero-padded day of the month (01-31)
 *   - d: Day of the month (1-31)
 *   - HH: Zero-padded hours in 24-hour format (00-23)
 *   - H: Hours in 24-hour format (0-23)
 *   - mm: Zero-padded minutes (00-59)
 *   - m: Minutes (0-59)
 *   - ss: Zero-padded seconds (00-59)
 *   - s: Seconds (0-59)
 *
 * @returns The formatted date-time string.
 */
export function formatUnixTimestamp(unixTimestamp: number, fmt: string): string {
  //return moment.unix(unixTimestamp).format(fmt)
  const date = new Date(unixTimestamp * 1000);

  return formatDate(date, fmt)
}

/**
 * Formats a Date into a date-time string using a custom format.
 *
 * @param date The date to format.
 * @param fmt The format string to define the output format. Supported placeholders:
 *   - yy: 2-digit year
 *   - yyyy: 4-digit year
 *   - MM: Zero-padded month (01-12)
 *   - M: Month (1-12)
 *   - dd: Zero-padded day of the month (01-31)
 *   - d: Day of the month (1-31)
 *   - HH: Zero-padded hours in 24-hour format (00-23)
 *   - H: Hours in 24-hour format (0-23)
 *   - mm: Zero-padded minutes (00-59)
 *   - m: Minutes (0-59)
 *   - ss: Zero-padded seconds (00-59)
 *   - s: Seconds (0-59)
 *
 * @returns The formatted date-time string.
 */
export function formatDate(date: Date, fmt: string): string {
  //return moment(date).format(fmt)
  const pad = (value: number) => (value < 10 ? `0${value}` : value.toString());

  return fmt.replace(/yyyy/g, date.getFullYear().toString())
    .replace(/yy/g, date.getFullYear().toString().slice(-2))
    .replace(/MM/g, pad(date.getMonth() + 1))
    .replace(/M/g, (date.getMonth() + 1).toString())
    .replace(/dd/g, pad(date.getDate()))
    .replace(/d/g, date.getDate().toString())
    .replace(/hh/g, pad(date.getHours()))
    .replace(/h/g, date.getHours().toString())
    .replace(/mm/g, pad(date.getMinutes()))
    .replace(/m/g, date.getMinutes().toString())
    .replace(/ss/g, pad(date.getSeconds()))
    .replace(/s/g, date.getSeconds().toString());
}