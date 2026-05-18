/**
 * environment definition for development environment.
 * Add a replace section angular.jsom for staging or production environment
 */

import { DEFAULT_CONFIG } from '@src/config/default/app/main';
import { DEFAULT_CONFIG_TOOLTIP } from '@src/config/default/app/tooltip';

export const environment = {
  production: false,
  config: DEFAULT_CONFIG,
  appName: DEFAULT_CONFIG.appName,
  tooltip: DEFAULT_CONFIG_TOOLTIP
};
