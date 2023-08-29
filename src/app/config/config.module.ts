import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTablesModule } from "angular-datatables";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { NewAgentBinariesComponent } from "./engine/agent-binaries/agent-binary/new-agent-binaries.component";
import { NewPreprocessorComponent } from './engine/preprocessors/preprocessor/new-preprocessor.component';
import { EditHealthChecksComponent } from './health-checks/edit-health-check/edit-health-checks.component';
import { NewHealthChecksComponent } from './health-checks/new-health-check/new-health-checks.component';
import { EditCrackersComponent } from './engine/crackers/edit-version/edit-crackers.component';
import { NewCrackersComponent } from './engine/crackers/new-version/new-crackers.component';
import { NewCrackerComponent } from './engine/crackers/new-cracker/new-cracker.component';
import { AgentBinariesComponent } from "./engine/agent-binaries/agent-binaries.component";
import { PreprocessorsComponent } from "./engine/preprocessors/preprocessors.component";
import { HealthChecksComponent } from "./health-checks/health-checks.component";
import { HashtypeComponent } from './hashtypes/hashtype/hashtype.component';
import { CrackersComponent } from "./engine/crackers/crackers.component";
import { HashtypesComponent } from "./hashtypes/hashtypes.component";
import { ComponentsModule } from "../shared/components.module";
import { SettingsMenuComponent } from "./server/settings-menu";
import { ConfigRoutingModule } from "./config-routing.module";
import { ServerComponent } from "./server/server.component";
import { EngineMenuComponent } from "./engine/engine-menu";
import { PipesModule } from "../shared/pipes.module";
import { LogComponent } from "./log/log.component";

@NgModule({
  declarations:[
    NewAgentBinariesComponent,
    EditHealthChecksComponent,
    NewPreprocessorComponent,
    NewHealthChecksComponent,
    PreprocessorsComponent,
    AgentBinariesComponent,
    HealthChecksComponent,
    EditCrackersComponent,
    SettingsMenuComponent,
    NewCrackersComponent,
    NewCrackerComponent,
    EngineMenuComponent,
    HashtypesComponent,
    CrackersComponent,
    HashtypeComponent,
    ServerComponent,
    LogComponent
  ],
  imports:[
    ReactiveFormsModule,
    ConfigRoutingModule,
    FontAwesomeModule,
    DataTablesModule,
    ComponentsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    PipesModule,
    NgbModule
  ]
})
export class ConfigModule {}
