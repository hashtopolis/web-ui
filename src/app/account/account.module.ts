import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountSettingsComponent } from './settings/acc-settings/acc-settings.component';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../shared/components.module';
import { CoreComponentsModule } from '../core/_components/core-components.module';
import { DataTablesModule } from 'angular-datatables';
import { EditNotificationComponent } from './notifications/notification/edit-notification.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NewNotificationComponent } from './notifications/notification/new-notification.component';
import { NgModule } from '@angular/core';
import { NotificationsComponent } from './notifications/notifications.component';
import { PipesModule } from '../shared/pipes.module';
import { RouterModule } from '@angular/router';
import { UiSettingsComponent } from './settings/ui-settings/ui-settings.component';
import { CoreFormsModule } from '../shared/forms.module';

@NgModule({
  declarations: [
    NewNotificationComponent,
    AccountSettingsComponent,
    NotificationsComponent,
    UiSettingsComponent,
    AccountComponent,
    EditNotificationComponent
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
