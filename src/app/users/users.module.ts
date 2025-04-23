import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CoreComponentsModule } from '@components/core-components.module';

import { ComponentsModule } from '@src/app/shared/components.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';
import { PipesModule } from '@src/app/shared/pipes.module';
import { AllUsersComponent } from '@src/app/users/all-users/all-users.component';
import { EditGroupsComponent } from '@src/app/users/edit-groups/edit-groups.component';
import { EditUsersComponent } from '@src/app/users/edit-users/edit-users.component';
import { EditGlobalpermissionsgroupsComponent } from '@src/app/users/globalpermissionsgroups/edit-globalpermissionsgroups/edit-globalpermissionsgroups.component';
import { GlobalpermissionsgroupsComponent } from '@src/app/users/globalpermissionsgroups/globalpermissionsgroups.component';
import { GroupsComponent } from '@src/app/users/groups/groups.component';
import { NewUserComponent } from '@src/app/users/new-user/new-user.component';
import { UsersRoutingModule } from '@src/app/users/users-routing.module';

@NgModule({
  declarations: [
    EditGlobalpermissionsgroupsComponent,
    GlobalpermissionsgroupsComponent,
    EditGroupsComponent,
    EditUsersComponent,
    AllUsersComponent,
    GroupsComponent,
    NewUserComponent
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
