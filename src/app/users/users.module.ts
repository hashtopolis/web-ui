import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AllUsersComponent } from '@src/app/users/all-users/all-users.component';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@src/app/shared/components.module';
import { CoreComponentsModule } from '@components/core-components.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';
import { DataTablesModule } from 'angular-datatables';
import { DirectivesModule } from '@src/app/shared/directives.module';
import { EditGlobalpermissionsgroupsComponent } from '@src/app/users/globalpermissionsgroups/edit-globalpermissionsgroups/edit-globalpermissionsgroups.component';
import { EditGroupsComponent } from '@src/app/users/edit-groups/edit-groups.component';
import { EditUsersComponent } from '@src/app/users/edit-users/edit-users.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GlobalpermissionsgroupsComponent } from '@src/app/users/globalpermissionsgroups/globalpermissionsgroups.component';
import { GroupsComponent } from '@src/app/users/groups/groups.component';
import { NewUserComponent } from '@src/app/users/new-user/new-user.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '@src/app/shared/pipes.module';
import { RouterModule } from '@angular/router';
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
    DirectivesModule,
    CoreFormsModule,
    RouterModule,
    CommonModule,
    FormsModule,
    PipesModule,
    NgbModule
  ]
})
export class UsersModule {}
