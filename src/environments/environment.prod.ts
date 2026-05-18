/**
 * Production environment, must have a replace entry in angular.json to be used for production build
 */

import { DEFAULT_CONFIG } from '@src/config/default/app/main';
import { DEFAULT_CONFIG_TOOLTIP } from '@src/config/default/app/tooltip';

export const environment = {
  production: true,
  config: DEFAULT_CONFIG,
  appName: DEFAULT_CONFIG.appName,
  tooltip: DEFAULT_CONFIG_TOOLTIP
};
