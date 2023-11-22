import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgentStatusComponent } from './agent-status/agent-status.component';
import { AgentsRoutingModule } from './agents-routing.module';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../shared/components.module';
import { CoreComponentsModule } from '../core/_components/core-components.module';
import { DataTablesModule } from 'angular-datatables';
import { DirectivesModule } from '../shared/directives.module';
import { EditAgentComponent } from './edit-agent/edit-agent.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { NewAgentComponent } from './new-agent/new-agent.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../shared/pipes.module';
import { RouterModule } from '@angular/router';
import { ShowAgentsComponent } from './show-agents/show-agents.component';

@NgModule({
  declarations: [
    AgentStatusComponent,
    ShowAgentsComponent,
    EditAgentComponent,
    NewAgentComponent
  ],
  imports: [
    CoreComponentsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    AgentsRoutingModule,
    MatIconModule,
    DataTablesModule,
    DirectivesModule,
    ComponentsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    PipesModule,
    NgbModule
  ]
})
export class AgentsModule {}
