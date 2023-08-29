import { DEFAULT_CONFIG } from '../config/default/app/main';
import { DEFAULT_CONFIG_TOOLTIP } from '../config/default/app/tooltip';

// This file can be replaced during build by using the `fileReplacements` array.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  config: DEFAULT_CONFIG,
  appName: DEFAULT_CONFIG.appName,
  tooltip: DEFAULT_CONFIG_TOOLTIP
};
