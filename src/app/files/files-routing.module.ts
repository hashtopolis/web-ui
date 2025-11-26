import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';

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
          kind: 'wordlist',
          breadcrumb: 'Wordlist',
          roleServiceClass: roleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'wordlist/new-wordlist',
        component: NewFilesComponent,
        data: {
          kind: 'wordlist-new',
          breadcrumb: 'Wordlist New',
          roleServiceClass: roleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: ':id/wordlist-edit',
        component: FormComponent,
        data: {
          kind: 'editwordlist',
          type: 'edit',
          serviceConfig: SERV.FILES,
          breadcrumb: 'Wordlist Edit',
          roleServiceClass: roleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'rules',
        component: FilesComponent,
        data: {
          kind: 'rules',
          breadcrumb: 'Rules',
          roleServiceClass: roleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'rules/new-rule',
        component: NewFilesComponent,
        data: {
          kind: 'rule-new',
          breadcrumb: 'Rule New',
          roleServiceClass: roleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: ':id/rules-edit',
        component: FormComponent,
        data: {
          kind: 'editrule',
          type: 'edit',
          serviceConfig: SERV.FILES,
          breadcrumb: 'Rules Edit',
          roleServiceClass: roleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'other',
        component: FilesComponent,
        data: {
          kind: 'other',
          breadcrumb: 'Other',
          roleServiceClass: roleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'other/new-other',
        component: NewFilesComponent,
        data: {
          kind: 'other-new',
          breadcrumb: 'Other New',
          roleServiceClass: roleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: ':id/other-edit',
        component: FormComponent,
        data: {
          kind: 'editother',
          type: 'edit',
          serviceConfig: SERV.FILES,
          breadcrumb: 'Other Edit',
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
