import { CheckPerm } from "../core/_guards/permission.guard";
import { Routes, RouterModule } from '@angular/router';
import { IsAuth } from "../core/_guards/auth.guard";
import { NgModule } from "@angular/core";

import { EditGlobalpermissionsgroupsComponent } from "./globalpermissionsgroups/edit-globalpermissionsgroups/edit-globalpermissionsgroups.component";
import { NewGlobalpermissionsgroupsComponent } from "./globalpermissionsgroups/new-globalpermissionsgroups/new-globalpermissionsgroups.component";
import { GlobalpermissionsgroupsComponent } from "./globalpermissionsgroups/globalpermissionsgroups.component";
import { CUGroupComponent } from "./groups/cu-group/cu-group.component";
import { EditUsersComponent } from "./edit-users/edit-users.component";
import { AllUsersComponent } from "./all-users/all-users.component";
import { GroupsComponent } from "./groups/groups.component";
import { UsersComponent } from "./users.component";

const routes: Routes = [
  {
    path: '',
    children: [
        {
          path: '', component: UsersComponent,
          data: {
              kind: 'users',
              breadcrumb: 'New User',
              permission: 'User'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: ':id/edit', component: EditUsersComponent,
          data: {
              kind: 'edit',
              breadcrumb: 'Edit User',
              permission: 'User'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'all-users', component: AllUsersComponent,
          data: {
              kind: 'all-users',
              breadcrumb: 'All Users',
              permission: 'User'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'global-permissions-groups', component: GlobalpermissionsgroupsComponent,
          data: {
              kind: 'globalpermissionsgp',
              breadcrumb: 'Global Permissions Groups',
              permission: 'RightGroup'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'global-permissions-groups/new', component: NewGlobalpermissionsgroupsComponent,
          data: {
              kind: 'new-globalpermissionsgp',
              breadcrumb: 'New Global Permissions Groups',
              permission: 'RightGroup'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'global-permissions-groups/:id/edit', component: EditGlobalpermissionsgroupsComponent,
          data: {
              kind: 'edit-gpg',
              breadcrumb: 'Edit Global Permissions Group',
              permission: 'RightGroup'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'access-groups', component: GroupsComponent,
          data: {
              kind: 'access-groups',
              breadcrumb: 'Access Groups',
              permission: 'GroupAccess'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'access-groups/new', component: CUGroupComponent,
          data: {
              kind: 'new-access-groups',
              breadcrumb: 'New Access Group',
              permission: 'GroupAccess'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'access-groups/:id/edit', component: CUGroupComponent,
          data: {
              kind: 'edit-access-groups',
              breadcrumb: 'Edit Access Group',
              permission: 'GroupAccess'
          },
          canActivate: [IsAuth,CheckPerm]},
        ]
      }
   ]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class UsersRoutingModule {}
