import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApplyHashlistComponent } from './supertasks/applyhashlist.component';
import { ChunksComponent } from './chunks/chunks.component';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../shared/components.module';
import { CoreComponentsModule } from '../core/_components/core-components.module';
import { DataTablesModule } from 'angular-datatables';
import { EditPreconfiguredTasksComponent } from './edit-preconfigured-tasks/edit-preconfigured-tasks.component';
import { EditSupertasksComponent } from './edit-supertasks/edit-supertasks.component';
import { EditTasksComponent } from './edit-tasks/edit-tasks.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MasksComponent } from './import-supertasks/masks/masks.component';
import { ModalPretasksComponent } from './supertasks/modal-pretasks/modal-pretasks.component';
import { ModalSubtasksComponent } from './show-tasks/modal-subtasks/modal-subtasks.component';
import { NewPreconfiguredTasksComponent } from './new-preconfigured-tasks/new-preconfigured-tasks.component';
import { NewSupertasksComponent } from '../core/_components/forms/custom-forms/task/new-supertasks/new-supertasks.component';
import { NewTasksComponent } from './new-tasks/new-tasks.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../shared/pipes.module';
import { PreconfiguredTasksComponent } from './preconfigured-tasks/preconfigured-tasks.component';
import { RouterModule } from '@angular/router';
import { ShowTasksComponent } from './show-tasks/show-tasks.component';
import { SupertasksComponent } from './supertasks/supertasks.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { WrbulkComponent } from './import-supertasks/wrbulk/wrbulk.component';
import { CoreFormsModule } from '../shared/forms.module';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';


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
    DataTablesModule,
    ComponentsModule,
    CoreComponentsModule,
    CoreFormsModule,
    CommonModule,
    RouterModule,
    PipesModule,
    FormsModule,
    NgbModule,
    MatButtonToggle,
    MatButtonToggleGroup
  ],
  exports: [ModalPretasksComponent, ModalSubtasksComponent]
})
export class TasksModule {}
