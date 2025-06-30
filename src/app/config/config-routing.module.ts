import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';

import { SERV } from '@services/main.config';

import { FormComponent } from '@components/forms/simple-forms/form.component';
import { FormConfigComponent } from '@components/forms/simple-forms/formconfig.component';

import { AgentBinariesComponent } from '@src/app/config/engine/agent-binaries/agent-binaries.component';
import { CrackersComponent } from '@src/app/config/engine/crackers/crackers.component';
import { NewCrackerComponent } from '@src/app/config/engine/crackers/new-cracker/new-cracker.component';
import { PreprocessorsComponent } from '@src/app/config/engine/preprocessors/preprocessors.component';
import { HashtypesComponent } from '@src/app/config/hashtypes/hashtypes.component';
import { HealthChecksComponent } from '@src/app/config/health-checks/health-checks.component';
import { NewHealthChecksComponent } from '@src/app/config/health-checks/new-health-check/new-health-checks.component';
import { ViewHealthChecksComponent } from '@src/app/config/health-checks/view-health-check/view-health-checks.component';
import { LogComponent } from '@src/app/config/log/log.component';
import { Perm } from '@src/app/core/_constants/userpermissions.config';
import { IsAuth } from '@src/app/core/_guards/auth.guard';
import { CheckPerm } from '@src/app/core/_guards/permission.guard';

const routes: MyRoute[] = [
  {
    path: '',
    canActivate: [IsAuth],
    children: [
      {
        path: 'agent',
        component: FormConfigComponent,
        data: {
          kind: 'serveragent',
          type: 'edit',
          serviceConfig: SERV.CONFIGS,
          breadcrumb: 'Agent Settings',
          permission: Perm.Config.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'task-chunk',
        component: FormConfigComponent,
        data: {
          kind: 'servertaskchunk',
          type: 'edit',
          serviceConfig: SERV.CONFIGS,
          breadcrumb: 'Task Chunk Settings',
          permission: Perm.Config.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'hch',
        component: FormConfigComponent,
        data: {
          kind: 'serverhch',
          type: 'edit',
          serviceConfig: SERV.CONFIGS,
          breadcrumb: 'Hashes/Cracks/Hashlist Settings',
          permission: Perm.Config.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'notifications',
        component: FormConfigComponent,
        data: {
          kind: 'servernotif',
          type: 'edit',
          serviceConfig: SERV.CONFIGS,
          breadcrumb: 'Notifications',
          permission: Perm.Notif.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'general-settings',
        component: FormConfigComponent,
        data: {
          kind: 'servergs',
          type: 'edit',
          serviceConfig: SERV.CONFIGS,
          breadcrumb: 'General Settings',
          permission: Perm.Config.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'hashtypes',
        component: HashtypesComponent,
        data: {
          kind: 'hashtypes',
          breadcrumb: 'Hashtypes',
          permission: Perm.Hashtype.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'hashtypes/new',
        component: FormComponent,
        data: {
          kind: 'newhashtype',
          type: 'create',
          serviceConfig: SERV.HASHTYPES,
          breadcrumb: 'New Hashtype',
          permission: Perm.Hashtype.CREATE
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'hashtypes/:id/edit',
        component: FormComponent,
        data: {
          kind: 'edithashtype',
          type: 'edit',
          serviceConfig: SERV.HASHTYPES,
          breadcrumb: 'Edit Hashtype',
          permission: Perm.Hashtype.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'log',
        component: LogComponent,
        data: {
          kind: 'log',
          breadcrumb: 'Logs',
          permission: Perm.Logs.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'health-checks',
        component: HealthChecksComponent,
        data: {
          kind: 'health-checks',
          breadcrumb: 'Health Checks',
          permission: Perm.HealthCheck.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'health-checks/new',
        component: NewHealthChecksComponent,
        data: {
          kind: 'new-health-checks',
          breadcrumb: 'New Health Checks',
          permission: Perm.HealthCheck.CREATE
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'health-checks/:id',
        component: ViewHealthChecksComponent,
        data: {
          kind: 'view-health-checks',
          breadcrumb: 'View Health Checks',
          permission: Perm.HealthCheck.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'engine/agent-binaries',
        component: AgentBinariesComponent,
        data: {
          kind: 'agent-binaries',
          breadcrumb: 'Engine > Agent-binaries',
          permission: Perm.AgentBinary.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'engine/agent-binaries/new-agent-binary',
        component: FormComponent,
        data: {
          kind: 'newagentbinary',
          type: 'create',
          serviceConfig: SERV.AGENT_BINARY,
          breadcrumb: 'Engine > New Agent binary',
          permission: Perm.HealthCheck.CREATE
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'engine/agent-binaries/:id/edit',
        component: FormComponent,
        data: {
          kind: 'editagentbinary',
          type: 'edit',
          serviceConfig: SERV.AGENT_BINARY,
          breadcrumb: 'Engine > Edit Agent binary',
          permission: Perm.AgentBinary.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'engine/crackers',
        component: CrackersComponent,
        data: {
          kind: 'crackers',
          breadcrumb: 'Engine > Crackers',
          permission: Perm.CrackerBinary.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'engine/crackers/new',
        component: NewCrackerComponent,
        data: {
          kind: 'newcracker',
          type: 'create',
          serviceConfig: SERV.CRACKERS_TYPES,
          breadcrumb: 'Engine > New Cracker',
          permission: Perm.CrackerBinary.CREATE
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'engine/crackers/:id/new',
        component: FormComponent,
        data: {
          kind: 'newcrackerversion',
          type: 'create',
          serviceConfig: SERV.CRACKERS,
          breadcrumb: 'Engine > New Cracker Version/Binary',
          permission: Perm.CrackerBinaryType.CREATE
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'engine/crackers/:id/edit',
        component: FormComponent,
        data: {
          kind: 'editcrackerversion',
          type: 'edit',
          serviceConfig: SERV.CRACKERS,
          breadcrumb: 'Engine > Edit Cracker Version/Binary',
          permission: Perm.CrackerBinaryType.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'engine/preprocessors',
        component: PreprocessorsComponent,
        data: {
          kind: 'preprocessors',
          breadcrumb: 'Engine > Preprocessors',
          permission: Perm.Prepro.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'engine/preprocessors/new-preprocessor',
        component: FormComponent,
        data: {
          kind: 'newpreprocessor',
          type: 'create',
          serviceConfig: SERV.PREPROCESSORS,
          breadcrumb: 'Engine > New Preprocessor',
          permission: Perm.Prepro.CREATE
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'engine/preprocessors/:id/edit',
        component: FormComponent,
        data: {
          kind: 'editpreprocessor',
          type: 'edit',
          serviceConfig: SERV.PREPROCESSORS,
          breadcrumb: 'Engine > Edit Preprocessor',
          permission: Perm.Prepro.READ
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
export class ConfigRoutingModule {}
