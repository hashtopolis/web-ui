import { CheckPerm } from '../core/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { IsAuth } from '../core/_guards/auth.guard';
import { NgModule } from '@angular/core';
import { FormComponent } from '../core/_components/forms/simple-forms/form.component';
import { NewFilesComponent } from './new-files/new-files.component';
import { MyRoute, RouteData } from '../core/_models/routes.model';
import { SERV } from '../core/_services/main.config';
import { FilesComponent } from './files.component';

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
          path: SERV.FILES,
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
          path: SERV.FILES,
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
          path: SERV.FILES,
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
