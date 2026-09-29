import { Perm } from '@constants/userpermissions.config';

import { PermissionService } from '@services/permission/permission.service';
import { BackgroundJobRoleService } from '@services/roles/config/background-job-role.service';

describe('BackgroundJobRoleService', () => {
  function service(granted: string[]) {
    const permissionService = jasmine.createSpyObj<PermissionService>('PermissionService', ['hasPermissionSync']);
    permissionService.hasPermissionSync.and.callFake((key) => granted.includes(key));
    return new BackgroundJobRoleService(permissionService);
  }

  it('grants read with permBackgroundJobRead', () => {
    expect(service([Perm.BackgroundJob.READ]).hasRole('read')).toBeTrue();
    expect(service([]).hasRole('read')).toBeFalse();
  });

  it('grants delete with permBackgroundJobDelete', () => {
    expect(service([Perm.BackgroundJob.DELETE]).hasRole('delete')).toBeTrue();
    expect(service([Perm.BackgroundJob.READ]).hasRole('delete')).toBeFalse();
  });
});
