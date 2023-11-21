import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgModule } from '@angular/core';
import { InputMultiSelectComponent } from './multiselect/multiselect.component';
import { InputColorComponent } from './color/color.component';
import { InputCheckComponent } from './check/check.component';
import { InputTextComponent } from './text/text.component';
import { InputDateComponent } from './date/date.component';
import { InputNumberComponent } from './number/number.component';
import { InputTextAreaComponent } from './text-area/text-area.component';
import { InputSelectComponent } from './select/select.component';

@NgModule({
  imports: [
    ColorPickerModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  exports: [
    InputCheckComponent,
    InputColorComponent,
    InputDateComponent,
    InputMultiSelectComponent,
    InputNumberComponent,
    InputSelectComponent,
    InputTextComponent,
    InputTextAreaComponent
  ],
  declarations: [
    InputCheckComponent,
    InputColorComponent,
    InputDateComponent,
    InputMultiSelectComponent,
    InputNumberComponent,
    InputSelectComponent,
    InputTextComponent,
    InputTextAreaComponent
  ]
})
export class InputModule {}
