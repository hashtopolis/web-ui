import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DataTablesModule } from "angular-datatables";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ComponentsModule } from "../shared/components.module";
import { PipesModule } from "../shared/pipes.module";
import { TasksRoutingModule } from "./tasks-routing.module";

import { ShowTasksComponent } from "./show-tasks/show-tasks.component";
import { SupertasksComponent } from "./supertasks/supertasks.component";
import { ChunksComponent } from "./chunks/chunks.component";
import { ImportSupertasksComponent } from "./import-supertasks/import-supertasks.component";
import { NewPreconfiguredTasksComponent } from "./new-preconfigured-tasks/new-preconfigured-tasks.component";
import { NewSupertasksComponent } from "./new-supertasks/new-supertasks.component";
import { NewTasksComponent } from "./new-tasks/new-tasks.component";
import { PreconfiguredTasksComponent } from "./preconfigured-tasks/preconfigured-tasks.component";
import { EditSupertasksComponent } from './edit-supertasks/edit-supertasks.component';
import { EditPreconfiguredTasksComponent } from './edit-preconfigured-tasks/edit-preconfigured-tasks.component';
import { EditTasksComponent } from './edit-tasks/edit-tasks.component';


@NgModule({
  declarations:[
    ShowTasksComponent,
    NewTasksComponent,
    PreconfiguredTasksComponent,
    NewPreconfiguredTasksComponent,
    SupertasksComponent,
    NewSupertasksComponent,
    ImportSupertasksComponent,
    ChunksComponent,
    EditSupertasksComponent,
    EditPreconfiguredTasksComponent,
    EditTasksComponent
  ],
  imports:[
    CommonModule,
    RouterModule,
    DataTablesModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    TasksRoutingModule,
    PipesModule,
    ComponentsModule
 ]
})
export class TasksModule {}
