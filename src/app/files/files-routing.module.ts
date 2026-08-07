import { zFileResponse } from '@generated/api/zod';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';
import { FilesRouteKind, FormRouteKind, FormRouteType, NewFilesRouteKind } from '@models/routes.schema';

import { SERV } from '@services/main.config';
import { FileRoleService } from '@services/roles/file-role.service';

import { FormComponent } from '@components/forms/simple-forms/form.component';

import { IsAuth } from '@src/app/core/_guards/auth.guard';
import { CheckRole } from '@src/app/core/_guards/permission.guard';
import { FilesComponent } from '@src/app/files/files.component';
import { NewFilesComponent } from '@src/app/files/new-files/new-files.component';

const roleServiceClass = FileRoleService;

const routes: MyRoute[] = [
  {
    path: '',
    canActivate: [IsAuth],
    children: [
      {
        path: 'wordlist',
        component: FilesComponent,
        data: {
          kind: FilesRouteKind.Wordlist,
          roleServiceClass: roleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'wordlist/new-wordlist',
        component: NewFilesComponent,
        data: {
          kind: NewFilesRouteKind.NewWordlist,
          roleServiceClass: roleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: ':id/wordlist-edit',
        component: FormComponent,
        data: {
          kind: FormRouteKind.EditWordlist,
          type: FormRouteType.Edit,
          serviceConfig: SERV.FILES,
          responseSchema: zFileResponse,
          roleServiceClass: roleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'rules',
        component: FilesComponent,
        data: {
          kind: FilesRouteKind.Rules,
          roleServiceClass: roleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'rules/new-rule',
        component: NewFilesComponent,
        data: {
          kind: NewFilesRouteKind.NewRule,
          roleServiceClass: roleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: ':id/rules-edit',
        component: FormComponent,
        data: {
          kind: FormRouteKind.EditRule,
          type: FormRouteType.Edit,
          serviceConfig: SERV.FILES,
          responseSchema: zFileResponse,
          roleServiceClass: roleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'other',
        component: FilesComponent,
        data: {
          kind: FilesRouteKind.Other,
          roleServiceClass: roleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'other/new-other',
        component: NewFilesComponent,
        data: {
          kind: NewFilesRouteKind.NewOther,
          roleServiceClass: roleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: ':id/other-edit',
        component: FormComponent,
        data: {
          kind: FormRouteKind.EditOther,
          type: FormRouteType.Edit,
          serviceConfig: SERV.FILES,
          responseSchema: zFileResponse,
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
export class FilesRoutingModule {}
