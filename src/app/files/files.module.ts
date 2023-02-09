import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTablesModule } from "angular-datatables";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { FilesEditComponent } from "./files-edit/files-edit.component";
import { ComponentsModule } from "../shared/components.module";
import { FilesRoutingModule } from "./files-routing.module";
import { PipesModule } from "../shared/pipes.module";
import { FilesComponent } from "./files.component";

@NgModule({
  declarations:[
    FilesEditComponent,
    FilesComponent
  ],
  imports:[
    ReactiveFormsModule,
    FilesRoutingModule,
    FontAwesomeModule,
    DataTablesModule,
    ComponentsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    PipesModule,
    NgbModule
  ]
})
export class FilesModule {}
