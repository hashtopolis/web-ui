import { AuthGuard } from "../core/_guards/auth.guard";
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";

import { NotificationsComponent } from "./notifications/notifications.component";
import { SettingsComponent } from "./settings/settings.component";
import { AccountComponent } from "./account.component";

const routes: Routes = [
  {
    path: '',
    children: [
        {
          path: '', component: AccountComponent,
          data: {
              kind: 'account',
              breadcrumb: ''
          },
          canActivate: [AuthGuard]},
        {
          path: 'settings', component: SettingsComponent,
          data: {
              kind: 'settings',
              breadcrumb: 'Settings'
          },
          canActivate: [AuthGuard]},
        {
          path: 'notifications', component: NotificationsComponent,
          data: {
              kind: 'notifications',
              breadcrumb: 'Notifications'
          },
          canActivate: [AuthGuard]},
        ]
      }
   ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class AccountRoutingModule {}
