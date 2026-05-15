import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

import { CoreFormsModule } from '@src/app/shared/forms.module';
import { FormRowComponent } from '@src/app/shared/grid-containers/form-row/form-row.component';
import { GridAutoColComponent } from '@src/app/shared/grid-containers/grid-autocol';
import { GridFormInputComponent } from '@src/app/shared/grid-containers/grid-formgroup';
import { GridMainComponent } from '@src/app/shared/grid-containers/grid-main';

@NgModule({
  imports: [RouterModule, CoreFormsModule, FontAwesomeModule, CommonModule, FormsModule, MatCardModule],
  exports: [GridFormInputComponent, GridAutoColComponent, GridMainComponent, FormRowComponent],
  declarations: [GridFormInputComponent, GridAutoColComponent, GridMainComponent, FormRowComponent]
})
export class GridModule {}
