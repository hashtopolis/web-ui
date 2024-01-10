import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FilterTextboxComponent } from './filter-textbox.component';
import { CoreFormsModule } from '../forms.module';

@NgModule({
  imports: [CommonModule, FormsModule, CoreFormsModule],
  exports: [FilterTextboxComponent],
  declarations: [FilterTextboxComponent]
})
export class FilterTextboxModule {}
