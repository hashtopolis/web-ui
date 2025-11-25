import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';

import { SERV } from '@services/main.config';
import { AccessGroupRoleService } from '@services/roles/user/accessgroup-role.service';
import { PermissionRoleService } from '@services/roles/user/permission-role.service';
import { UserRoleWrapperService } from '@services/roles/user/user-role-wrapper.service';
import { UserRoleService } from '@services/roles/user/user-role.service';

import { FormComponent } from '@components/forms/simple-forms/form.component';

import { Perm } from '@src/app/core/_constants/userpermissions.config';
import { IsAuth } from '@src/app/core/_guards/auth.guard';
import { CheckRole } from '@src/app/core/_guards/permission.guard';
import { AllUsersComponent } from '@src/app/users/all-users/all-users.component';
import { EditGroupsComponent } from '@src/app/users/edit-groups/edit-groups.component';
import { EditUsersComponent } from '@src/app/users/edit-users/edit-users.component';
import { EditGlobalpermissionsgroupsComponent } from '@src/app/users/globalpermissionsgroups/edit-globalpermissionsgroups/edit-globalpermissionsgroups.component';
import { GlobalpermissionsgroupsComponent } from '@src/app/users/globalpermissionsgroups/globalpermissionsgroups.component';
import { GroupsComponent } from '@src/app/users/groups/groups.component';
import { NewUserComponent } from '@src/app/users/new-user/new-user.component';

const userRoleServiceClass = UserRoleService;
const accessGroupRoleServiceClass = AccessGroupRoleService;
const permissionRoleServiceClass = PermissionRoleService;

const routes: MyRoute[] = [
  {
    path: '',
    canActivate: [IsAuth],
    children: [
      {
        path: '',
        component: NewUserComponent,
        data: {
          kind: 'newuser',
          type: 'create',
          serviceConfig: SERV.USERS,
          breadcrumb: 'New User',
          roleServiceClass: UserRoleService,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: ':id/edit',
        component: EditUsersComponent,
        data: {
          kind: 'edit',
          breadcrumb: 'Edit User',
          roleServiceClass: UserRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'all-users',
        component: AllUsersComponent,
        data: {
          kind: 'all-users',
          breadcrumb: 'All Users',
          roleServiceClass: UserRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'global-permissions-groups',
        component: GlobalpermissionsgroupsComponent,
        data: {
          kind: 'globalpermissionsgp',
          breadcrumb: 'Global Permissions Groups',
          roleServiceClass: permissionRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'global-permissions-groups/new',
        component: FormComponent,
        data: {
          kind: 'newglobalpermissionsgp',
          type: 'create',
          serviceConfig: SERV.ACCESS_PERMISSIONS_GROUPS,
          breadcrumb: 'New Global Permissions Groups',
          roleServiceClass: permissionRoleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'global-permissions-groups/:id/edit',
        component: EditGlobalpermissionsgroupsComponent,
        data: {
          kind: 'edit-gpg',
          breadcrumb: 'Edit Global Permissions Group',
          roleServiceClass: permissionRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'access-groups',
        component: GroupsComponent,
        data: {
          kind: 'access-groups',
          breadcrumb: 'Access Groups',
          roleServiceClass: accessGroupRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'access-groups/new',
        component: FormComponent,
        data: {
          kind: 'newaccessgroups',
          type: 'create',
          serviceConfig: SERV.ACCESS_GROUPS,
          breadcrumb: 'New Access Group',
          roleServiceClass: accessGroupRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'access-groups/:id/edit',
        component: EditGroupsComponent,
        data: {
          kind: 'editaccessgroups',
          type: 'edit',
          breadcrumb: 'Edit Access Group',
          roleServiceClass: accessGroupRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
