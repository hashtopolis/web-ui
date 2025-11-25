import { Type } from '@angular/core';

import { ServiceConfig } from '@services/main.config';
import { RoleService } from '@services/roles/base/role.service';

/**
 * Interface definition for route data
 */
export interface RouteData {
  kind?: string;
  type?: string;
  serviceConfig?: ServiceConfig;
  breadcrumb?: string;
  roleName?: string;
  roleServiceClass?: Type<RoleService>;
}

export interface MyRoute {
  path: string;
  component?: any; // Option as first path is empty
  data?: RouteData;
  canActivate?: any[]; // Replace 'any[]' with the actual canActivate guards
  canDeactivate?: any[]; // Replace 'any[]' with the actual canDeactivate guards
  children?: MyRoute[];
}
