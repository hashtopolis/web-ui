import { AuthGuard } from "../core/_guards/auth.guard";
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";

import { FilesEditComponent } from "./files-edit/files-edit.component";
import { NewFilesComponent } from "./new-files/new-files.component";
import { FilesGuard } from "../core/_guards/file.guard";
import { FilesComponent } from "./files.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'wordlist',  component: FilesComponent,
        data: {
            kind: 'wordlist',
            breadcrumb: 'Wordlist'
        },
        canActivate: [AuthGuard,FilesGuard]},
      {
        path: 'wordlist/new-wordlist',  component: NewFilesComponent,
        data: {
            kind: 'wordlist-new',
            breadcrumb: 'Wordlist New'
        },
        canActivate: [AuthGuard,FilesGuard]},
      {
        path: ':id/wordlist-edit',  component: FilesEditComponent,
        data: {
            kind: 'wordlist-edit',
            breadcrumb: 'Wordlist Edit'
        },
        canActivate: [AuthGuard,FilesGuard]},
      {
        path: 'rules', component: FilesComponent,
        data: {
            kind: 'rules',
            breadcrumb: 'Rules'
        },
        canActivate: [AuthGuard,FilesGuard]},
      {
        path: 'rules/new-rule',  component: NewFilesComponent,
        data: {
            kind: 'rule-new',
            breadcrumb: 'Rule New'
        },
        canActivate: [AuthGuard,FilesGuard]},
      {
        path: ':id/rules-edit',  component: FilesEditComponent,
        data: {
            kind: 'rules-edit',
            breadcrumb: 'Rules Edit'
        },
        canActivate: [AuthGuard,FilesGuard]},
      {
        path: 'other', component: FilesComponent,
        data: {
            kind: 'other',
            breadcrumb: 'Other'
        },
        canActivate: [AuthGuard,FilesGuard]},
      {
        path: 'other/new-other',  component: NewFilesComponent,
        data: {
            kind: 'other-new',
            breadcrumb: 'Other New'
        },
        canActivate: [AuthGuard,FilesGuard]},
      {
        path: ':id/other-edit',  component: FilesEditComponent,
        data: {
            kind: 'other-edit',
            breadcrumb: 'Other Edit'
        },
        canActivate: [AuthGuard,FilesGuard]},
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class FilesRoutingModule {}
