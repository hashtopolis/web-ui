import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { CoreComponentsModule } from '@components/core-components.module';

import { AccountRoutingModule } from '@src/app/account/account-routing.module';
import { AccountComponent } from '@src/app/account/account.component';
import { ApiKeyDetailComponent } from '@src/app/account/api-keys/api-key-detail/api-key-detail.component';
import { ApiKeysComponent } from '@src/app/account/api-keys/api-keys.component';
import { NewApiKeyComponent } from '@src/app/account/api-keys/new-api-key/new-api-key.component';
import { RevealApiKeyDialogComponent } from '@src/app/account/api-keys/reveal-api-key/reveal-api-key.component';
import { NewNotificationComponent } from '@src/app/account/notifications/notification/new-notification.component';
import { NotificationsComponent } from '@src/app/account/notifications/notifications.component';
import { AccountSettingsComponent } from '@src/app/account/settings/acc-settings/acc-settings.component';
import { UiSettingsComponent } from '@src/app/account/settings/ui-settings/ui-settings.component';
import { ComponentsModule } from '@src/app/shared/components.module';
import { DirectivesModule } from '@src/app/shared/directives.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';
import { PipesModule } from '@src/app/shared/pipes.module';

@NgModule({
  declarations: [
    NewNotificationComponent,
    AccountSettingsComponent,
    NotificationsComponent,
    UiSettingsComponent,
    AccountComponent,
    ApiKeysComponent,
    ApiKeyDetailComponent,
    NewApiKeyComponent,
    RevealApiKeyDialogComponent
  ],
  imports: [
    AccountRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ComponentsModule,
    CoreFormsModule,
    CoreComponentsModule,
    DirectivesModule,
    RouterModule,
    CommonModule,
    PipesModule,
    FormsModule,
    ClipboardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class AccountModule {}
