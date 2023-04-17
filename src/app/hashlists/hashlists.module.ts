import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "../shared/components.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTablesModule } from "angular-datatables";
import { PipesModule } from "../shared/pipes.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { NewSuperhashlistComponent } from "./new-superhashlist/new-superhashlist.component";
import { SuperhashlistComponent } from "./superhashlist/superhashlist.component";
import { EditHashlistComponent } from "./edit-hashlist/edit-hashlist.component";
import { NewHashlistComponent } from "./new-hashlist/new-hashlist.component";
import { SearchHashComponent } from "./search-hash/search-hash.component";
import { ShowCracksComponent } from "./show-cracks/show-cracks.component";
import { HashlistRoutingModule } from "./hashlists-routing.module";
import { HashlistComponent } from "./hashlist/hashlist.component";
import { DirectivesModule } from "../shared/directives.module";
import { HashesComponent } from './hashes/hashes.component';

@NgModule({
  declarations:[
    NewSuperhashlistComponent,
    SuperhashlistComponent,
    EditHashlistComponent,
    NewHashlistComponent,
    SearchHashComponent,
    ShowCracksComponent,
    HashlistComponent,
    HashesComponent
  ],
  imports:[
    HashlistRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DataTablesModule,
    DirectivesModule,
    ComponentsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    PipesModule,
    NgbModule
  ]
})
export class HashlistModule {}
