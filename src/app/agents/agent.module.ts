import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CoreComponentsModule } from '@components/core-components.module';

import { AgentStatusComponent } from '@src/app/agents/agent-status/agent-status.component';
import { AgentsRoutingModule } from '@src/app/agents/agents-routing.module';
import { EditAgentComponent } from '@src/app/agents/edit-agent/edit-agent.component';
import { NewAgentComponent } from '@src/app/agents/new-agent/new-agent.component';
import { ShowAgentsComponent } from '@src/app/agents/show-agents/show-agents.component';
import { ComponentsModule } from '@src/app/shared/components.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';
import { AgentStatGraphComponent } from '@src/app/shared/graphs/echarts/agent-stat-graph/agent-stat-graph.component';
import { PipesModule } from '@src/app/shared/pipes.module';

@NgModule({
  declarations: [AgentStatusComponent, ShowAgentsComponent, EditAgentComponent, NewAgentComponent],
  imports: [
    CoreComponentsModule,
    CoreFormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AgentsRoutingModule,
    ComponentsModule,
    CoreFormsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    PipesModule,
    AgentStatGraphComponent
  ]
})
export class AgentsModule {}
