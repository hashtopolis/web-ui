import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TableComponent } from '@src/app/shared/table/table.component';

@NgModule({
  imports: [FormsModule, CommonModule, FontAwesomeModule],
  exports: [TableComponent],
  declarations: [TableComponent]
})
export class TableModule {}
