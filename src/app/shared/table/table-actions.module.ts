import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TableComponent } from './table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    FontAwesomeModule
  ],
  exports: [
    TableComponent
  ],
  declarations: [
    TableComponent
  ]
})
export class TableModule { }
