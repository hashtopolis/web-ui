/**
 * Date formats, used in general settings and when app is initialized
**/

export const dateFormat = [
  {format:'d/M/yy', description:'d/M/yy (ie. 6/7/23 )'},
  {format:'dd/MM/yyyy h:mm:ss', description:'dd/MM/yyyy h:mm:ss (ie. 06/07/2023, 9:03 AM)'},
  {format:'d MMM, y h:mm:ss a', description:'dd/MM/yyyy h:mm:ss (ie. 06 Jul, 2023 9:03:01 AM)'},
  {format:'M/d/yy', description:'M/d/yy (ie. 7/6/23)'},
  {format:'M/d/yy, h:mm a', description:'M/d/yy, h:mm a (ie. 7/6/23, 9:03 AM)'},
  {format:'MMM d, y, h:mm:ss a', description:'MMM d, y, h:mm:ss a (ie. Jul 06, 2023, 9:03:01 AM)'},
  {format:'yy/M/d', description:'yy/M/d (ie. 23/7/6 )'},
  {format:'yyyy/M/d, h:mm:ss a', description:'yyyy/M/d (ie. 2023/7/6, 9:03:01 AM )'},
  {format:'yyyy/MM/dd h:mm:ss', description:'yyyy/MM/dd h:mm:ss (ie. 2023/07/06, 9:03 AM)'},
];


/**
 * Logs, used in general settings
**/

export const serverlog = [
  {id:0, value: 'TRACE'},
  {id:10, value: 'DEBUG'},
  {id:20, value: 'INFO'},
  {id:30, value: 'WARNING'},
  {id:40, value: 'ERROR'},
  {id:50, value: 'FATAL'}
];

/**
 * Proxy type, used in general settings
**/

export const proxytype = [
  {value:'HTTP'},
  {value:'HTTPS'},
  {value:'SOCKS4'},
  {value:'SOCKS5'}
];
