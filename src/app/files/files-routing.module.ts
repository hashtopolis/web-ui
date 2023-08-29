import { CheckPerm } from "../core/_guards/permission.guard";
import { Routes, RouterModule } from '@angular/router';
import { IsAuth } from "../core/_guards/auth.guard";
import { NgModule } from "@angular/core";

import { FilesEditComponent } from "./files-edit/files-edit.component";
import { NewFilesComponent } from "./new-files/new-files.component";
import { FilesComponent } from "./files.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'wordlist',  component: FilesComponent,
        data: {
            kind: 'wordlist',
            breadcrumb: 'Wordlist',
            permission: 'File'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: 'wordlist/new-wordlist',  component: NewFilesComponent,
        data: {
            kind: 'wordlist-new',
            breadcrumb: 'Wordlist New',
            permission: 'File'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: ':id/wordlist-edit',  component: FilesEditComponent,
        data: {
            kind: 'wordlist-edit',
            breadcrumb: 'Wordlist Edit',
            permission: 'File'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: 'rules', component: FilesComponent,
        data: {
            kind: 'rules',
            breadcrumb: 'Rules',
            permission: 'File'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: 'rules/new-rule',  component: NewFilesComponent,
        data: {
            kind: 'rule-new',
            breadcrumb: 'Rule New',
            permission: 'File'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: ':id/rules-edit',  component: FilesEditComponent,
        data: {
            kind: 'rules-edit',
            breadcrumb: 'Rules Edit',
            permission: 'File'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: 'other', component: FilesComponent,
        data: {
            kind: 'other',
            breadcrumb: 'Other',
            permission: 'File'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: 'other/new-other',  component: NewFilesComponent,
        data: {
            kind: 'other-new',
            breadcrumb: 'Other New',
            permission: 'File'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: ':id/other-edit',  component: FilesEditComponent,
        data: {
            kind: 'other-edit',
            breadcrumb: 'Other Edit',
            permission: 'File'
        },
        canActivate: [IsAuth,CheckPerm]},
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class FilesRoutingModule {}
