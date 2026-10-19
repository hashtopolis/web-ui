import { Perm } from '@constants/userpermissions.config';

import { PermissionService } from '@services/permission/permission.service';
import { BackgroundJobRoleService } from '@services/roles/config/background-job-role.service';

describe('BackgroundJobRoleService', () => {
  function service(granted: string[]) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    };
    permissionService.hasPermissionSync.mockImplementation((key) => granted.includes(key));
    return new BackgroundJobRoleService(permissionService);
  }

  it('grants read with permBackgroundJobRead', () => {
    expect(service([Perm.BackgroundJob.READ]).hasRole('read')).toBe(true);
    expect(service([]).hasRole('read')).toBe(false);
  });

  it('grants delete with permBackgroundJobDelete', () => {
    expect(service([Perm.BackgroundJob.DELETE]).hasRole('delete')).toBe(true);
    expect(service([Perm.BackgroundJob.READ]).hasRole('delete')).toBe(false);
  });
});
