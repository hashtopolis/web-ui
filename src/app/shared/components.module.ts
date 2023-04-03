import { NgModule } from "@angular/core";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { FilterTextboxModule } from "./filter-textbox/filter-textbox.module";
import { TimeoutComponent } from "./alert/timeout/timeout.component";
import { PaginationModule } from "./pagination/pagination.module";
import { AlertComponent } from "./alert/alert.component";
import { GraphsModule } from "./graphs/graphs.module";
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
    GraphsModule,
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
    GraphsModule,
    CommonModule
  ],
})
export class ComponentsModule {}
