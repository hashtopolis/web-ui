import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTablesModule } from "angular-datatables";
import { ComponentsModule } from "../shared/components.module";
import { PipesModule } from "../shared/pipes.module";
import { UsersRoutingModule } from "./users-routing.module";

import { UsersComponent } from "./users.component";
import { EditUsersComponent } from "./edit-users/edit-users.component";
import { AllUsersComponent } from "./all-users/all-users.component";
import { YubikeyComponent } from "./yubikey/yubikey.component";
import { GroupsComponent } from "./groups/groups.component";


@NgModule({
  declarations:[
    UsersComponent,
    EditUsersComponent,
    AllUsersComponent,
    YubikeyComponent,
    GroupsComponent
  ],
  imports:[
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DataTablesModule,
    NgbModule,
    ComponentsModule,
    PipesModule,
    UsersRoutingModule
  ]
})
export class UsersModule {}
