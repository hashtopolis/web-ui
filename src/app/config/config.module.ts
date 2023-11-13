import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgentBinariesComponent } from './engine/agent-binaries/agent-binaries.component';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../shared/components.module';
import { ConfigRoutingModule } from './config-routing.module';
import { CoreComponentsModule } from '../core/_components/core-components.module';
import { CrackersComponent } from './engine/crackers/crackers.component';
import { DataTablesModule } from 'angular-datatables';
import { EditCrackersComponent } from './engine/crackers/edit-version/edit-crackers.component';
import { EditHealthChecksComponent } from './health-checks/edit-health-check/edit-health-checks.component';
import { EngineMenuComponent } from './engine/engine-menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HashtypeComponent } from './hashtypes/hashtype/hashtype.component';
import { HashtypesComponent } from './hashtypes/hashtypes.component';
import { HealthChecksComponent } from './health-checks/health-checks.component';
import { LogComponent } from './log/log.component';
import { NewAgentBinariesComponent } from './engine/agent-binaries/agent-binary/new-agent-binaries.component';
import { NewCrackerComponent } from './engine/crackers/new-cracker/new-cracker.component';
import { NewCrackersComponent } from './engine/crackers/new-version/new-crackers.component';
import { NewHealthChecksComponent } from './health-checks/new-health-check/new-health-checks.component';
import { NewPreprocessorComponent } from './engine/preprocessors/preprocessor/new-preprocessor.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../shared/pipes.module';
import { PreprocessorsComponent } from './engine/preprocessors/preprocessors.component';
import { RouterModule } from '@angular/router';
import { ServerComponent } from './server/server.component';
import { SettingsMenuComponent } from './server/settings-menu';

@NgModule({
  declarations: [
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
  imports: [
    ReactiveFormsModule,
    ConfigRoutingModule,
    FontAwesomeModule,
    DataTablesModule,
    ComponentsModule,
    CoreComponentsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    PipesModule,
    NgbModule
  ]
})
export class ConfigModule {}
