import { zAgentBinaryResponse, zCrackerBinaryResponse, zHashTypeResponse } from '@generated/api/zod';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';
import { FormConfigRouteKind, FormRouteKind, FormRouteType } from '@models/routes.schema';

import { SERV } from '@services/main.config';
import { AgentBinaryRoleService } from '@services/roles/binaries/agent-binary-role.service';
import { CrackerBinaryRoleService } from '@services/roles/binaries/cracker-binary-role.service';
import { PreprocessorRoleService } from '@services/roles/binaries/preprocessor-role.service';
import { HashTypesRoleService } from '@services/roles/config/hashtypes-role.service';
import { HealthCheckRoleService } from '@services/roles/config/healthcheck-role.service';
import { LogRoleService } from '@services/roles/config/log-role.service';
import { NotificationsRoleService } from '@services/roles/config/notifications-role.service';
import { SettingsRoleService } from '@services/roles/config/settings-role.service';

import { FormComponent } from '@components/forms/simple-forms/form.component';
import { FormConfigComponent } from '@components/forms/simple-forms/formconfig.component';

import { AgentBinariesComponent } from '@src/app/config/engine/agent-binaries/agent-binaries.component';
import { CrackersComponent } from '@src/app/config/engine/crackers/crackers.component';
import { NewCrackerComponent } from '@src/app/config/engine/crackers/new-cracker/new-cracker.component';
import { NewEditPreprocessorComponent } from '@src/app/config/engine/preprocessors/new_edit-preprocessor/new_edit-preprocessor.component';
import { PreprocessorsComponent } from '@src/app/config/engine/preprocessors/preprocessors.component';
import { HashtypesComponent } from '@src/app/config/hashtypes/hashtypes.component';
import { HealthChecksComponent } from '@src/app/config/health-checks/health-checks.component';
import { NewHealthChecksComponent } from '@src/app/config/health-checks/new-health-check/new-health-checks.component';
import { ViewHealthChecksComponent } from '@src/app/config/health-checks/view-health-check/view-health-checks.component';
import { LogComponent } from '@src/app/config/log/log.component';
import { IsAuth } from '@src/app/core/_guards/auth.guard';
import { CheckRole } from '@src/app/core/_guards/permission.guard';

const routes: MyRoute[] = [
  {
    path: '',
    canActivate: [IsAuth],
    children: [
      {
        path: 'agent',
        component: FormConfigComponent,
        data: {
          kind: FormConfigRouteKind.ServerAgent,
          type: FormRouteType.Edit,
          serviceConfig: SERV.CONFIGS,
          roleServiceClass: SettingsRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'task-chunk',
        component: FormConfigComponent,
        data: {
          kind: FormConfigRouteKind.ServerTaskChunk,
          type: FormRouteType.Edit,
          serviceConfig: SERV.CONFIGS,
          roleServiceClass: SettingsRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'hch',
        component: FormConfigComponent,
        data: {
          kind: FormConfigRouteKind.ServerHealthChecks,
          type: FormRouteType.Edit,
          serviceConfig: SERV.CONFIGS,
          roleServiceClass: SettingsRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'notifications',
        component: FormConfigComponent,
        data: {
          kind: FormConfigRouteKind.ServerNotifications,
          type: FormRouteType.Edit,
          serviceConfig: SERV.CONFIGS,
          roleServiceClass: NotificationsRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'general-settings',
        component: FormConfigComponent,
        data: {
          kind: FormConfigRouteKind.ServerGeneralSettings,
          type: FormRouteType.Edit,
          serviceConfig: SERV.CONFIGS,
          roleServiceClass: SettingsRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'server-actions',
        component: FormConfigComponent,
        data: {
          kind: FormConfigRouteKind.ServerActions,
          type: FormRouteType.Edit,
          serviceConfig: SERV.CONFIGS,
          roleServiceClass: SettingsRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'hashtypes',
        component: HashtypesComponent,
        data: {
          roleServiceClass: HashTypesRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'hashtypes/new',
        component: FormComponent,
        data: {
          kind: FormRouteKind.NewHashtype,
          type: FormRouteType.Create,
          serviceConfig: SERV.HASHTYPES,
          roleServiceClass: HashTypesRoleService,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'hashtypes/:id/edit',
        component: FormComponent,
        data: {
          kind: FormRouteKind.EditHashtype,
          type: FormRouteType.Edit,
          serviceConfig: SERV.HASHTYPES,
          responseSchema: zHashTypeResponse,
          roleServiceClass: HashTypesRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'log',
        component: LogComponent,
        data: {
          roleServiceClass: LogRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'health-checks',
        component: HealthChecksComponent,
        data: {
          roleServiceClass: HealthCheckRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'health-checks/new',
        component: NewHealthChecksComponent,
        data: {
          roleServiceClass: HealthCheckRoleService,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'health-checks/:id',
        component: ViewHealthChecksComponent,
        data: {
          roleServiceClass: HealthCheckRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'engine/agent-binaries',
        component: AgentBinariesComponent,
        data: {
          roleServiceClass: AgentBinaryRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'engine/agent-binaries/new-agent-binary',
        component: FormComponent,
        data: {
          kind: FormRouteKind.NewAgentBinary,
          type: FormRouteType.Create,
          serviceConfig: SERV.AGENT_BINARY,
          roleServiceClass: AgentBinaryRoleService,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'engine/agent-binaries/:id/edit',
        component: FormComponent,
        data: {
          kind: FormRouteKind.EditAgentBinary,
          type: FormRouteType.Edit,
          serviceConfig: SERV.AGENT_BINARY,
          responseSchema: zAgentBinaryResponse,
          roleServiceClass: AgentBinaryRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'engine/crackers',
        component: CrackersComponent,
        data: {
          roleServiceClass: CrackerBinaryRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'engine/crackers/new',
        component: NewCrackerComponent,
        data: {
          roleServiceClass: CrackerBinaryRoleService,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'engine/crackers/:id/new',
        component: FormComponent,
        data: {
          kind: FormRouteKind.NewCrackerVersion,
          type: FormRouteType.Create,
          serviceConfig: SERV.CRACKERS,
          roleServiceClass: CrackerBinaryRoleService,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'engine/crackers/:id/edit',
        component: FormComponent,
        data: {
          kind: FormRouteKind.EditCrackerVersion,
          type: FormRouteType.Edit,
          serviceConfig: SERV.CRACKERS,
          responseSchema: zCrackerBinaryResponse,
          roleServiceClass: CrackerBinaryRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'engine/preprocessors',
        component: PreprocessorsComponent,
        data: {
          roleServiceClass: PreprocessorRoleService,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'engine/preprocessors/new-preprocessor',
        component: NewEditPreprocessorComponent,
        data: {
          roleServiceClass: PreprocessorRoleService,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'engine/preprocessors/:id/edit',
        component: NewEditPreprocessorComponent,
        data: {
          roleServiceClass: PreprocessorRoleService,
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
export class ConfigRoutingModule {}
