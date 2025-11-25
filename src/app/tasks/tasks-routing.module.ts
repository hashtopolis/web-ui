import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';

import { PreconfiguredTasksRoleService } from '@services/roles/tasks/preconfiguredTasks-role.service';
import { SupertasksRoleService } from '@services/roles/tasks/supertasks-role.service';
import { TasksRoleService } from '@services/roles/tasks/tasks-role.service';

import { NewSupertasksComponent } from '@components/forms/custom-forms/task/new-supertasks/new-supertasks.component';

import { IsAuth } from '@src/app/core/_guards/auth.guard';
import { PendingChangesGuard } from '@src/app/core/_guards/pendingchanges.guard';
import { CheckRole } from '@src/app/core/_guards/permission.guard';
import { ChunksComponent } from '@src/app/tasks/chunks/chunks.component';
import { EditPreconfiguredTasksComponent } from '@src/app/tasks/edit-preconfigured-tasks/edit-preconfigured-tasks.component';
import { EditSupertasksComponent } from '@src/app/tasks/edit-supertasks/edit-supertasks.component';
import { EditTasksComponent } from '@src/app/tasks/edit-tasks/edit-tasks.component';
import { MasksComponent } from '@src/app/tasks/import-supertasks/masks/masks.component';
import { WrbulkComponent } from '@src/app/tasks/import-supertasks/wrbulk/wrbulk.component';
import { NewPreconfiguredTasksComponent } from '@src/app/tasks/new-preconfigured-tasks/new-preconfigured-tasks.component';
import { NewTasksComponent } from '@src/app/tasks/new-tasks/new-tasks.component';
import { PreconfiguredTasksComponent } from '@src/app/tasks/preconfigured-tasks/preconfigured-tasks.component';
import { ShowTasksComponent } from '@src/app/tasks/show-tasks/show-tasks.component';
import { ApplyHashlistComponent } from '@src/app/tasks/supertasks/applyhashlist.component';
import { SupertasksComponent } from '@src/app/tasks/supertasks/supertasks.component';

const taskRoleServiceClass = TasksRoleService;
const supertaskRoleServiceClass = SupertasksRoleService;
const pretaskRoleServiceClass = PreconfiguredTasksRoleService;

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
          roleServiceClass: taskRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'show-tasks-archived',
        component: ShowTasksComponent,
        data: {
          kind: 'show-tasks-archived',
          breadcrumb: 'Show Archived Tasks',
          roleServiceClass: taskRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'show-tasks/:id/edit',
        component: EditTasksComponent,
        data: {
          kind: 'edit-task',
          breadcrumb: 'Edit Task',
          roleServiceClass: taskRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'show-tasks/:id/edit/show-all-chunks',
        component: EditTasksComponent,
        data: {
          kind: 'edit-task-cAll',
          breadcrumb: 'Edit Task > Show All chunks',
          roleServiceClass: taskRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'new-task',
        component: NewTasksComponent,
        data: {
          kind: 'new-task',
          breadcrumb: 'New task',
          roleServiceClass: taskRoleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole],
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'new-tasks/:id/copy',
        component: NewTasksComponent,
        data: {
          kind: 'copy-task',
          breadcrumb: 'Copy Task',
          roleServiceClass: taskRoleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'new-tasks/:id/copypretask',
        component: NewTasksComponent,
        data: {
          kind: 'copy-pretask',
          breadcrumb: 'Copy Task',
          roleServiceClass: taskRoleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'preconfigured-tasks',
        component: PreconfiguredTasksComponent,
        data: {
          kind: 'preconfigured-tasks',
          breadcrumb: 'Preconfigured tasks',
          roleServiceClass: pretaskRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'new-preconfigured-tasks',
        component: NewPreconfiguredTasksComponent,
        data: {
          kind: 'new-preconfigured-tasks',
          breadcrumb: 'New Preconfigured tasks',
          roleServiceClass: pretaskRoleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'preconfigured-tasks/:id/edit',
        component: EditPreconfiguredTasksComponent,
        data: {
          kind: 'edit-preconfigured-tasks',
          breadcrumb: 'Edit Preconfigured tasks',
          roleServiceClass: pretaskRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole],
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'preconfigured-tasks/:id/copy',
        component: NewPreconfiguredTasksComponent,
        data: {
          kind: 'copy-preconfigured-tasks',
          breadcrumb: 'Copy Preconfigured tasks',
          roleServiceClass: pretaskRoleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'preconfigured-tasks/:id/copytask',
        component: NewPreconfiguredTasksComponent,
        data: {
          kind: 'copy-tasks',
          breadcrumb: 'Copy Task to Preconfigured task',
          roleServiceClass: pretaskRoleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'supertasks',
        component: SupertasksComponent,
        data: {
          kind: 'supertasks',
          breadcrumb: 'Supertasks',
          roleServiceClass: supertaskRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: ':id/applyhashlist',
        component: ApplyHashlistComponent,
        data: {
          kind: 'applyhashlist',
          breadcrumb: 'Apply hashlist',
          roleServiceClass: taskRoleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'new-supertasks',
        component: NewSupertasksComponent,
        data: {
          kind: 'new-supertasks',
          breadcrumb: 'New Supertasks',
          roleServiceClass: supertaskRoleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: ':id/edit',
        component: EditSupertasksComponent,
        data: {
          kind: 'edit-supertasks',
          breadcrumb: 'Edit Supertasks',
          roleServiceClass: supertaskRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'import-supertasks/masks',
        component: MasksComponent,
        data: {
          kind: 'masks',
          breadcrumb: 'Import Masks',
          roleServiceClass: supertaskRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'import-supertasks/wrbulk',
        component: WrbulkComponent,
        data: {
          kind: 'wrbulk',
          breadcrumb: 'Import Wordlist/Rules Bulk',
          roleServiceClass: supertaskRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'chunks',
        component: ChunksComponent,
        data: {
          kind: 'chunks',
          breadcrumb: 'Chunks',
          roleServiceClass: taskRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'chunks/:id/view',
        component: ChunksComponent,
        data: {
          kind: 'chunks-view',
          breadcrumb: 'Chunks > View Chunk',
          roleServiceClass: taskRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'chunks/show-all-chunks',
        component: ChunksComponent,
        data: {
          kind: 'chunks-cAll',
          breadcrumb: 'Chunks > Show All chunks',
          roleServiceClass: taskRoleServiceClass,
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
export class TasksRoutingModule {}
