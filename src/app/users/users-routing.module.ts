import { AuthGuard } from "../core/_guards/auth.guard";
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";

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
          path: 'access-groups', component: GroupsComponent,
          data: {
              kind: 'access-groups',
              breadcrumb: 'Access Groups'
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
