import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTablesModule } from "angular-datatables";

import { ComponentsModule } from "../shared/components.module";
import { PipesModule } from "../shared/pipes.module";
import { FilesEditComponent } from "./files-edit/files-edit.component";
import { FilesRoutingModule } from "./files-routing.module";
import { FilesComponent } from "./files.component";

@NgModule({
  declarations:[
    FilesComponent,
    FilesEditComponent
  ],
  imports:[
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DataTablesModule,
    NgbModule,
    ComponentsModule,
    PipesModule,
    FilesRoutingModule
  ]
})
export class FilesModule {}
