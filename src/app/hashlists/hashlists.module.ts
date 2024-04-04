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
import { NewHashlistComponent } from './new-hashlist/new-hashlist.component';
import { NewSuperhashlistComponent } from '../core/_components/forms/custom-forms/superhashlist/new-superhashlist/new-superhashlist.component';
import { ImportCrackedHashesComponent } from './import-cracked-hashes/import-cracked-hashes.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../shared/pipes.module';
import { RouterModule } from '@angular/router';
import { SearchHashComponent } from './search-hash/search-hash.component';
import { ShowCracksComponent } from './show-cracks/show-cracks.component';
import { SuperhashlistComponent } from './superhashlist/superhashlist.component';
import { CoreFormsModule } from '../shared/forms.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // You may need to import other modules based on your application's requirements.

@NgModule({
  declarations: [
    ImportCrackedHashesComponent,
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
    MatFormFieldModule,
    MatInputModule,
    HashlistRoutingModule,
    ReactiveFormsModule,
    CoreFormsModule,
    CoreComponentsModule,
    FontAwesomeModule,
    DataTablesModule,
    DirectivesModule,
    ComponentsModule,
    CoreFormsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    PipesModule,
    NgbModule
  ]
})
export class HashlistModule {}
