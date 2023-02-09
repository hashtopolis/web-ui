import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTablesModule } from "angular-datatables";
import { ComponentsModule } from "../shared/components.module";
import { PipesModule } from "../shared/pipes.module";
import { AccountRoutingModule } from "./account-routing.module";

import { AccountComponent } from "./account.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { SettingsComponent } from "./settings/settings.component";


@NgModule({
  declarations:[
    AccountComponent,
    SettingsComponent,
    NotificationsComponent,
  ],
  imports:[
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgbModule,
    ComponentsModule,
    PipesModule,
    AccountRoutingModule
  ]
})
export class AccountModule {}
