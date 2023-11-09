import { CheckPerm } from "../core/_guards/permission.guard";
import { Routes, RouterModule } from '@angular/router';
import { IsAuth } from "../core/_guards/auth.guard";
import { NgModule } from "@angular/core";

import { EditGlobalpermissionsgroupsComponent } from "./globalpermissionsgroups/edit-globalpermissionsgroups/edit-globalpermissionsgroups.component";
import { GlobalpermissionsgroupsComponent } from "./globalpermissionsgroups/globalpermissionsgroups.component";
import { EditUsersComponent } from "./edit-users/edit-users.component";
import { AllUsersComponent } from "./all-users/all-users.component";
import { FormComponent } from "../shared/form/form.component";
import { GroupsComponent } from "./groups/groups.component";
import { SERV } from '../core/_services/main.config';

const routes: Routes = [
  {
    path: '',
    canActivate: [IsAuth],
    children: [
        {
          path: '', component: FormComponent,
          data: {
              kind: 'newuser',
              type: 'create',
              path: SERV.USERS,
              breadcrumb: 'New User',
              permission: 'User'
          },
          canActivate: [CheckPerm]},
        {
          path: ':id/edit', component: EditUsersComponent,
          data: {
              kind: 'edit',
              breadcrumb: 'Edit User',
              permission: 'User'
          },
          canActivate: [CheckPerm]},
        {
          path: 'all-users', component: AllUsersComponent,
          data: {
              kind: 'all-users',
              breadcrumb: 'All Users',
              permission: 'User'
          },
          canActivate: [CheckPerm]},
        {
          path: 'global-permissions-groups', component: GlobalpermissionsgroupsComponent,
          data: {
              kind: 'globalpermissionsgp',
              breadcrumb: 'Global Permissions Groups',
              permission: 'RightGroup'
          },
          canActivate: [CheckPerm]},
        {
          path: 'global-permissions-groups/new', component: FormComponent,
          data: {
              kind: 'newglobalpermissionsgp',
              type: 'create',
              path: SERV.ACCESS_PERMISSIONS_GROUPS,
              breadcrumb: 'New Global Permissions Groups',
              permission: 'RightGroup'
          },
          canActivate: [CheckPerm]},
        {
          path: 'global-permissions-groups/:id/edit', component: EditGlobalpermissionsgroupsComponent,
          data: {
              kind: 'edit-gpg',
              breadcrumb: 'Edit Global Permissions Group',
              permission: 'RightGroup'
          },
          canActivate: [CheckPerm]},
        {
          path: 'access-groups', component: GroupsComponent,
          data: {
              kind: 'access-groups',
              breadcrumb: 'Access Groups',
              permission: 'GroupAccess'
          },
          canActivate: [CheckPerm]},
        {
          path: 'access-groups/new', component: FormComponent,
          data: {
              kind: 'newaccessgroups',
              type: 'create',
              path: SERV.ACCESS_GROUPS,
              breadcrumb: 'New Access Group',
              permission: 'GroupAccess'
          },
          canActivate: [CheckPerm]},
        {
          path: 'access-groups/:id/edit', component: FormComponent,
          data: {
              kind: 'editaccessgroups',
              type: 'edit',
              path: SERV.ACCESS_GROUPS,
              breadcrumb: 'Edit Access Group',
              permission: 'GroupAccess'
          },
          canActivate: [CheckPerm]},
        ]
      }
   ]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class UsersRoutingModule {}
