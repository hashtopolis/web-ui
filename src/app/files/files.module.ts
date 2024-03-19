import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../shared/components.module';
import { CoreComponentsModule } from '../core/_components/core-components.module';
import { DataTablesModule } from 'angular-datatables';
import { FilesComponent } from './files.component';
import { FilesRoutingModule } from './files-routing.module';
import { NewFilesComponent } from './new-files/new-files.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../shared/pipes.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CoreFormsModule } from '../shared/forms.module';

@NgModule({
  declarations: [FilesComponent, NewFilesComponent],
  imports: [
    CoreFormsModule,
    FilesRoutingModule,
    DataTablesModule,
    ComponentsModule,
    CommonModule,
    CoreComponentsModule,
    RouterModule,
    PipesModule,
    NgbModule
  ]
})
export class FilesModule {}
