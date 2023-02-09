import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { FilterTextboxComponent } from './filter-textbox.component';

@NgModule({
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  exports: [FilterTextboxComponent],
  declarations: [FilterTextboxComponent]
})
export class FilterTextboxModule { }
