import { SimulateFormFieldMultiComponent } from './simulate-form-field-multi/simulate-form-field-multi.component';
import { SimulateFormFieldComponent } from './simulate-form-field/simulate-form-field.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GridFormInputComponent } from './grid-formgroup';
import { GridAutoColComponent } from './grid-autocol';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { GridMainComponent } from './grid-main';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CoreFormsModule } from '../forms.module';

@NgModule({
  imports: [
    RouterModule,
    CoreFormsModule,
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    NgbModule
  ],
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
