import { IsAuth } from "../core/_guards/auth.guard";
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";

import { AccountSettingsComponent } from "./settings/acc-settings/acc-settings.component";
import { UiSettingsComponent } from "./settings/ui-settings/ui-settings.component";
import { NewNotificationComponent } from "./notifications/notification/new-notification.component";
import { FormUIsettingsComponent } from "../shared/form/formuisettings.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { AccountComponent } from "./account.component";
import { SERV } from '../core/_services/main.config';
import { FormComponent } from "../shared/form/form.component";

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
          canActivate: [IsAuth]},
        {
          path: 'acc-settings', component: AccountSettingsComponent,
          data: {
              kind: 'acc-settings',
              breadcrumb: 'Account Settings'
          },
          canActivate: [IsAuth]},
        {
          path: 'ui-settings', component: UiSettingsComponent,
          data: {
              kind: 'uisettings',
              type: 'edit',
              path: SERV.CONFIGS,
              breadcrumb: 'UI Settings'
          },
          canActivate: [IsAuth]},
        {
          path: 'notifications', component: NotificationsComponent,
          data: {
              kind: 'notifications',
              breadcrumb: 'Notifications'
          },
          canActivate: [IsAuth]},
        {
          path: 'notifications/:id/edit', component: FormComponent,
          data: {
              kind: 'editnotif',
              type: 'edit',
              path: SERV.NOTIFICATIONS,
              breadcrumb: 'Edit Notification'
          },
          canActivate: [IsAuth]},
        {
          path: 'notifications/new-notification', component: NewNotificationComponent,
          data: {
              kind: 'new-notifications',
              breadcrumb: 'New Notification'
          },
          canActivate: [IsAuth]},
        ]
      }
   ]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class AccountRoutingModule {}
