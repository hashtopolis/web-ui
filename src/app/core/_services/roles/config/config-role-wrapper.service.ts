/**
 * Role wrapper for server config roles
 */
import { Injectable } from '@angular/core';

import { HashTypesRoleService } from '@services/roles/config/hashtypes-role.service';
import { HealthCheckRoleService } from '@services/roles/config/healthcheck-role.service';
import { LogRoleService } from '@services/roles/config/log-role.service';
import { SettingsRoleService } from '@services/roles/config/settings-role.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigRoleWrapperService {
  constructor(
    private settingsRoleService: SettingsRoleService,
    private hashTypesRoleService: HashTypesRoleService,
    private healthCheckRoleService: HealthCheckRoleService,
    private logRoleService: LogRoleService
  ) {}

  hasSettingsRole(roleName: string): boolean {
    return this.settingsRoleService.hasRole(roleName);
  }

  hasHashTypesRole(roleName: string): boolean {
    return this.hashTypesRoleService.hasRole(roleName);
  }

  hasHealthCheckRole(roleName: string): boolean {
    return this.healthCheckRoleService.hasRole(roleName);
  }
  hasLogRole(roleName: string): boolean {
    return this.logRoleService.hasRole(roleName);
  }
}
