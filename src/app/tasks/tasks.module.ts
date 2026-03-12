import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { RouterModule } from '@angular/router';

import { CoreComponentsModule } from '@components/core-components.module';
import { NewSupertasksComponent } from '@components/forms/custom-forms/task/new-supertasks/new-supertasks.component';

import { ComponentsModule } from '@src/app/shared/components.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';
import { TaskSpeedGraphComponent } from '@src/app/shared/graphs/echarts/task-speed-graph/task-speed-graph.component';
import { PipesModule } from '@src/app/shared/pipes.module';
import { ChunksComponent } from '@src/app/tasks/chunks/chunks.component';
import { EditPreconfiguredTasksComponent } from '@src/app/tasks/edit-preconfigured-tasks/edit-preconfigured-tasks.component';
import { EditSupertasksComponent } from '@src/app/tasks/edit-supertasks/edit-supertasks.component';
import { EditTasksComponent } from '@src/app/tasks/edit-tasks/edit-tasks.component';
import { MasksComponent } from '@src/app/tasks/import-supertasks/masks/masks.component';
import { WrbulkComponent } from '@src/app/tasks/import-supertasks/wrbulk/wrbulk.component';
import { NewPreconfiguredTasksComponent } from '@src/app/tasks/new-preconfigured-tasks/new-preconfigured-tasks.component';
import { NewTasksComponent } from '@src/app/tasks/new-tasks/new-tasks.component';
import { PreconfiguredTasksComponent } from '@src/app/tasks/preconfigured-tasks/preconfigured-tasks.component';
import { ModalSubtasksComponent } from '@src/app/tasks/show-tasks/modal-subtasks/modal-subtasks.component';
import { ShowTasksComponent } from '@src/app/tasks/show-tasks/show-tasks.component';
import { ApplyHashlistComponent } from '@src/app/tasks/supertasks/applyhashlist.component';
import { ModalPretasksComponent } from '@src/app/tasks/supertasks/modal-pretasks/modal-pretasks.component';
import { SupertasksComponent } from '@src/app/tasks/supertasks/supertasks.component';
import { TasksRoutingModule } from '@src/app/tasks/tasks-routing.module';

@NgModule({
  declarations: [
    EditPreconfiguredTasksComponent,
    NewPreconfiguredTasksComponent,
    PreconfiguredTasksComponent,
    EditSupertasksComponent,
    NewSupertasksComponent,
    ApplyHashlistComponent,
    ModalPretasksComponent,
    ModalSubtasksComponent,
    SupertasksComponent,
    ShowTasksComponent,
    EditTasksComponent,
    NewTasksComponent,
    ChunksComponent,
    WrbulkComponent,
    MasksComponent
  ],
  imports: [
    ReactiveFormsModule,
    TasksRoutingModule,
    FontAwesomeModule,
    ComponentsModule,
    CoreComponentsModule,
    CoreFormsModule,
    CommonModule,
    RouterModule,
    PipesModule,
    FormsModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    TaskSpeedGraphComponent
  ],
  exports: [ModalPretasksComponent, ModalSubtasksComponent]
})
export class TasksModule {}
