import { AuthGuard } from "../core/_guards/auth.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { AgentStatusComponent } from "./agent-status/agent-status.component";
import { PendingChangesGuard } from "../core/_guards/pendingchanges.guard";
import { ShowAgentsComponent } from "./show-agents/show-agents.component";
import { EditAgentComponent } from "./edit-agent/edit-agent.component";
import { NewAgentComponent } from "./new-agent/new-agent.component";
import { AgentGuard } from "../core/_guards/agent.guard";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'agent-status', component: AgentStatusComponent,
        data: {
            kind: 'agent-status',
            breadcrumb: 'Agent Status'
        },
        canActivate: [AuthGuard,AgentGuard]},
      {
        path: 'new-agent', component: NewAgentComponent,
        data: {
            kind: 'new-agent',
            breadcrumb: 'New Agent'
        },
        canActivate: [AuthGuard,AgentGuard]},
      {
        path: 'show-agents', component: ShowAgentsComponent,
        data: {
            kind: 'show-agents',
            breadcrumb: 'Show Agent'
        },
        canActivate: [AuthGuard,AgentGuard]},
      {
        path: 'show-agents/:id/edit', component: EditAgentComponent,
        data: {
            kind: 'edit-agent',
            breadcrumb: 'Edit Agent'
        },
        canActivate: [AuthGuard,AgentGuard]},
      ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class AgentsRoutingModule {}
