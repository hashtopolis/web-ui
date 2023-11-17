import { ButtonsModule } from '../buttons/buttons.module';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from './dynamicform.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormComponent } from 'src/app/core/_components/forms/simple-forms/form.component';
import { FormConfigComponent } from '../../core/_components/forms/simple-forms/formconfig.component';
import { GridModule } from '../grid-containers/grid.module';
import { HorizontalNavModule } from '../navigation/navigation.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from '../page-headers/page-title.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { PipesModule } from '../pipes.module';

@NgModule({
  declarations: [DynamicFormComponent, FormConfigComponent, FormComponent],
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    MatChipsModule,
    MatOptionModule,
    CommonModule,
    MatAutocompleteModule,
    FontAwesomeModule,
    FormsModule,
    PipesModule,
    GridModule,
    NgbModule,
    PageTitleModule,
    ReactiveFormsModule,
    HorizontalNavModule,
    ButtonsModule
  ],
  exports: [DynamicFormComponent, FormConfigComponent, FormComponent],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    }
  ]
})
export class DynamicFormModule {}
