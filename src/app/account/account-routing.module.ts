import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';

import { IsAuth } from '@src/app/core/_guards/auth.guard';

import { SERV } from '@services/main.config';

import { AccountComponent } from '@src/app/account/account.component';
import { NotificationsComponent } from '@src/app/account/notifications/notifications.component';
import { EditNotificationComponent } from '@src/app/account/notifications/notification/edit-notification.component';
import { NewNotificationComponent } from '@src/app/account/notifications/notification/new-notification.component';
import { AccountSettingsComponent } from '@src/app/account/settings/acc-settings/acc-settings.component';
import { UiSettingsComponent } from '@src/app/account/settings/ui-settings/ui-settings.component';

const routes: MyRoute[] = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AccountComponent,
        data: {
          kind: 'account',
          breadcrumb: ''
        },
        canActivate: [IsAuth]
      },
      {
        path: 'acc-settings',
        component: AccountSettingsComponent,
        data: {
          kind: 'acc-settings',
          breadcrumb: 'Account Settings'
        },
        canActivate: [IsAuth]
      },
      {
        path: 'ui-settings',
        component: UiSettingsComponent,
        data: {
          kind: 'uisettings',
          type: 'edit',
          path: SERV.CONFIGS,
          breadcrumb: 'UI Settings'
        },
        canActivate: [IsAuth]
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        data: {
          kind: 'notifications',
          breadcrumb: 'Notifications'
        },
        canActivate: [IsAuth]
      },
      {
        path: 'notifications/:id/edit',
        component: EditNotificationComponent,
        data: {
          kind: 'editnotif',
          type: 'edit',
          path: SERV.NOTIFICATIONS.URL,
          breadcrumb: 'Edit Notification'
        },
        canActivate: [IsAuth]
      },
      {
        path: 'notifications/new-notification',
        component: NewNotificationComponent,
        data: {
          kind: 'new-notifications',
          breadcrumb: 'New Notification'
        },
        canActivate: [IsAuth]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
