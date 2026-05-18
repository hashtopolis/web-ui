import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';

import { AgentRoleService } from '@services/roles/agents/agent-role.service';

import { AgentStatusComponent } from '@src/app/agents/agent-status/agent-status.component';
import { EditAgentComponent } from '@src/app/agents/edit-agent/edit-agent.component';
import { NewAgentComponent } from '@src/app/agents/new-agent/new-agent.component';
import { ShowAgentsComponent } from '@src/app/agents/show-agents/show-agents.component';
import { IsAuth } from '@src/app/core/_guards/auth.guard';
import { CheckRole } from '@src/app/core/_guards/permission.guard';

const roleServiceClass = AgentRoleService;

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
          roleServiceClass: roleServiceClass,
          roleName: 'readStat'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'new-agent',
        component: NewAgentComponent,
        data: {
          kind: 'new-agent',
          breadcrumb: 'New Agent',
          roleServiceClass: roleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'show-agents',
        component: ShowAgentsComponent,
        data: {
          kind: 'show-agents',
          breadcrumb: 'Show Agent',
          roleServiceClass: roleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'show-agents/:id/edit',
        component: EditAgentComponent,
        data: {
          kind: 'edit-agent',
          breadcrumb: 'Edit Agent',
          roleServiceClass: roleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule {}
