import { Type } from '@angular/core';
import { CanActivate, CanActivateFn, CanDeactivate, CanDeactivateFn } from '@angular/router';

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
  component?: Type<unknown>; // Option as first path is empty
  data?: RouteData;
  // Allow either functional guards or class guards
  canActivate?: Array<CanActivateFn | Type<CanActivate>>;
  canDeactivate?: Array<CanDeactivateFn<unknown> | Type<CanDeactivate<unknown>>>;
  children?: MyRoute[];
}
