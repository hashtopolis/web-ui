import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import { CoreFormsModule } from '../forms.module';
import { InputMultiSelectComponent } from './multiselect/multiselect.component';
import { InputColorComponent } from './color/color.component';
import { InputCheckComponent } from './check/check.component';
import { InputTextComponent } from './text/text.component';
import { InputDateComponent } from './date/date.component';
import { InputNumberComponent } from './number/number.component';
import { InputTextAreaComponent } from './text-area/text-area.component';
import { InputSelectComponent } from './select/select.component';
import { InputFileComponent } from './file/file.component';

@NgModule({
  imports: [CoreFormsModule, ColorPickerModule, CommonModule],
  exports: [
    InputCheckComponent,
    InputColorComponent,
    InputDateComponent,
    InputFileComponent,
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
    InputFileComponent,
    InputMultiSelectComponent,
    InputNumberComponent,
    InputSelectComponent,
    InputTextComponent,
    InputTextAreaComponent
  ]
})
export class InputModule {}
