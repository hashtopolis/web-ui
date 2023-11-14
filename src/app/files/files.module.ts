import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../shared/components.module';
import { CoreComponentsModule } from '../core/_components/core-components.module';
import { DataTablesModule } from 'angular-datatables';
import { FilesComponent } from './files.component';
import { FilesEditComponent } from './files-edit/files-edit.component';
import { FilesRoutingModule } from './files-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewFilesComponent } from './new-files/new-files.component';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../shared/pipes.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [FilesEditComponent, FilesComponent, NewFilesComponent],
  imports: [
    ReactiveFormsModule,
    FilesRoutingModule,
    FontAwesomeModule,
    DataTablesModule,
    ComponentsModule,
    CommonModule,
    CoreComponentsModule,
    RouterModule,
    FormsModule,
    PipesModule,
    NgbModule
  ]
})
export class FilesModule {}
