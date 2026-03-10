import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgentBinariesComponent } from './engine/agent-binaries/agent-binaries.component';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../shared/components.module';
import { ConfigRoutingModule } from './config-routing.module';
import { CoreComponentsModule } from '../core/_components/core-components.module';
import { CrackersComponent } from './engine/crackers/crackers.component';
import { ViewHealthChecksComponent } from './health-checks/view-health-check/view-health-checks.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HashtypesComponent } from './hashtypes/hashtypes.component';
import { HealthChecksComponent } from './health-checks/health-checks.component';
import { LogComponent } from './log/log.component';
import { NewHealthChecksComponent } from './health-checks/new-health-check/new-health-checks.component';
import { NgModule } from '@angular/core';
import { PipesModule } from '../shared/pipes.module';
import { PreprocessorsComponent } from './engine/preprocessors/preprocessors.component';
import { RouterModule } from '@angular/router';
import { CoreFormsModule } from '../shared/forms.module';

@NgModule({
  declarations: [
    ViewHealthChecksComponent,
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
    ComponentsModule,
    CoreFormsModule,
    CoreComponentsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    PipesModule
  ]
})
export class ConfigModule {}
