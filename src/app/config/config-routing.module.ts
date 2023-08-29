import { CheckPerm } from "../core/_guards/permission.guard";
import { Routes, RouterModule } from '@angular/router';
import { IsAuth } from "../core/_guards/auth.guard";
import { NgModule } from "@angular/core";

import { NewAgentBinariesComponent } from "./engine/agent-binaries/agent-binary/new-agent-binaries.component";
import { EditHealthChecksComponent } from "./health-checks/edit-health-check/edit-health-checks.component";
import { NewPreprocessorComponent } from "./engine/preprocessors/preprocessor/new-preprocessor.component";
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
import { LogComponent } from "./log/log.component";

const routes: Routes = [
  {
    path: '',
    children: [
        {
          path: 'agent',  component: ServerComponent,
          data: {
              kind: 'agent',
              breadcrumb: 'Agent Settings',
              permission: 'Config'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'task-chunk',  component: ServerComponent,
          data: {
              kind: 'task-chunk',
              breadcrumb: 'Task Chunk Settings',
              permission: 'Config'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'hch',  component: ServerComponent,
          data: {
              kind: 'hch',
              breadcrumb: 'Hashes/Cracks/Hashlist Settings',
              permission: 'Config'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'notifications',  component: ServerComponent,
          data: {
              kind: 'notif',
              breadcrumb: 'Notifications',
              permission: 'Notif'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'general-settings',  component: ServerComponent,
          data: {
              kind: 'gs',
              breadcrumb: 'General Settings',
              permission: 'Config'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'hashtypes',  component: HashtypesComponent,
          data: {
              kind: 'hashtypes',
              breadcrumb: 'Hashtypes',
              permission: 'Hashtype'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'hashtypes/new',  component: HashtypeComponent,
          data: {
              kind: 'new-hashtype',
              breadcrumb: 'New Hashtype',
              permission: 'Hashtype'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'hashtypes/:id/edit',  component: HashtypeComponent,
          data: {
              kind: 'edit-hashtype',
              breadcrumb: 'Edit Hashtype',
              permission: 'Hashtype'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'log',  component: LogComponent,
          data: {
              kind: 'log',
              breadcrumb: 'Logs',
              permission: 'Logs'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'health-checks',  component: HealthChecksComponent,
          data: {
              kind: 'health-checks',
              breadcrumb: 'Health Checks',
              permission: 'HealthCheck'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'health-checks/new',  component: NewHealthChecksComponent,
          data: {
              kind: 'new-health-checks',
              breadcrumb: 'New Health Checks',
              permission: 'HealthCheck'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'health-checks/:id/edit',  component: EditHealthChecksComponent,
          data: {
              kind: 'edit-health-checks',
              breadcrumb: 'Edit Health Checks',
              permission: 'HealthCheck'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'engine/agent-binaries',  component: AgentBinariesComponent,
          data: {
              kind: 'agent-binaries',
              breadcrumb: 'Engine > Agent-binaries',
              permission: 'AgentBinary'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'engine/agent-binaries/new-agent-binary',  component: NewAgentBinariesComponent,
          data: {
              kind: 'new-agent-binary',
              breadcrumb: 'Engine > New Agent binary',
              permission: 'AgentBinary'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'engine/agent-binaries/:id/edit',  component: NewAgentBinariesComponent,
          data: {
              kind: 'edit-agent-binary',
              breadcrumb: 'Engine > Edit Agent binary',
              permission: 'AgentBinary'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'engine/crackers',  component: CrackersComponent,
          data: {
              kind: 'crackers',
              breadcrumb: 'Engine > Crackers',
              permission: 'CrackerBinary'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'engine/crackers/new',  component: NewCrackerComponent,
          data: {
              kind: 'new-cracker',
              breadcrumb: 'Engine > New Cracker',
              permission: 'CrackerBinary'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'engine/crackers/:id/new',  component: NewCrackersComponent,
          data: {
              kind: 'new-cracker-version',
              breadcrumb: 'Engine > New Cracker Version/Binary',
              permission: 'CrackerBinary'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'engine/crackers/:id/edit',  component: EditCrackersComponent,
          data: {
              kind: 'edit-cracker-version',
              breadcrumb: 'Engine > Edit Cracker Version/Binary',
              permission: 'CrackerBinaryType'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'engine/preprocessors',  component: PreprocessorsComponent,
          data: {
              kind: 'preprocessors',
              breadcrumb: 'Engine > Preprocessors',
              permission: 'Prepro'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'engine/preprocessors/new-preprocessor',  component: NewPreprocessorComponent,
          data: {
              kind: 'new-preprocessor',
              breadcrumb: 'Engine > New Preprocessor',
              permission: 'Prepro'
          },
          canActivate: [IsAuth,CheckPerm]},
        {
          path: 'engine/preprocessors/:id/edit',  component: NewPreprocessorComponent,
          data: {
              kind: 'edit-preprocessor',
              breadcrumb: 'Engine > Edit Preprocessor',
              permission: 'Prepro'
          },
          canActivate: [IsAuth,CheckPerm]},
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class ConfigRoutingModule {}
