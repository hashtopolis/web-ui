import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "../shared/components.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTablesModule } from "angular-datatables";
import { PipesModule } from "../shared/pipes.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { EditGlobalpermissionsgroupsComponent } from './globalpermissionsgroups/edit-globalpermissionsgroups/edit-globalpermissionsgroups.component';
import { GlobalpermissionsgroupsComponent } from './globalpermissionsgroups/globalpermissionsgroups.component';
import { EditUsersComponent } from "./edit-users/edit-users.component";
import { AllUsersComponent } from "./all-users/all-users.component";
import { GroupsComponent } from "./groups/groups.component";
import { UsersRoutingModule } from "./users-routing.module";
import { UsersComponent } from "./users.component";


@NgModule({
  declarations:[
    EditGlobalpermissionsgroupsComponent,
    GlobalpermissionsgroupsComponent,
    EditUsersComponent,
    AllUsersComponent,
    GroupsComponent,
    UsersComponent
  ],
  imports:[
    ReactiveFormsModule,
    UsersRoutingModule,
    FontAwesomeModule,
    DataTablesModule,
    ComponentsModule,
    RouterModule,
    CommonModule,
    FormsModule,
    PipesModule,
    NgbModule
  ]
})
export class UsersModule {}
