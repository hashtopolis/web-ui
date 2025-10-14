import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';

import { SERV } from '@services/main.config';

import { FormComponent } from '@components/forms/simple-forms/form.component';

import { Perm } from '@src/app/core/_constants/userpermissions.config';
import { IsAuth } from '@src/app/core/_guards/auth.guard';
import { CheckPerm } from '@src/app/core/_guards/permission.guard';
import { AllUsersComponent } from '@src/app/users/all-users/all-users.component';
import { EditGroupsComponent } from '@src/app/users/edit-groups/edit-groups.component';
import { EditUsersComponent } from '@src/app/users/edit-users/edit-users.component';
import { EditGlobalpermissionsgroupsComponent } from '@src/app/users/globalpermissionsgroups/edit-globalpermissionsgroups/edit-globalpermissionsgroups.component';
import { GlobalpermissionsgroupsComponent } from '@src/app/users/globalpermissionsgroups/globalpermissionsgroups.component';
import { GroupsComponent } from '@src/app/users/groups/groups.component';
import { NewUserComponent } from '@src/app/users/new-user/new-user.component';

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
          permission: Perm.User.CREATE
        },
        canActivate: [CheckPerm]
      },
      {
        path: ':id/edit',
        component: EditUsersComponent,
        data: {
          kind: 'edit',
          breadcrumb: 'Edit User',
          permission: Perm.User.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'all-users',
        component: AllUsersComponent,
        data: {
          kind: 'all-users',
          breadcrumb: 'All Users',
          permission: Perm.User.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'global-permissions-groups',
        component: GlobalpermissionsgroupsComponent,
        data: {
          kind: 'globalpermissionsgp',
          breadcrumb: 'Global Permissions Groups',
          permission: Perm.RightGroup.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'global-permissions-groups/new',
        component: FormComponent,
        data: {
          kind: 'newglobalpermissionsgp',
          type: 'create',
          serviceConfig: SERV.ACCESS_PERMISSIONS_GROUPS,
          breadcrumb: 'New Global Permissions Groups',
          permission: Perm.RightGroup.CREATE
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'global-permissions-groups/:id/edit',
        component: EditGlobalpermissionsgroupsComponent,
        data: {
          kind: 'edit-gpg',
          breadcrumb: 'Edit Global Permissions Group',
          permission: Perm.RightGroup.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'access-groups',
        component: GroupsComponent,
        data: {
          kind: 'access-groups',
          breadcrumb: 'Access Groups',
          permission: Perm.GroupAccess.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'access-groups/new',
        component: FormComponent,
        data: {
          kind: 'newaccessgroups',
          type: 'create',
          serviceConfig: SERV.ACCESS_GROUPS,
          breadcrumb: 'New Access Group',
          permission: Perm.GroupAccess.CREATE
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'access-groups/:id/edit',
        component: EditGroupsComponent,
        data: {
          kind: 'editaccessgroups',
          type: 'edit',
          breadcrumb: 'Edit Access Group',
          permission: Perm.GroupAccess.READ
        },
        canActivate: [CheckPerm]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
