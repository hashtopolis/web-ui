import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../shared/components.module';
import { CoreComponentsModule } from '../core/_components/core-components.module';
import { DataTablesModule } from 'angular-datatables';
import { DirectivesModule } from '../shared/directives.module';
import { EditHashlistComponent } from './edit-hashlist/edit-hashlist.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HashesComponent } from './hashes/hashes.component';
import { HashlistComponent } from './hashlist/hashlist.component';
import { HashlistRoutingModule } from './hashlists-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NewHashlistComponent } from './new-hashlist/new-hashlist.component';
import { NewSuperhashlistComponent } from './new-superhashlist/new-superhashlist.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../shared/pipes.module';
import { RouterModule } from '@angular/router';
import { SearchHashComponent } from './search-hash/search-hash.component';
import { ShowCracksComponent } from './show-cracks/show-cracks.component';
import { SuperhashlistComponent } from './superhashlist/superhashlist.component';

@NgModule({
  declarations: [
    NewSuperhashlistComponent,
    SuperhashlistComponent,
    EditHashlistComponent,
    NewHashlistComponent,
    SearchHashComponent,
    ShowCracksComponent,
    HashlistComponent,
    HashesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ComponentsModule,
    HashlistRoutingModule,
    ReactiveFormsModule,
    CoreComponentsModule,
    FontAwesomeModule,
    DataTablesModule,
    MatSlideToggleModule,
    DirectivesModule,
    PipesModule,
    NgbModule
  ]
})
export class HashlistModule {}
