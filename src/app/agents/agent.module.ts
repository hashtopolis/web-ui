import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CoreComponentsModule } from '@components/core-components.module';
import { AgentStatGraphComponent } from '@src/app/shared/graphs/echarts/agent-stat-graph/agent-stat-graph.component';

import { AgentStatusModalComponent } from '@src/app/agents/agent-status/agent-status-modal/agent-status-modal.component';
import { AgentStatusComponent } from '@src/app/agents/agent-status/agent-status.component';
import { AgentsRoutingModule } from '@src/app/agents/agents-routing.module';
import { EditAgentComponent } from '@src/app/agents/edit-agent/edit-agent.component';
import { NewAgentComponent } from '@src/app/agents/new-agent/new-agent.component';
import { ShowAgentsComponent } from '@src/app/agents/show-agents/show-agents.component';
import { ComponentsModule } from '@src/app/shared/components.module';
import { DirectivesModule } from '@src/app/shared/directives.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';
import { PipesModule } from '@src/app/shared/pipes.module';

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
    NgbModule,
    AgentStatGraphComponent
  ]
})
export class AgentsModule {}
