import { Perm } from '@constants/userpermissions.config';

import { PermissionService } from '@services/permission/permission.service';
import { HashTypesRoleService } from '@services/roles/config/hashtypes-role.service';

describe('HashTypesRoleService', () => {
  function service(granted: string[]) {
    const permissionService = jasmine.createSpyObj<PermissionService>('PermissionService', ['hasPermissionSync']);
    permissionService.hasPermissionSync.and.callFake((key) => granted.includes(key));
    return new HashTypesRoleService(permissionService);
  }

  it('grants read with permHashTypeRead', () => {
    expect(service([Perm.Hashtype.READ]).hasRole('read')).toBeTrue();
    expect(service([]).hasRole('read')).toBeFalse();
  });

  it('grants create with permHashTypeCreate', () => {
    expect(service([Perm.Hashtype.CREATE]).hasRole('create')).toBeTrue();
    expect(service([Perm.Hashtype.READ]).hasRole('create')).toBeFalse();
  });

  it('grants update with permHashTypeUpdate', () => {
    expect(service([Perm.Hashtype.UPDATE]).hasRole('update')).toBeTrue();
    expect(service([Perm.Hashtype.READ]).hasRole('update')).toBeFalse();
  });
});
