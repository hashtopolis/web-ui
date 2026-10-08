import { HashTypesRoleService } from '@services/roles/config/hashtypes-role.service';

import { routes } from '@src/app/config/config-routing.module';

describe('config routes', () => {
  function roleOf(path: string) {
    const route = routes[0].children?.find((child) => child.path === path);
    expect(route).withContext(path).toBeDefined();
    return { roleName: route?.data?.['roleName'], roleServiceClass: route?.data?.['roleServiceClass'] };
  }

  it('gates the hashtypes page by the hashtype update role', () => {
    expect(roleOf('hashtypes')).toEqual({ roleName: 'update', roleServiceClass: HashTypesRoleService });
  });

  it('gates the hashtype edit page by the hashtype update role', () => {
    expect(roleOf('hashtypes/:id/edit')).toEqual({ roleName: 'update', roleServiceClass: HashTypesRoleService });
  });

  it('has no route to create hashtypes', () => {
    expect(routes[0].children?.find((child) => child.path === 'hashtypes/new')).toBeUndefined();
  });
});
