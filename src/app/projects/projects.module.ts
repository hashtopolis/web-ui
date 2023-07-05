import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTablesModule } from "angular-datatables";

import { EditProjectComponent } from "./edit-project/edit-project.component";
import { ProjectsRoutingModule } from "./projects-routing.module";
import { ProjectsComponent } from "./projects.component";


@NgModule({
  declarations:[
    ProjectsComponent,
    EditProjectComponent
  ],
  imports:[
    CommonModule,
    RouterModule,
    FormsModule,
    DataTablesModule,
    FontAwesomeModule,
    NgbModule,
    ProjectsRoutingModule
  ]
})
export class ProjectsModule {}
