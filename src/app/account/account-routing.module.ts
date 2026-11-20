import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';

import { AccountComponent } from '@src/app/account/account.component';
import { ApiKeyDetailComponent } from '@src/app/account/api-keys/api-key-detail/api-key-detail.component';
import { ApiKeysComponent } from '@src/app/account/api-keys/api-keys.component';
import { NewApiKeyComponent } from '@src/app/account/api-keys/new-api-key/new-api-key.component';
import { NewNotificationComponent } from '@src/app/account/notifications/notification/new-notification.component';
import { NotificationsComponent } from '@src/app/account/notifications/notifications.component';
import { AccountSettingsComponent } from '@src/app/account/settings/acc-settings/acc-settings.component';
import { UiSettingsComponent } from '@src/app/account/settings/ui-settings/ui-settings.component';
import { requireAuth } from '@src/app/core/_guards/auth.guard';

const routes: MyRoute[] = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AccountComponent,
        canActivate: [requireAuth]
      },
      {
        path: 'acc-settings',
        component: AccountSettingsComponent,
        canActivate: [requireAuth]
      },
      {
        path: 'ui-settings',
        component: UiSettingsComponent,
        canActivate: [requireAuth]
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        canActivate: [requireAuth]
      },
      {
        path: 'notifications/new-notification',
        component: NewNotificationComponent,
        canActivate: [requireAuth]
      },
      {
        path: 'api-keys',
        component: ApiKeysComponent,
        canActivate: [requireAuth]
      },
      {
        path: 'api-keys/new',
        component: NewApiKeyComponent,
        canActivate: [requireAuth]
      },
      {
        path: 'api-keys/:id',
        component: ApiKeyDetailComponent,
        canActivate: [requireAuth]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
