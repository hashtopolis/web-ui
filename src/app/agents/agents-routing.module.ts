import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';

import { AgentStatusComponent } from '@src/app/agents/agent-status/agent-status.component';
import { EditAgentComponent } from '@src/app/agents/edit-agent/edit-agent.component';
import { NewAgentComponent } from '@src/app/agents/new-agent/new-agent.component';
import { ShowAgentsComponent } from '@src/app/agents/show-agents/show-agents.component';
import { IsAuth } from '@src/app/core/_guards/auth.guard';
import { CheckPerm } from '@src/app/core/_guards/permission.guard';

const routes: MyRoute[] = [
  {
    path: '',
    canActivate: [IsAuth],
    children: [
      {
        path: 'agent-status',
        component: AgentStatusComponent,
        data: {
          kind: 'agent-status',
          breadcrumb: 'Agent Status',
          permission: 'Agent' //ToDo this one has Agent read and Agent Stats read
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'new-agent',
        component: NewAgentComponent,
        data: {
          kind: 'new-agent',
          breadcrumb: 'New Agent',
          permission: 'Agent'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'show-agents',
        component: ShowAgentsComponent,
        data: {
          kind: 'show-agents',
          breadcrumb: 'Show Agent',
          permission: 'Agent'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'show-agents/:id/edit',
        component: EditAgentComponent,
        data: {
          kind: 'edit-agent',
          breadcrumb: 'Edit Agent',
          permission: 'Agent'
        },
        canActivate: [CheckPerm]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule {}
