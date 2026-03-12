import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

import { CoreFormsModule } from '@src/app/shared/forms.module';
import { GridAutoColComponent } from '@src/app/shared/grid-containers/grid-autocol';
import { GridFormInputComponent } from '@src/app/shared/grid-containers/grid-formgroup';
import { GridMainComponent } from '@src/app/shared/grid-containers/grid-main';
import { SimulateFormFieldComponent } from '@src/app/shared/grid-containers/simulate-form-field/simulate-form-field.component';
import { SimulateFormFieldMultiComponent } from '@src/app/shared/grid-containers/simulate-form-field-multi/simulate-form-field-multi.component';

@NgModule({
  imports: [RouterModule, CoreFormsModule, FontAwesomeModule, CommonModule, FormsModule, MatCardModule],
  exports: [
    SimulateFormFieldMultiComponent,
    SimulateFormFieldComponent,
    GridFormInputComponent,
    GridAutoColComponent,
    GridMainComponent
  ],
  declarations: [
    SimulateFormFieldMultiComponent,
    SimulateFormFieldComponent,
    GridFormInputComponent,
    GridAutoColComponent,
    GridMainComponent
  ]
})
export class GridModule {}
