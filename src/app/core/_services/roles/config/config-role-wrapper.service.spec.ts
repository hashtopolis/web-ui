import type { MockedObject } from 'vitest';

import { BackgroundJobRoleService } from '@services/roles/config/background-job-role.service';
import { ConfigRoleWrapperService } from '@services/roles/config/config-role-wrapper.service';
import { HashTypesRoleService } from '@services/roles/config/hashtypes-role.service';
import { HealthCheckRoleService } from '@services/roles/config/healthcheck-role.service';
import { LogRoleService } from '@services/roles/config/log-role.service';
import { NotificationsRoleService } from '@services/roles/config/notifications-role.service';
import { SettingsRoleService } from '@services/roles/config/settings-role.service';

describe('ConfigRoleWrapperService', () => {
  it('delegates each role check and returns the corresponding result', () => {
    const settingsRoleService = {
      hasRole: vi.fn().mockName('SettingsRoleService.hasRole').mockReturnValue(true)
    } as MockedObject<SettingsRoleService>;
    const hashTypesRoleService = {
      hasRole: vi.fn().mockName('HashTypesRoleService.hasRole').mockReturnValue(false)
    } as MockedObject<HashTypesRoleService>;
    const healthCheckRoleService = {
      hasRole: vi.fn().mockName('HealthCheckRoleService.hasRole').mockReturnValue(true)
    } as MockedObject<HealthCheckRoleService>;
    const logRoleService = {
      hasRole: vi.fn().mockName('LogRoleService.hasRole').mockReturnValue(false)
    } as MockedObject<LogRoleService>;
    const notificationsRoleService = {
      hasRole: vi.fn().mockName('NotificationsRoleService.hasRole').mockReturnValue(true)
    } as MockedObject<NotificationsRoleService>;
    const backgroundJobRoleService = {
      hasRole: vi.fn().mockName('BackgroundJobRoleService.hasRole').mockReturnValue(false)
    } as MockedObject<BackgroundJobRoleService>;
    const service = new ConfigRoleWrapperService(
      settingsRoleService,
      hashTypesRoleService,
      healthCheckRoleService,
      logRoleService,
      notificationsRoleService,
      backgroundJobRoleService
    );

    const settingsResult = service.hasSettingsRole('read');
    const hashTypesResult = service.hasHashTypesRole('create');
    const healthCheckResult = service.hasHealthCheckRole('read');
    const logResult = service.hasLogRole('read');
    const notificationsResult = service.hasNotificationRole('create');
    const backgroundJobResult = service.hasBackgroundJobRole('delete');

    expect(settingsResult).toBe(true);
    expect(hashTypesResult).toBe(false);
    expect(healthCheckResult).toBe(true);
    expect(logResult).toBe(false);
    expect(notificationsResult).toBe(true);
    expect(backgroundJobResult).toBe(false);
    expect(settingsRoleService.hasRole).toHaveBeenCalledExactlyOnceWith('read');
    expect(hashTypesRoleService.hasRole).toHaveBeenCalledExactlyOnceWith('create');
    expect(healthCheckRoleService.hasRole).toHaveBeenCalledExactlyOnceWith('read');
    expect(logRoleService.hasRole).toHaveBeenCalledExactlyOnceWith('read');
    expect(notificationsRoleService.hasRole).toHaveBeenCalledExactlyOnceWith('create');
    expect(backgroundJobRoleService.hasRole).toHaveBeenCalledExactlyOnceWith('delete');
  });
});
