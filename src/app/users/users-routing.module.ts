import { AuthGuard } from "../core/_guards/auth.guard";
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";

import { EditUsersComponent } from "./edit-users/edit-users.component";
import { AllUsersComponent } from "./all-users/all-users.component";
import { YubikeyComponent } from "./yubikey/yubikey.component";
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
              breadcrumb: 'New User'
          },
          canActivate: [AuthGuard]},
        {
          path: ':id/edit', component: EditUsersComponent,
          data: {
              kind: 'edit',
              breadcrumb: 'Edit User'
          },
          canActivate: [AuthGuard]},
        {
          path: 'all-users', component: AllUsersComponent,
          data: {
              kind: 'all-users',
              breadcrumb: 'All Users'
          },
          canActivate: [AuthGuard]},
        {
          path: 'yubikey', component: YubikeyComponent,
          data: {
              kind: 'yubikey',
              breadcrumb: 'Yubikey'
          },
          canActivate: [AuthGuard]},
        {
          path: 'groups', component: GroupsComponent,
          data: {
              kind: 'groups',
              breadcrumb: 'Access Group'
          },
          canActivate: [AuthGuard]},

        ]
      }
   ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class UsersRoutingModule {}
