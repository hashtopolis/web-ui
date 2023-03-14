import { NgModule } from "@angular/core";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { FilterTextboxModule } from "./filter-textbox/filter-textbox.module";
import { TimeoutComponent } from "./alert/timeout/timeout.component";
import { PaginationModule } from "./pagination/pagination.module";
import { AlertComponent } from "./alert/alert.component";
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    TimeoutComponent,
    AlertComponent
  ],
  imports: [
    FilterTextboxModule,
    ColorPickerModule,
    PaginationModule,
    CommonModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    LoadingSpinnerComponent,
    FilterTextboxModule,
    ColorPickerModule,
    PaginationModule,
    TimeoutComponent,
    AlertComponent,
    CommonModule
  ]
})
export class ComponentsModule {}
