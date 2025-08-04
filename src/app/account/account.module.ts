import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataTablesModule } from 'angular-datatables';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { CoreComponentsModule } from '@components/core-components.module';

import { AccountRoutingModule } from '@src/app/account/account-routing.module';
import { AccountComponent } from '@src/app/account/account.component';
import { NewNotificationComponent } from '@src/app/account/notifications/notification/new-notification.component';
import { NotificationsComponent } from '@src/app/account/notifications/notifications.component';
import { AccountSettingsComponent } from '@src/app/account/settings/acc-settings/acc-settings.component';
import { UiSettingsComponent } from '@src/app/account/settings/ui-settings/ui-settings.component';
import { ComponentsModule } from '@src/app/shared/components.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';
import { PipesModule } from '@src/app/shared/pipes.module';

@NgModule({
  declarations: [
    NewNotificationComponent,
    AccountSettingsComponent,
    NotificationsComponent,
    UiSettingsComponent,
    AccountComponent
  ],
  imports: [
    AccountRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DataTablesModule,
    ComponentsModule,
    CoreFormsModule,
    CoreComponentsModule,
    RouterModule,
    CommonModule,
    PipesModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class AccountModule {}
