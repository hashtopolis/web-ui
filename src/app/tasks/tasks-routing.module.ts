import { CheckPerm } from '../core/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { IsAuth } from '../core/_guards/auth.guard';
import { NgModule } from '@angular/core';

import { EditPreconfiguredTasksComponent } from './edit-preconfigured-tasks/edit-preconfigured-tasks.component';
import { NewPreconfiguredTasksComponent } from './new-preconfigured-tasks/new-preconfigured-tasks.component';
import { PreconfiguredTasksComponent } from './preconfigured-tasks/preconfigured-tasks.component';
import { EditSupertasksComponent } from './edit-supertasks/edit-supertasks.component';
import { NewSupertasksComponent } from '../core/_components/forms/custom-forms/task/new-supertasks/new-supertasks.component';
import { ApplyHashlistComponent } from './supertasks/applyhashlist.component';
import { WrbulkComponent } from './import-supertasks/wrbulk/wrbulk.component';
import { PendingChangesGuard } from '../core/_guards/pendingchanges.guard';
import { MasksComponent } from './import-supertasks/masks/masks.component';
import { SupertasksComponent } from './supertasks/supertasks.component';
import { ShowTasksComponent } from './show-tasks/show-tasks.component';
import { EditTasksComponent } from './edit-tasks/edit-tasks.component';
import { NewTasksComponent } from './new-tasks/new-tasks.component';
import { MyRoute, RouteData } from '../core/_models/routes.model';
import { ChunksComponent } from './chunks/chunks.component';

const routes: MyRoute[] = [
  {
    path: '',
    canActivate: [IsAuth],
    children: [
      {
        path: 'show-tasks',
        component: ShowTasksComponent,
        data: {
          kind: 'show-tasks',
          breadcrumb: 'Show tasks',
          permission: 'Task'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'show-tasks-archived',
        component: ShowTasksComponent,
        data: {
          kind: 'show-tasks-archived',
          breadcrumb: 'Show Archived Tasks',
          permission: 'Task'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'show-tasks/:id/edit',
        component: EditTasksComponent,
        data: {
          kind: 'edit-task',
          breadcrumb: 'Edit Task',
          permission: 'Task'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'show-tasks/:id/edit/show-all-chunks',
        component: EditTasksComponent,
        data: {
          kind: 'edit-task-cAll',
          breadcrumb: 'Edit Task > Show All chunks',
          permission: 'Task'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'new-task',
        component: NewTasksComponent,
        data: {
          kind: 'new-task',
          breadcrumb: 'New task',
          permission: 'Task'
        },
        canActivate: [CheckPerm],
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'new-tasks/:id/copy',
        component: NewTasksComponent,
        data: {
          kind: 'copy-task',
          breadcrumb: 'Copy Task',
          permission: 'Task'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'new-tasks/:id/copypretask',
        component: NewTasksComponent,
        data: {
          kind: 'copy-pretask',
          breadcrumb: 'Copy Task',
          permission: 'Task'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'preconfigured-tasks',
        component: PreconfiguredTasksComponent,
        data: {
          kind: 'preconfigured-tasks',
          breadcrumb: 'Preconfigured tasks',
          permission: 'Pretask'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'new-preconfigured-tasks',
        component: NewPreconfiguredTasksComponent,
        data: {
          kind: 'new-preconfigured-tasks',
          breadcrumb: 'New Preconfigured tasks',
          permission: 'Pretask'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'preconfigured-tasks/:id/edit',
        component: EditPreconfiguredTasksComponent,
        data: {
          kind: 'edit-preconfigured-tasks',
          breadcrumb: 'Edit Preconfigured tasks',
          permission: 'Pretask'
        },
        canActivate: [CheckPerm],
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'preconfigured-tasks/:id/copy',
        component: NewPreconfiguredTasksComponent,
        data: {
          kind: 'copy-preconfigured-tasks',
          breadcrumb: 'Copy Preconfigured tasks',
          permission: 'Pretask'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'preconfigured-tasks/:id/copytask',
        component: NewPreconfiguredTasksComponent,
        data: {
          kind: 'copy-tasks',
          breadcrumb: 'Copy Task to Preconfigured task',
          permission: 'Pretask'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'supertasks',
        component: SupertasksComponent,
        data: {
          kind: 'supertasks',
          breadcrumb: 'Supertasks',
          permission: 'SuperTask'
        },
        canActivate: [CheckPerm]
      },
      {
        path: ':id/applyhashlist',
        component: ApplyHashlistComponent,
        data: {
          kind: 'applyhashlist',
          breadcrumb: 'Apply hashlist',
          permission: 'SuperTask'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'new-supertasks',
        component: NewSupertasksComponent,
        data: {
          kind: 'new-supertasks',
          breadcrumb: 'New Supertasks',
          permission: 'SuperTask'
        },
        canActivate: [CheckPerm]
      },
      {
        path: ':id/edit',
        component: EditSupertasksComponent,
        data: {
          kind: 'edit-supertasks',
          breadcrumb: 'Edit Supertasks',
          permission: 'SuperTask'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'import-supertasks/masks',
        component: MasksComponent,
        data: {
          kind: 'masks',
          breadcrumb: 'Import Masks',
          permission: 'SuperTask'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'import-supertasks/wrbulk',
        component: WrbulkComponent,
        data: {
          kind: 'wrbulk',
          breadcrumb: 'Import Wordlist/Rules Bulk',
          permission: 'SuperTask'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'chunks',
        component: ChunksComponent,
        data: {
          kind: 'chunks',
          breadcrumb: 'Chunks',
          permission: 'Chunk'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'chunks/:id/view',
        component: ChunksComponent,
        data: {
          kind: 'chunks-view',
          breadcrumb: 'Chunks > View Chunk',
          permission: 'Chunk'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'chunks/show-all-chunks',
        component: ChunksComponent,
        data: {
          kind: 'chunks-cAll',
          breadcrumb: 'Chunks > Show All chunks',
          permission: 'Chunk'
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
export class TasksRoutingModule {}
