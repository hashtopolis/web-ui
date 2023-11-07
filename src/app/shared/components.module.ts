import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";

import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { HashtypeDetectorComponent } from "./hashtype-detector/hashtype-detector.component";
import { ActiveSpinnerComponent } from './loading-spinner/loading-spinner-active.component';
import { PassStrenghtComponent } from './password/pass-strenght/pass-strenght.component';
import { ButtonTruncateTextComponent } from './table/button-truncate-text.component';
import { HexconvertorComponent } from "./utils/hexconvertor/hexconvertor.component";
import { PassMatchComponent } from './password/pass-match/pass-match.component';
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
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TimeoutDialogComponent } from './dialog/timeout/timeout-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    ButtonTruncateTextComponent,
    TimeoutDialogComponent,
    HashtypeDetectorComponent,
    LoadingSpinnerComponent,
    ActiveSpinnerComponent,
    HexconvertorComponent,
    PassStrenghtComponent,
    CheatsheetComponent,
    PassMatchComponent,
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
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressBarModule,
    MatIconModule,
    FormsModule,
    TableModule,
    GridModule,
    NgbModule
  ],
  exports: [
    ButtonTruncateTextComponent,
    TimeoutDialogComponent,
    HashtypeDetectorComponent,
    LoadingSpinnerComponent,
    ActiveSpinnerComponent,
    HexconvertorComponent,
    PassStrenghtComponent,
    FilterTextboxModule,
    CheatsheetComponent,
    PassMatchComponent,
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
export class ComponentsModule { }
