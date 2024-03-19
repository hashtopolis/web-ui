/**
 * Date formats, used in general settings and when app is initialized
 **/
export interface Setting {
  value: string;
  description: string;
}

export const dateFormats: Setting[] = [
  { value: 'd/M/yy', description: 'd/M/yy (ie. 6/7/23 )' },
  {
    value: 'dd/MM/yyyy h:mm:ss',
    description: 'dd/MM/yyyy h:mm:ss (ie. 06/07/2023, 9:03 AM)'
  },
  {
    value: 'd MMM, y h:mm:ss a',
    description: 'dd/MM/yyyy h:mm:ss (ie. 06 Jul, 2023 9:03:01 AM)'
  },
  { value: 'M/d/yy', description: 'M/d/yy (ie. 7/6/23)' },
  {
    value: 'M/d/yy, h:mm a',
    description: 'M/d/yy, h:mm a (ie. 7/6/23, 9:03 AM)'
  },
  {
    value: 'MMM d, y, h:mm:ss a',
    description: 'MMM d, y, h:mm:ss a (ie. Jul 06, 2023, 9:03:01 AM)'
  },
  { value: 'yy/M/d', description: 'yy/M/d (ie. 23/7/6 )' },
  {
    value: 'yyyy/M/d, h:mm:ss a',
    description: 'yyyy/M/d (ie. 2023/7/6, 9:03:01 AM )'
  },
  {
    value: 'yyyy/MM/dd h:mm:ss',
    description: 'yyyy/MM/dd h:mm:ss (ie. 2023/07/06, 9:03 AM)'
  },
  {
    value: 'yyyy-MM-dd h:mm:ss',
    description: 'yyyy-MM-dd h:mm:ss (ie. 2023-07-06, 09:03)'
  }
];

export const layouts: Setting[] = [
  { value: 'fixed', description: 'Fixed width layout' },
  { value: 'full', description: 'Full screen layout' }
];

export const themes: Setting[] = [
  { value: 'light', description: 'Light Mode' },
  { value: 'dark', description: 'Dark Mode' }
];

/**
 * Logs, used in general settings
 **/
export const serverlog = [
  { value: 0, label: 'TRACE' },
  { value: 10, label: 'DEBUG' },
  { value: 20, label: 'INFO' },
  { value: 30, label: 'WARNING' },
  { value: 40, label: 'ERROR' },
  { value: 50, label: 'FATAL' }
];

/**
 * Proxy type, used in general settings
 **/
export const proxytype = [
  { value: 'HTTP', label: 'HTTP' },
  { value: 'HTTP', label: 'HTTPS' },
  { value: 'HTTP', label: 'SOCKS4' },
  { value: 'HTTP', label: 'SOCKS5' }
];
