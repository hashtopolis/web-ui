import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AllUsersComponent } from './all-users/all-users.component';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../shared/components.module';
import { CoreComponentsModule } from '../core/_components/core-components.module';
import { DataTablesModule } from 'angular-datatables';
import { EditGlobalpermissionsgroupsComponent } from './globalpermissionsgroups/edit-globalpermissionsgroups/edit-globalpermissionsgroups.component';
import { EditUsersComponent } from './edit-users/edit-users.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GlobalpermissionsgroupsComponent } from './globalpermissionsgroups/globalpermissionsgroups.component';
import { GroupsComponent } from './groups/groups.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../shared/pipes.module';
import { RouterModule } from '@angular/router';
import { UsersRoutingModule } from './users-routing.module';
import { CoreFormsModule } from '../shared/forms.module';

@NgModule({
  declarations: [
    EditGlobalpermissionsgroupsComponent,
    GlobalpermissionsgroupsComponent,
    EditUsersComponent,
    AllUsersComponent,
    GroupsComponent
  ],
  imports: [
    ReactiveFormsModule,
    CoreComponentsModule,
    UsersRoutingModule,
    FontAwesomeModule,
    DataTablesModule,
    ComponentsModule,
    CoreFormsModule,
    RouterModule,
    CommonModule,
    FormsModule,
    PipesModule,
    NgbModule
  ]
})
export class UsersModule {}
