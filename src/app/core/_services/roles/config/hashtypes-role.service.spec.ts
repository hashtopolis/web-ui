import { Perm } from '@constants/userpermissions.config';

import { PermissionService } from '@services/permission/permission.service';
import { HashTypesRoleService } from '@services/roles/config/hashtypes-role.service';

describe('HashTypesRoleService', () => {
  function service(granted: string[]) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    };
    permissionService.hasPermissionSync.mockImplementation((key) => granted.includes(key));
    return new HashTypesRoleService(permissionService);
  }

  it('grants read with permHashTypeRead', () => {
    expect(service([Perm.Hashtype.READ]).hasRole('read')).toBe(true);
    expect(service([]).hasRole('read')).toBe(false);
  });

  it('grants create with permHashTypeCreate', () => {
    expect(service([Perm.Hashtype.CREATE]).hasRole('create')).toBe(true);
    expect(service([Perm.Hashtype.READ]).hasRole('create')).toBe(false);
  });

  it('grants update with permHashTypeUpdate', () => {
    expect(service([Perm.Hashtype.UPDATE]).hasRole('update')).toBe(true);
    expect(service([Perm.Hashtype.READ]).hasRole('update')).toBe(false);
  });
});
