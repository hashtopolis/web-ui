import { IsAuth } from "../core/_guards/auth.guard";
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";

import { NewPreprocessorComponent } from "./engine/preprocessors/preprocessor/new-preprocessor.component";
import { NewAgentBinariesComponent } from "./engine/agent-binaries/agent-binary/new-agent-binaries.component";
import { EditHealthChecksComponent } from "./health-checks/edit-health-check/edit-health-checks.component";
import { NewHealthChecksComponent } from "./health-checks/new-health-check/new-health-checks.component";
import { EditCrackersComponent } from "./engine/crackers/edit-version/edit-crackers.component";
import { NewCrackersComponent } from "./engine/crackers/new-version/new-crackers.component";
import { AgentBinariesComponent } from "./engine/agent-binaries/agent-binaries.component";
import { NewCrackerComponent } from "./engine/crackers/new-cracker/new-cracker.component";
import { PreprocessorsComponent } from "./engine/preprocessors/preprocessors.component";
import { HealthChecksComponent } from "./health-checks/health-checks.component";
import { HashtypeComponent } from "./hashtypes/hashtype/hashtype.component";
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
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'task-chunk',  component: ServerComponent,
          data: {
              kind: 'task-chunk',
              breadcrumb: 'Task Chunk Settings'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'hch',  component: ServerComponent,
          data: {
              kind: 'hch',
              breadcrumb: 'Hashes/Cracks/Hashlist Settings'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'notifications',  component: ServerComponent,
          data: {
              kind: 'notif',
              breadcrumb: 'Notifications'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'general-settings',  component: ServerComponent,
          data: {
              kind: 'gs',
              breadcrumb: 'General Settings'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'hashtypes',  component: HashtypesComponent,
          data: {
              kind: 'hashtypes',
              breadcrumb: 'Hashtypes'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'hashtypes/new',  component: HashtypeComponent,
          data: {
              kind: 'new-hashtype',
              breadcrumb: 'New Hashtype'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'hashtypes/:id/edit',  component: HashtypeComponent,
          data: {
              kind: 'edit-hashtype',
              breadcrumb: 'Edit Hashtype'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'log',  component: LogComponent,
          data: {
              kind: 'log',
              breadcrumb: 'Logs'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'health-checks',  component: HealthChecksComponent,
          data: {
              kind: 'health-checks',
              breadcrumb: 'Health Checks'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'health-checks/new',  component: NewHealthChecksComponent,
          data: {
              kind: 'new-health-checks',
              breadcrumb: 'New Health Checks'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'health-checks/:id/edit',  component: EditHealthChecksComponent,
          data: {
              kind: 'edit-health-checks',
              breadcrumb: 'Edit Health Checks'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'engine/agent-binaries',  component: AgentBinariesComponent,
          data: {
              kind: 'agent-binaries',
              breadcrumb: 'Engine > Agent-binaries'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'engine/agent-binaries/new-agent-binary',  component: NewAgentBinariesComponent,
          data: {
              kind: 'new-agent-binary',
              breadcrumb: 'Engine > New Agent binary'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'engine/agent-binaries/:id/edit',  component: NewAgentBinariesComponent,
          data: {
              kind: 'edit-agent-binary',
              breadcrumb: 'Engine > Edit Agent binary'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'engine/crackers',  component: CrackersComponent,
          data: {
              kind: 'crackers',
              breadcrumb: 'Engine > Crackers'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'engine/crackers/new',  component: NewCrackerComponent,
          data: {
              kind: 'new-cracker',
              breadcrumb: 'Engine > New Cracker'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'engine/crackers/:id/new',  component: NewCrackersComponent,
          data: {
              kind: 'new-cracker-version',
              breadcrumb: 'Engine > New Cracker Version/Binary'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'engine/crackers/:id/edit',  component: EditCrackersComponent,
          data: {
              kind: 'edit-cracker-version',
              breadcrumb: 'Engine > Edit Cracker Version/Binary'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'engine/preprocessors',  component: PreprocessorsComponent,
          data: {
              kind: 'preprocessors',
              breadcrumb: 'Engine > Preprocessors'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'engine/preprocessors/new-preprocessor',  component: NewPreprocessorComponent,
          data: {
              kind: 'new-preprocessor',
              breadcrumb: 'Engine > New Preprocessor'
          },
          canActivate: [IsAuth,ConfigGuard]},
        {
          path: 'engine/preprocessors/:id/edit',  component: NewPreprocessorComponent,
          data: {
              kind: 'edit-preprocessor',
              breadcrumb: 'Engine > Edit Preprocessor'
          },
          canActivate: [IsAuth,ConfigGuard]},
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class ConfigRoutingModule {}
