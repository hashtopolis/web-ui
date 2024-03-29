import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AgentStatusModalComponent } from './agent-status/agent-status-modal/agent-status-modal.component';
import { AgentStatusComponent } from './agent-status/agent-status.component';
import { ShowAgentsComponent } from './show-agents/show-agents.component';
import { EditAgentComponent } from './edit-agent/edit-agent.component';
import { NewAgentComponent } from './new-agent/new-agent.component';
import { DirectivesModule } from '../shared/directives.module';
import { ComponentsModule } from '../shared/components.module';
import { AgentsRoutingModule } from './agents-routing.module';
import { PipesModule } from '../shared/pipes.module';
import { CoreComponentsModule } from '../core/_components/core-components.module';
import { CoreFormsModule } from '../shared/forms.module';

@NgModule({
  declarations: [
    AgentStatusModalComponent,
    AgentStatusComponent,
    ShowAgentsComponent,
    EditAgentComponent,
    NewAgentComponent
  ],
  imports: [
    CoreComponentsModule,
    CoreFormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AgentsRoutingModule,
    DataTablesModule,
    DirectivesModule,
    ComponentsModule,
    CoreFormsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    PipesModule,
    NgbModule
  ]
})
export class AgentsModule {}
