import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTablesModule } from "angular-datatables";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

import { ServerComponent } from "./server/server.component";
import { ConfigRoutingModule } from "./config-routing.module";

import { AgentBinariesComponent } from "./engine/agent-binaries/agent-binaries.component";
import { CrackersComponent } from "./engine/crackers/crackers.component";
import { PreprocessorsComponent } from "./engine/preprocessors/preprocessors.component";
import { HealthChecksComponent } from "./health-checks/health-checks.component";
import { LogComponent } from "./log/log.component";
import { NewPreprocessorComponent } from './engine/preprocessors/new-preprocessor/new-preprocessor.component';
import { EditHealthChecksComponent } from './health-checks/edit-health-checks/edit-health-checks.component';
import { EditCrackersComponent } from './engine/crackers/edit-crackers/edit-crackers.component';

import { PipesModule } from "../shared/pipes.module";
import { HashtypesComponent } from "./hashtypes/hashtypes.component";
import { ComponentsModule } from "../shared/components.module";
import { NewCrackersComponent } from './engine/crackers/new-crackers/new-crackers.component';



@NgModule({
  declarations:[
    ServerComponent,
    LogComponent,
    HealthChecksComponent,
    AgentBinariesComponent,
    CrackersComponent,
    PreprocessorsComponent,
    HashtypesComponent,
    NewPreprocessorComponent,
    EditHealthChecksComponent,
    EditCrackersComponent,
    NewCrackersComponent
  ],
  imports:[
    CommonModule,
    RouterModule,
    DataTablesModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    PipesModule,
    ConfigRoutingModule,
    ComponentsModule
  ]
})
export class ConfigModule {}
