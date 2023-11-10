import { CheckPerm } from "../core/_guards/permission.guard";
import { Routes, RouterModule } from '@angular/router';
import { IsAuth } from "../core/_guards/auth.guard";
import { NgModule } from "@angular/core";

import { EditHealthChecksComponent } from "./health-checks/edit-health-check/edit-health-checks.component";
import { NewHealthChecksComponent } from "./health-checks/new-health-check/new-health-checks.component";
import { AgentBinariesComponent } from "./engine/agent-binaries/agent-binaries.component";
import { PreprocessorsComponent } from "./engine/preprocessors/preprocessors.component";
import { HealthChecksComponent } from "./health-checks/health-checks.component";
import { FormConfigComponent } from "../shared/form/formconfig.component";
import { CrackersComponent } from "./engine/crackers/crackers.component";
import { HashtypesComponent } from "./hashtypes/hashtypes.component";
import { FormComponent } from "../shared/form/form.component";
import { SERV } from '../core/_services/main.config';
import { LogComponent } from "./log/log.component";

const routes: Routes = [
  {
    path: '',
    canActivate: [IsAuth],
    children: [
        {
          path: 'agent',  component: FormConfigComponent,
          data: {
              kind: 'serveragent',
              type: 'edit',
              path: SERV.CONFIGS,
              breadcrumb: 'Agent Settings',
              permission: 'Config'
          },
          canActivate: [CheckPerm]},
        {
          path: 'task-chunk',  component: FormConfigComponent,
          data: {
              kind: 'servertaskchunk',
              type: 'edit',
              path: SERV.CONFIGS,
              breadcrumb: 'Task Chunk Settings',
              permission: 'Config'
          },
          canActivate: [CheckPerm]},
        {
          path: 'hch',  component: FormConfigComponent,
          data: {
              kind: 'serverhch',
              type: 'edit',
              path: SERV.CONFIGS,
              breadcrumb: 'Hashes/Cracks/Hashlist Settings',
              permission: 'Config'
          },
          canActivate: [CheckPerm]},
        {
          path: 'notifications',  component: FormConfigComponent,
          data: {
              kind: 'servernotif',
              type: 'edit',
              path: SERV.CONFIGS,
              breadcrumb: 'Notifications',
              permission: 'Notif'
          },
          canActivate: [CheckPerm]},
        {
          path: 'general-settings',  component: FormConfigComponent,
          data: {
              kind: 'servergs',
              type: 'edit',
              path: SERV.CONFIGS,
              breadcrumb: 'General Settings',
              permission: 'Config'
          },
          canActivate: [CheckPerm]},
        {
          path: 'hashtypes',  component: HashtypesComponent,
          data: {
              kind: 'hashtypes',
              breadcrumb: 'Hashtypes',
              permission: 'Hashtype'
          },
          canActivate: [CheckPerm]},
        {
          path: 'hashtypes/new',  component: FormComponent,
          data: {
              kind: 'newhashtype',
              type: 'create',
              path: SERV.HASHTYPES,
              breadcrumb: 'New Hashtype',
              permission: 'Hashtype'
          },
          canActivate: [CheckPerm]},
        {
          path: 'hashtypes/:id/edit',  component: FormComponent,
          data: {
              kind: 'edithashtype',
              type: 'edit',
              path: SERV.HASHTYPES,
              breadcrumb: 'Edit Hashtype',
              permission: 'Hashtype'
          },
          canActivate: [CheckPerm]},
        {
          path: 'log',  component: LogComponent,
          data: {
              kind: 'log',
              breadcrumb: 'Logs',
              permission: 'Logs'
          },
          canActivate: [CheckPerm]},
        {
          path: 'health-checks',  component: HealthChecksComponent,
          data: {
              kind: 'health-checks',
              breadcrumb: 'Health Checks',
              permission: 'HealthCheck'
          },
          canActivate: [CheckPerm]},
        {
          path: 'health-checks/new',  component: NewHealthChecksComponent,
          data: {
              kind: 'new-health-checks',
              breadcrumb: 'New Health Checks',
              permission: 'HealthCheck'
          },
          canActivate: [CheckPerm]},
        {
          path: 'health-checks/:id/edit',  component: EditHealthChecksComponent,
          data: {
              kind: 'edit-health-checks',
              breadcrumb: 'Edit Health Checks',
              permission: 'HealthCheck'
          },
          canActivate: [CheckPerm]},
        {
          path: 'engine/agent-binaries',  component: AgentBinariesComponent,
          data: {
              kind: 'agent-binaries',
              breadcrumb: 'Engine > Agent-binaries',
              permission: 'AgentBinary'
          },
          canActivate: [CheckPerm]},
        {
          path: 'engine/agent-binaries/new-agent-binary',  component: FormComponent,
          data: {
              kind: 'newagentbinary',
              type: 'create',
              path: SERV.AGENT_BINARY,
              breadcrumb: 'Engine > New Agent binary',
              permission: 'AgentBinary'
          },
          canActivate: [CheckPerm]},
        {
          path: 'engine/agent-binaries/:id/edit',  component: FormComponent,
          data: {
              kind: 'editagentbinary',
              type: 'edit',
              path: SERV.AGENT_BINARY,
              breadcrumb: 'Engine > Edit Agent binary',
              permission: 'AgentBinary'
          },
          canActivate: [CheckPerm]},
        {
          path: 'engine/crackers',  component: CrackersComponent,
          data: {
              kind: 'crackers',
              breadcrumb: 'Engine > Crackers',
              permission: 'CrackerBinary'
          },
          canActivate: [CheckPerm]},
        {
          path: 'engine/crackers/new',  component: FormComponent,
          data: {
              kind: 'newcracker',
              type: 'create',
              path: SERV.CRACKERS_TYPES,
              breadcrumb: 'Engine > New Cracker',
              permission: 'CrackerBinary'
          },
          canActivate: [CheckPerm]},
        {
          path: 'engine/crackers/:id/new',  component: FormComponent,
          data: {
              kind: 'newcrackerversion',
              type: 'create',
              path: SERV.CRACKERS,
              breadcrumb: 'Engine > New Cracker Version/Binary',
              permission: 'CrackerBinary'
          },
          canActivate: [CheckPerm]},
        {
          path: 'engine/crackers/:id/edit',  component: FormComponent,
          data: {
              kind: 'editcrackerversion',
              type: 'edit',
              path: SERV.CRACKERS,
              breadcrumb: 'Engine > Edit Cracker Version/Binary',
              permission: 'CrackerBinaryType'
          },
          canActivate: [CheckPerm]},
        {
          path: 'engine/preprocessors',  component: PreprocessorsComponent,
          data: {
              kind: 'preprocessors',
              breadcrumb: 'Engine > Preprocessors',
              permission: 'Prepro'
          },
          canActivate: [CheckPerm]},
        {
          path: 'engine/preprocessors/new-preprocessor',  component: FormComponent,
          data: {
              kind: 'newpreprocessor',
              type: 'create',
              path: SERV.PREPROCESSORS,
              breadcrumb: 'Engine > New Preprocessor',
              permission: 'Prepro'
          },
          canActivate: [CheckPerm]},
        {
          path: 'engine/preprocessors/:id/edit',  component: FormComponent,
          data: {
              kind: 'editpreprocessor',
              type: 'edit',
              path: SERV.PREPROCESSORS,
              breadcrumb: 'Engine > Edit Preprocessor',
              permission: 'Prepro'
          },
          canActivate: [CheckPerm]},
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class ConfigRoutingModule {}
