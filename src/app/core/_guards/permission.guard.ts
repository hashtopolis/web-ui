import { Observable, catchError, map, of } from 'rxjs';

import { Injectable, Type, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';

import { RoleService } from '@services/roles/base/role.service';
import { AlertService } from '@services/shared/alert.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard {
  constructor(private alert: AlertService) {}

  /**
   * Convert role and domain names into a human-readable format
   * @param domain The domain name (e.g., "Agents", "Tasks")
   * @param role The role name in camel case (e.g., "create")
   * @return A human-readable string (e.g., "create Agents")
   */
  private humanizeRoleName(domain: string, role: string): string {
    const action = role
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase();

    return `${action} ${domain}s`;
  }

  /**
   * Check if the user has the required role to activate the route
   * @param route The activated route snapshot
   * @return An observable that emits true if access is granted, false otherwise
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const roleName = route.data['roleName'] as string;
    const roleServiceClass = route.data['roleServiceClass'] as Type<RoleService>;

    if (!roleName || !roleServiceClass) {
      console.error('PermissionGuard: Missing roleName or roleServiceClass in route data');
      return of(false);
    }

    // Instantiate the correct subclass of RoleService
    const service = inject(roleServiceClass);

    return of(service.hasRole(roleName)).pipe(
      map((ok) => {
        if (ok) {
          return true;
        }

        const readable = this.humanizeRoleName(service.scopeName, roleName);

        this.alert.showErrorMessage(`Access denied: You do not have the required role "${readable}".`);

        return false;
      }),
      catchError(() => {
        this.alert.showErrorMessage(`Access denied: Unexpected error while checking roles.`);
        return of(false);
      })
    );
  }
}

export const CheckRole: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> =>
  inject(PermissionGuard).canActivate(route);
