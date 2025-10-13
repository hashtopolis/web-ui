import { ServiceConfig } from '@services/main.config';

/**
 * Interface definition for route data
 */
export interface RouteData {
  kind?: string;
  type?: string;
  serviceConfig?: ServiceConfig;
  permission?: string;
  breadcrumb?: string;
}

export interface MyRoute {
  path: string;
  component?: any; // Option as first path is empty
  data?: RouteData;
  canActivate?: any[]; // Replace 'any[]' with the actual canActivate guards
  canDeactivate?: any[]; // Replace 'any[]' with the actual canDeactivate guards
  children?: MyRoute[];
}
