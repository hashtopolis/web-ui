import { AuthGuard } from "../core/_guards/auth.guard";
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";

import { EditGlobalpermissionsgroupsComponent } from "./globalpermissionsgroups/edit-globalpermissionsgroups/edit-globalpermissionsgroups.component";
import { NewGlobalpermissionsgroupsComponent } from "./globalpermissionsgroups/new-globalpermissionsgroups/new-globalpermissionsgroups.component";
import { GlobalpermissionsgroupsComponent } from "./globalpermissionsgroups/globalpermissionsgroups.component";
import { CUGroupComponent } from "./groups/cu-group/cu-group.component";
import { EditUsersComponent } from "./edit-users/edit-users.component";
import { AccessGroupsGuard } from "../core/_guards/accessgroups.guard";
import { AllUsersComponent } from "./all-users/all-users.component";
import { GroupsComponent } from "./groups/groups.component";
import { UsersGuard } from "../core/_guards/users.guard";
import { UsersComponent } from "./users.component";

const routes: Routes = [
  {
    path: '',
    children: [
        {
          path: '', component: UsersComponent,
          data: {
              kind: 'users',
              breadcrumb: 'New User'
          },
          canActivate: [AuthGuard,UsersGuard]},
        {
          path: ':id/edit', component: EditUsersComponent,
          data: {
              kind: 'edit',
              breadcrumb: 'Edit User'
          },
          canActivate: [AuthGuard,UsersGuard]},
        {
          path: 'all-users', component: AllUsersComponent,
          data: {
              kind: 'all-users',
              breadcrumb: 'All Users'
          },
          canActivate: [AuthGuard,UsersGuard]},
        {
          path: 'global-permissions-groups', component: GlobalpermissionsgroupsComponent,
          data: {
              kind: 'globalpermissionsgp',
              breadcrumb: 'Global Permissions Groups'
          },
          canActivate: [AuthGuard,UsersGuard]},
        {
          path: 'global-permissions-groups/new', component: NewGlobalpermissionsgroupsComponent,
          data: {
              kind: 'new-globalpermissionsgp',
              breadcrumb: 'New Global Permissions Groups'
          },
          canActivate: [AuthGuard,UsersGuard]},
        {
          path: 'global-permissions-groups/:id/edit', component: EditGlobalpermissionsgroupsComponent,
          data: {
              kind: 'edit-gpg',
              breadcrumb: 'Edit Global Permissions Group'
          },
          canActivate: [AuthGuard,UsersGuard]},
        {
          path: 'access-groups', component: GroupsComponent,
          data: {
              kind: 'access-groups',
              breadcrumb: 'Access Groups'
          },
          canActivate: [AuthGuard,AccessGroupsGuard]},
        {
          path: 'access-groups/new', component: CUGroupComponent,
          data: {
              kind: 'new-access-groups',
              breadcrumb: 'New Access Group'
          },
          canActivate: [AuthGuard,AccessGroupsGuard]},
        {
          path: 'access-groups/:id/edit', component: CUGroupComponent,
          data: {
              kind: 'edit-access-groups',
              breadcrumb: 'Edit Access Group'
          },
          canActivate: [AuthGuard,AccessGroupsGuard]},
        ]
      }
   ]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class UsersRoutingModule {}
