import { IsAuth } from "../core/_guards/auth.guard";
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";

import { EditPreconfiguredTasksComponent } from "./edit-preconfigured-tasks/edit-preconfigured-tasks.component";
import { NewPreconfiguredTasksComponent } from "./new-preconfigured-tasks/new-preconfigured-tasks.component";
import { PreconfiguredTasksComponent } from "./preconfigured-tasks/preconfigured-tasks.component";
import { EditSupertasksComponent } from "./edit-supertasks/edit-supertasks.component";
import { NewSupertasksComponent } from "./new-supertasks/new-supertasks.component";
import { PendingChangesGuard } from "../core/_guards/pendingchanges.guard";
import { SupertasksComponent } from "./supertasks/supertasks.component";
import { ShowTasksComponent } from "./show-tasks/show-tasks.component";
import { EditTasksComponent } from "./edit-tasks/edit-tasks.component";
import { NewTasksComponent } from "./new-tasks/new-tasks.component";
import { SuperTaskGuard } from "../core/_guards/supertask.guard";
import { PreTaskGuard } from "../core/_guards/pretask.guard";
import { ChunksComponent } from "./chunks/chunks.component";
import { TaskGuard } from "../core/_guards/task.guard";
import { MasksComponent } from "./import-supertasks/masks/masks.component";
import { WrbulkComponent } from "./import-supertasks/wrbulk/wrbulk.component";

const routes: Routes = [
  {
    path: '',
    children: [
        {
          path: 'show-tasks', component: ShowTasksComponent,
          data: {
              kind: 'show-tasks',
              breadcrumb: 'Show tasks'
          },
          canActivate: [IsAuth,TaskGuard]},
        {
          path: 'show-tasks-archived', component: ShowTasksComponent,
          data: {
              kind: 'show-tasks-archived',
              breadcrumb: 'Show Archived Tasks'
          },
          canActivate: [IsAuth,TaskGuard]},
        {
          path: 'show-tasks/:id/edit', component: EditTasksComponent,
          data: {
              kind: 'edit-task',
              breadcrumb: 'Edit Task'
          },
          canActivate: [IsAuth,TaskGuard]},
        {
          path: 'show-tasks/:id/edit/show-100-chunks', component: EditTasksComponent,
          data: {
              kind: 'edit-task-c100',
              breadcrumb: 'Edit Task > Show latest 100 chunks'
          },
          canActivate: [IsAuth,TaskGuard]},
        {
          path: 'show-tasks/:id/edit/show-all-chunks', component: EditTasksComponent,
          data: {
              kind: 'edit-task-cAll',
              breadcrumb: 'Edit Task > Show All chunks'
          },
          canActivate: [IsAuth,TaskGuard]},
        {
          path: 'new-tasks', component: NewTasksComponent,
          data: {
              kind: 'new-tasks',
              breadcrumb: 'New tasks'
          },
          canActivate: [IsAuth,TaskGuard],
          canDeactivate: [PendingChangesGuard]},
        {
          path: 'new-tasks/:id/copy', component: NewTasksComponent,
          data: {
              kind: 'copy-task',
              breadcrumb: 'Copy Task'
          },
          canActivate: [IsAuth,TaskGuard]},
        {
          path: 'new-tasks/:id/copypretask', component: NewTasksComponent,
          data: {
              kind: 'copy-pretask',
              breadcrumb: 'Copy Task'
          },
          canActivate: [IsAuth,TaskGuard]},
        {
          path: 'preconfigured-tasks', component: PreconfiguredTasksComponent,
          data: {
              kind: 'preconfigured-tasks',
              breadcrumb: 'Preconfigured tasks'
          },
          canActivate: [IsAuth,PreTaskGuard]},
        {
          path: 'new-preconfigured-tasks', component: NewPreconfiguredTasksComponent,
          data: {
              kind: 'new-preconfigured-tasks',
              breadcrumb: 'New Preconfigured tasks'
          },
          canActivate: [IsAuth,PreTaskGuard]},
        {
          path: 'preconfigured-tasks/:id/edit', component: EditPreconfiguredTasksComponent,
          data: {
              kind: 'edit-preconfigured-tasks',
              breadcrumb: 'Edit Preconfigured tasks'
          },
          canActivate: [IsAuth,PreTaskGuard],
          canDeactivate: [PendingChangesGuard]},
        {
          path: 'preconfigured-tasks/:id/copy', component: NewPreconfiguredTasksComponent,
          data: {
              kind: 'copy-preconfigured-tasks',
              breadcrumb: 'Copy Preconfigured tasks'
          },
          canActivate: [IsAuth,PreTaskGuard]},
        {
          path: 'preconfigured-tasks/:id/copytask', component: NewPreconfiguredTasksComponent,
          data: {
              kind: 'copy-tasks',
              breadcrumb: 'Copy Task to Preconfigured task'
          },
          canActivate: [IsAuth,PreTaskGuard]},
        {
          path: 'supertasks', component: SupertasksComponent,
          data: {
            kind: 'supertasks',
            breadcrumb: 'Supertasks'
           },
           canActivate: [IsAuth,TaskGuard]},
        {
          path: 'new-supertasks', component: NewSupertasksComponent,
          data: {
            kind: 'new-supertasks',
            breadcrumb: 'New Supertasks'
          },
          canActivate: [IsAuth,TaskGuard]},
        {
          path: ':id/edit', component: EditSupertasksComponent,
          data: {
            kind: 'edit-supertasks',
            breadcrumb: 'Edit Supertasks'
          },
          canActivate: [IsAuth,SuperTaskGuard]},
        {
          path: 'import-supertasks/masks', component: MasksComponent,
          data: {
            kind: 'masks',
            breadcrumb: 'Import Masks'
          },
          canActivate: [IsAuth,SuperTaskGuard]},
        {
          path: 'import-supertasks/wrbulk', component: WrbulkComponent,
          data: {
            kind: 'wrbulk',
            breadcrumb: 'Import Wordlist/Rules Bulk'
          },
          canActivate: [IsAuth,SuperTaskGuard]},
        {
          path: 'chunks', component: ChunksComponent,
          data: {
            kind: 'chunks',
            breadcrumb: 'Chunks'
          },
          canActivate: [IsAuth,TaskGuard]},
        {
          path: 'chunks/:id/view', component: ChunksComponent,
          data: {
              kind: 'chunks-view',
              breadcrumb: 'Chunks > View Chunk'
          },
          canActivate: [IsAuth,TaskGuard]},
        {
          path: 'chunks/show-all-chunks', component: ChunksComponent,
          data: {
              kind: 'chunks-cAll',
              breadcrumb: 'Chunks > Show All chunks'
          },
          canActivate: [IsAuth,TaskGuard]},
        ]
     }
  ]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class TasksRoutingModule {}
