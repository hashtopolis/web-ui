import { z } from 'zod';

import { Type } from '@angular/core';
import { CanActivate, CanActivateFn, CanDeactivate, CanDeactivateFn, LoadChildren } from '@angular/router';

import { formRouteType } from '@models/routes.schema';

import { ServiceConfig } from '@services/main.config';
import { RoleService } from '@services/roles/base/role.service';

/**
 * Interface definition for route data
 */
export interface RouteData {
  kind?: string;
  type?: z.infer<typeof formRouteType>;
  serviceConfig?: ServiceConfig;
  responseSchema?: z.ZodTypeAny;
  breadcrumb?: string;
  roleName?: string;
  roleServiceClass?: Type<RoleService>;
  preload?: boolean;
  delay?: boolean;
  message?: string;
}

export interface MyRoute {
  path: string;
  component?: Type<unknown>; // Option as first path is empty
  data?: RouteData;
  loadChildren?: LoadChildren;
  redirectTo?: string;
  // Allow either functional guards or class guards
  canActivate?: Array<CanActivateFn | Type<CanActivate>>;
  canDeactivate?: Array<CanDeactivateFn<unknown> | Type<CanDeactivate<unknown>>>;
  children?: MyRoute[];
}
