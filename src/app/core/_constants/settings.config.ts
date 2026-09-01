import { BuiltInTheme, Layout } from '@models/config-ui.model';

/**
 * Date formats, used in general settings and when app is initialized
 **/
export interface Setting<T extends string = string> {
  value: T;
  description: string;
}

/**
 * Options for select inputs, used in various settings
 */
export interface Option {
  label: string;
  value: number | string | boolean;
}

export const DateFormat = {
  DAY_MONTH_YEAR_SLASH: 'dd/MM/yyyy',
  DAY_MONTH_YEAR_DOT: 'dd.MM.yyyy',
  DAY_MONTH_YEAR_SHORT: 'd/M/yy',
  MONTH_DAY_YEAR_SLASH: 'MM/dd/yyyy',
  MONTH_DAY_YEAR_SHORT: 'M/d/yy',
  YEAR_MONTH_DAY_DASH: 'yyyy-MM-dd',
  YEAR_MONTH_DAY_SLASH: 'yyyy/MM/dd',
  DAY_MONTH_NAME_YEAR: 'd MMM yyyy',
  MONTH_NAME_DAY_YEAR: 'MMM d, yyyy'
} as const;
export type DateFormat = (typeof DateFormat)[keyof typeof DateFormat];

export const TimeFormat = {
  TWELVE_HOUR: '12h',
  TWENTY_FOUR_HOUR: '24h'
} as const;
export type TimeFormat = (typeof TimeFormat)[keyof typeof TimeFormat];

export const dateFormats: Setting<DateFormat>[] = [
  { value: DateFormat.DAY_MONTH_YEAR_SLASH, description: 'dd/MM/yyyy (ie. 06/07/2023)' },
  { value: DateFormat.DAY_MONTH_YEAR_DOT, description: 'dd.MM.yyyy (ie. 06.07.2023)' },
  { value: DateFormat.DAY_MONTH_YEAR_SHORT, description: 'd/M/yy (ie. 6/7/23)' },
  { value: DateFormat.MONTH_DAY_YEAR_SLASH, description: 'MM/dd/yyyy (ie. 07/06/2023)' },
  { value: DateFormat.MONTH_DAY_YEAR_SHORT, description: 'M/d/yy (ie. 7/6/23)' },
  { value: DateFormat.YEAR_MONTH_DAY_DASH, description: 'yyyy-MM-dd (ie. 2023-07-06)' },
  { value: DateFormat.YEAR_MONTH_DAY_SLASH, description: 'yyyy/MM/dd (ie. 2023/07/06)' },
  { value: DateFormat.DAY_MONTH_NAME_YEAR, description: 'd MMM yyyy (ie. 6 Jul 2023)' },
  { value: DateFormat.MONTH_NAME_DAY_YEAR, description: 'MMM d, yyyy (ie. Jul 6, 2023)' }
];

export const timeFormats: Setting<TimeFormat>[] = [
  { value: TimeFormat.TWENTY_FOUR_HOUR, description: '24-hour (ie. 14:03)' },
  { value: TimeFormat.TWELVE_HOUR, description: '12-hour (ie. 2:03 PM)' }
];

/** Used whenever the browser locale maps to no {@link DateFormat}. */
const FALLBACK_DATE_FORMAT = DateFormat.DAY_MONTH_YEAR_DOT;

const isDateFormat = (fmt: string): fmt is DateFormat => Object.values(DateFormat).some((format) => format === fmt);

/**
 * Date format matching the browser locale, used until the user picks one explicitly.
 * Locales whose field order or separator has no matching {@link DateFormat} (Chinese
 * year/month/day markers, for instance) fall back rather than yielding an unselectable format.
 */
export const browserDateFormat = (): DateFormat => {
  const tokens: Record<string, string> = { year: 'yyyy', month: 'MM', day: 'dd' };
  const parts = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());

  const fmt = parts.map((part) => tokens[part.type] ?? part.value).join('');

  return isDateFormat(fmt) ? fmt : FALLBACK_DATE_FORMAT;
};

export const browserTimeFormat = (): TimeFormat =>
  new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hour12
    ? TimeFormat.TWELVE_HOUR
    : TimeFormat.TWENTY_FOUR_HOUR;

export const layouts: Setting[] = [
  { value: Layout.FIXED, description: 'Fixed width layout' },
  { value: Layout.FULL, description: 'Full screen layout' }
];

export const themes: Setting[] = [
  { value: BuiltInTheme.LIGHT, description: 'Light Mode' },
  { value: BuiltInTheme.DARK, description: 'Dark Mode' }
];

/**
 * Server log verbosity, matching the server's `logLevel` config value.
 */
export const ServerLogLevel = {
  TRACE: 0,
  DEBUG: 10,
  INFO: 20,
  WARNING: 30,
  ERROR: 40,
  FATAL: 50
} as const;
export type ServerLogLevel = (typeof ServerLogLevel)[keyof typeof ServerLogLevel];

/**
 * Logs, used in general settings
 **/
export const serverlog = [
  { value: ServerLogLevel.TRACE, label: 'TRACE' },
  { value: ServerLogLevel.DEBUG, label: 'DEBUG' },
  { value: ServerLogLevel.INFO, label: 'INFO' },
  { value: ServerLogLevel.WARNING, label: 'WARNING' },
  { value: ServerLogLevel.ERROR, label: 'ERROR' },
  { value: ServerLogLevel.FATAL, label: 'FATAL' }
];

/**
 * Proxy protocol the server uses for outgoing requests.
 */
export const ProxyType = {
  HTTP: 'HTTP',
  HTTPS: 'HTTPS',
  SOCKS4: 'SOCKS4',
  SOCKS5: 'SOCKS5'
} as const;
export type ProxyType = (typeof ProxyType)[keyof typeof ProxyType];

/**
 * Proxy type, used in general settings
 **/
export const proxytype = [
  { value: ProxyType.HTTP, label: ProxyType.HTTP },
  { value: ProxyType.HTTPS, label: ProxyType.HTTPS },
  { value: ProxyType.SOCKS4, label: ProxyType.SOCKS4 },
  { value: ProxyType.SOCKS5, label: ProxyType.SOCKS5 }
];
