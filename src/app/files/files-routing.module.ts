import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';

import { SERV } from '@services/main.config';

import { FormComponent } from '@components/forms/simple-forms/form.component';

import { IsAuth } from '@src/app/core/_guards/auth.guard';
import { CheckPerm } from '@src/app/core/_guards/permission.guard';
import { FilesComponent } from '@src/app/files/files.component';
import { NewFilesComponent } from '@src/app/files/new-files/new-files.component';

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
          permission: 'File'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'wordlist/new-wordlist',
        component: NewFilesComponent,
        data: {
          kind: 'wordlist-new',
          breadcrumb: 'Wordlist New',
          permission: 'File'
        },
        canActivate: [CheckPerm]
      },
      {
        path: ':id/wordlist-edit',
        component: FormComponent,
        data: {
          kind: 'editwordlist',
          type: 'edit',
          serviceConfig: SERV.FILES,
          breadcrumb: 'Wordlist Edit',
          permission: 'File'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'rules',
        component: FilesComponent,
        data: {
          kind: 'rules',
          breadcrumb: 'Rules',
          permission: 'File'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'rules/new-rule',
        component: NewFilesComponent,
        data: {
          kind: 'rule-new',
          breadcrumb: 'Rule New',
          permission: 'File'
        },
        canActivate: [CheckPerm]
      },
      {
        path: ':id/rules-edit',
        component: FormComponent,
        data: {
          kind: 'editrule',
          type: 'edit',
          serviceConfig: SERV.FILES,
          breadcrumb: 'Rules Edit',
          permission: 'File'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'other',
        component: FilesComponent,
        data: {
          kind: 'other',
          breadcrumb: 'Other',
          permission: 'File'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'other/new-other',
        component: NewFilesComponent,
        data: {
          kind: 'other-new',
          breadcrumb: 'Other New',
          permission: 'File'
        },
        canActivate: [CheckPerm]
      },
      {
        path: ':id/other-edit',
        component: FormComponent,
        data: {
          kind: 'editother',
          type: 'edit',
          serviceConfig: SERV.FILES,
          breadcrumb: 'Other Edit',
          permission: 'File'
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
export class FilesRoutingModule {}
