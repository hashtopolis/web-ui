import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreComponentsModule } from '@components/core-components.module';

import { FilesRoutingModule } from '@src/app/files/files-routing.module';
import { FilesComponent } from '@src/app/files/files.component';
import { NewFilesComponent } from '@src/app/files/new-files/new-files.component';
import { ComponentsModule } from '@src/app/shared/components.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';
import { PipesModule } from '@src/app/shared/pipes.module';

@NgModule({
  declarations: [FilesComponent, NewFilesComponent],
  imports: [
    CoreFormsModule,
    FilesRoutingModule,
    ComponentsModule,
    CommonModule,
    CoreComponentsModule,
    RouterModule,
    PipesModule
  ]
})
export class FilesModule {}
