import { DEFAULT_CONFIG } from '../config/default/app/main';
import { DEFAULT_CONFIG_TOOLTIP } from '../config/default/app/tooltip';

export const environment = {
  production: false,
  apiEndpoint: DEFAULT_CONFIG.prodApiEndpoint,
  appName: DEFAULT_CONFIG.appName,
  config: DEFAULT_CONFIG,
  tooltip: DEFAULT_CONFIG_TOOLTIP
};
