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
import { NewSuperhashlistComponent } from '../core/_components/forms/custom-forms/superhashlist/new-superhashlist/new-superhashlist.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../shared/pipes.module';
import { RouterModule } from '@angular/router';
import { SearchHashComponent } from './search-hash/search-hash.component';
import { ShowCracksComponent } from './show-cracks/show-cracks.component';
import { SuperhashlistComponent } from './superhashlist/superhashlist.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
    HashlistRoutingModule,
    ReactiveFormsModule,
    CoreComponentsModule,
    FontAwesomeModule,
    DataTablesModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatChipsModule,
    MatSelectModule,
    MatTooltipModule,
    MatFormFieldModule,
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
