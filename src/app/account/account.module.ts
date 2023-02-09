import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AccountRoutingModule } from "./account-routing.module";
import { ComponentsModule } from "../shared/components.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTablesModule } from "angular-datatables";
import { PipesModule } from "../shared/pipes.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { NotificationsComponent } from "./notifications/notifications.component";
import { SettingsComponent } from "./settings/settings.component";
import { AccountComponent } from "./account.component";


@NgModule({
  declarations:[
    NotificationsComponent,
    SettingsComponent,
    AccountComponent,
  ],
  imports:[
    AccountRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ComponentsModule,
    DataTablesModule,
    RouterModule,
    CommonModule,
    PipesModule,
    FormsModule,
    NgbModule,
  ]
})
export class AccountModule {}
