import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { EditHealthChecksComponent } from './health-checks/edit-health-check/edit-health-checks.component';
import { NewHealthChecksComponent } from './health-checks/new-health-check/new-health-checks.component';
import { AgentBinariesComponent } from './engine/agent-binaries/agent-binaries.component';
import { PreprocessorsComponent } from './engine/preprocessors/preprocessors.component';
import { HealthChecksComponent } from './health-checks/health-checks.component';
import { CrackersComponent } from './engine/crackers/crackers.component';
import { HashtypesComponent } from './hashtypes/hashtypes.component';
import { ComponentsModule } from '../shared/components.module';
import { ConfigRoutingModule } from './config-routing.module';
import { PipesModule } from '../shared/pipes.module';
import { LogComponent } from './log/log.component';

@NgModule({
  declarations: [
    EditHealthChecksComponent,
    NewHealthChecksComponent,
    PreprocessorsComponent,
    AgentBinariesComponent,
    HealthChecksComponent,
    HashtypesComponent,
    CrackersComponent,
    LogComponent
  ],
  imports: [
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
