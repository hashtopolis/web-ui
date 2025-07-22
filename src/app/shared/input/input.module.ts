import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreFormsModule } from '@src/app/shared/forms.module';
import { InputCheckComponent } from '@src/app/shared/input/check/check.component';
import { InputColorComponent } from '@src/app/shared/input/color/color.component';
import { InputDateComponent } from '@src/app/shared/input/date/date.component';
import { InputFileComponent } from '@src/app/shared/input/file/file.component';
import { InputMultiSelectComponent } from '@src/app/shared/input/multiselect/multiselect.component';
import { InputNumberComponent } from '@src/app/shared/input/number/number.component';
import { InputSelectComponent } from '@src/app/shared/input/select/select.component';
import { InputTextComponent } from '@src/app/shared/input/text/text.component';
import { InputTextAreaComponent } from '@src/app/shared/input/text-area/text-area.component';

@NgModule({
  imports: [CoreFormsModule, CommonModule],
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
