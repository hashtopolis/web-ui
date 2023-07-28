import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";

import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { HashtypeDetectorComponent } from "./hashtype-detector/hashtype-detector.component";
import { HexconvertorComponent } from "./utils/hexconvertor/hexconvertor.component";
import { CheatsheetComponent } from "./alert/cheatsheet/cheatsheet.component";
import { FilterTextboxModule } from "./filter-textbox/filter-textbox.module";
import { SwitchThemeModule } from "./switch-theme/switch-theme.module";
import { TimeoutComponent } from "./alert/timeout/timeout.component";
import { PaginationModule } from "./pagination/pagination.module";
import { PageTitleModule } from "./page-headers/page-title.module";
import { GridModule } from "./grid-containers/grid.module";
import { TableModule } from "./table/table-actions.module";
import { AlertComponent } from "./alert/alert.component";
import { ButtonsModule } from "./buttons/buttons.module";
import { LottiesModule } from './lottie/lottie.module';
import { GraphsModule } from "./graphs/graphs.module";
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    HashtypeDetectorComponent,
    LoadingSpinnerComponent,
    HexconvertorComponent,
    CheatsheetComponent,
    TimeoutComponent,
    AlertComponent
  ],
  imports: [
    FilterTextboxModule,
    SwitchThemeModule,
    ColorPickerModule,
    PaginationModule,
    PageTitleModule,
    ButtonsModule,
    LottiesModule,
    GraphsModule,
    CommonModule,
    FormsModule,
    TableModule,
    GridModule,
    NgbModule
  ],
  exports: [
    HashtypeDetectorComponent,
    LoadingSpinnerComponent,
    HexconvertorComponent,
    FilterTextboxModule,
    CheatsheetComponent,
    SwitchThemeModule,
    ColorPickerModule,
    PaginationModule,
    TimeoutComponent,
    PageTitleModule,
    AlertComponent,
    ButtonsModule,
    LottiesModule,
    GraphsModule,
    CommonModule,
    TableModule,
    GridModule
  ],
})
export class ComponentsModule {}
