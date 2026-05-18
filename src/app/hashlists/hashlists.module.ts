import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // You may need to import other modules based on your application's requirements.
import { RouterModule } from '@angular/router';

import { CoreComponentsModule } from '@components/core-components.module';
import { NewSuperhashlistComponent } from '@components/forms/custom-forms/superhashlist/new-superhashlist/new-superhashlist.component';

import { EditHashlistComponent } from '@src/app/hashlists/edit-hashlist/edit-hashlist.component';
import { HashesComponent } from '@src/app/hashlists/hashes/hashes.component';
import { HashlistComponent } from '@src/app/hashlists/hashlist/hashlist.component';
import { HashlistRoutingModule } from '@src/app/hashlists/hashlists-routing.module';
import { ImportCrackedHashesComponent } from '@src/app/hashlists/import-cracked-hashes/import-cracked-hashes.component';
import { NewHashlistComponent } from '@src/app/hashlists/new-hashlist/new-hashlist.component';
import { SearchHashComponent } from '@src/app/hashlists/search-hash/search-hash.component';
import { ShowCracksComponent } from '@src/app/hashlists/show-cracks/show-cracks.component';
import { SuperhashlistComponent } from '@src/app/hashlists/superhashlist/superhashlist.component';
import { ComponentsModule } from '@src/app/shared/components.module';
import { DirectivesModule } from '@src/app/shared/directives.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';
import { PipesModule } from '@src/app/shared/pipes.module';

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
    DirectivesModule,
    ComponentsModule,
    CoreFormsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    PipesModule
  ]
})
export class HashlistModule {}
