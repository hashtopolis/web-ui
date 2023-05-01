import { AuthGuard } from "../core/_guards/auth.guard";
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";

import { NewPreprocessorComponent } from "./engine/preprocessors/new-preprocessor/new-preprocessor.component";
import { NewAgentBinariesComponent } from "./engine/agent-binaries/new-agent-binary/new-agent-binaries.component";
import { EditHealthChecksComponent } from "./health-checks/edit-health-checks/edit-health-checks.component";
import { EditCrackersComponent } from "./engine/crackers/edit-crackers/edit-crackers.component";
import { NewCrackersComponent } from "./engine/crackers/new-crackers/new-crackers.component";
import { AgentBinariesComponent } from "./engine/agent-binaries/agent-binaries.component";
import { PreprocessorsComponent } from "./engine/preprocessors/preprocessors.component";
import { HealthChecksComponent } from "./health-checks/health-checks.component";
import { CrackersComponent } from "./engine/crackers/crackers.component";
import { HashtypesComponent } from "./hashtypes/hashtypes.component";
import { ServerComponent } from "./server/server.component";
import { ConfigGuard } from "../core/_guards/config.guard";
import { LogComponent } from "./log/log.component";

const routes: Routes = [
  {
    path: '',
    children: [
        {
          path: 'agent',  component: ServerComponent,
          data: {
              kind: 'agent',
              breadcrumb: 'Agent Settings'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'task-chunk',  component: ServerComponent,
          data: {
              kind: 'task-chunk',
              breadcrumb: 'Task Chunk Settings'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'hch',  component: ServerComponent,
          data: {
              kind: 'hch',
              breadcrumb: 'Hashes/Cracks/Hashlist Settings'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'notifications',  component: ServerComponent,
          data: {
              kind: 'notif',
              breadcrumb: 'Notifications'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'general-settings',  component: ServerComponent,
          data: {
              kind: 'gs',
              breadcrumb: 'General Settings'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'hashtypes',  component: HashtypesComponent,
          data: {
              kind: 'hashtypes',
              breadcrumb: 'Hashtypes'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'log',  component: LogComponent,
          data: {
              kind: 'log',
              breadcrumb: 'Logs'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'health-checks',  component: HealthChecksComponent,
          data: {
              kind: 'health-checks',
              breadcrumb: 'Health Checks'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'health-checks/:id/edit',  component: EditHealthChecksComponent,
          data: {
              kind: 'edit-health-checks',
              breadcrumb: 'Edit Health Checks'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'engine/agent-binaries',  component: AgentBinariesComponent,
          data: {
              kind: 'agent-binaries',
              breadcrumb: 'Engine > Agent-binaries'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'engine/agent-binaries/new-agent-binary',  component: NewAgentBinariesComponent,
          data: {
              kind: 'new-agent-binary',
              breadcrumb: 'Engine > New Agent binary'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'engine/agent-binaries/:id/edit',  component: NewAgentBinariesComponent,
          data: {
              kind: 'edit-agent-binary',
              breadcrumb: 'Engine > Edit Agent binary'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'engine/crackers',  component: CrackersComponent,
          data: {
              kind: 'crackers',
              breadcrumb: 'Engine > Crackers'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'engine/crackers/:id/new',  component: NewCrackersComponent,
          data: {
              kind: 'new-crackers',
              breadcrumb: 'Engine > New Version/Binary'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'engine/crackers/:id/edit',  component: EditCrackersComponent,
          data: {
              kind: 'edit-crackers',
              breadcrumb: 'Engine > Edit Cracker Version/Binary'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'engine/preprocessors',  component: PreprocessorsComponent,
          data: {
              kind: 'preprocessors',
              breadcrumb: 'Engine > Preprocessors'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'engine/preprocessors/new-preprocessor',  component: NewPreprocessorComponent,
          data: {
              kind: 'new-preprocessor',
              breadcrumb: 'Engine > New Preprocessor'
          },
          canActivate: [AuthGuard,ConfigGuard]},
        {
          path: 'engine/preprocessors/:id/edit',  component: NewPreprocessorComponent,
          data: {
              kind: 'edit-preprocessor',
              breadcrumb: 'Engine > Edit Preprocessor'
          },
          canActivate: [AuthGuard,ConfigGuard]},
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class ConfigRoutingModule {}
