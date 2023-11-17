import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { HashtypeDetectorComponent } from './hashtype-detector/hashtype-detector.component';
import { ActiveSpinnerComponent } from './loading-spinner/loading-spinner-active.component';
import { PassStrenghtComponent } from './password/pass-strenght/pass-strenght.component';
import { ButtonTruncateTextComponent } from './table/button-truncate-text.component';
import { HexconvertorComponent } from './utils/hexconvertor/hexconvertor.component';
import { TimeoutDialogComponent } from './dialog/timeout/timeout-dialog.component';
import { PassMatchComponent } from './password/pass-match/pass-match.component';
import { CheatsheetComponent } from './alert/cheatsheet/cheatsheet.component';
import { FilterTextboxModule } from './filter-textbox/filter-textbox.module';
import { SwitchThemeModule } from './switch-theme/switch-theme.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TimeoutComponent } from './alert/timeout/timeout.component';
import { HorizontalNavModule } from './navigation/navigation.module';
import { PageTitleModule } from './page-headers/page-title.module';
import { PaginationModule } from './pagination/pagination.module';
import { DynamicFormModule } from './form/dynamicform.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GridModule } from './grid-containers/grid.module';
import { TableModule } from './table/table-actions.module';
import { AlertComponent } from './alert/alert.component';
import { ButtonsModule } from './buttons/buttons.module';
import { LottiesModule } from './lottie/lottie.module';
import { MatIconModule } from '@angular/material/icon';
import { GraphsModule } from './graphs/graphs.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { InputModule } from './input/input.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ButtonTruncateTextComponent,
    HashtypeDetectorComponent,
    LoadingSpinnerComponent,
    TimeoutDialogComponent,
    ActiveSpinnerComponent,
    HexconvertorComponent,
    PassStrenghtComponent,
    CheatsheetComponent,
    PassMatchComponent,
    TimeoutComponent,
    AlertComponent
  ],
  imports: [
    MatProgressBarModule,
    FilterTextboxModule,
    HorizontalNavModule,
    DynamicFormModule,
    SwitchThemeModule,
    ColorPickerModule,
    PaginationModule,
    PageTitleModule,
    MatButtonModule,
    MatDialogModule,
    ButtonsModule,
    LottiesModule,
    MatIconModule,
    MatIconModule,
    GraphsModule,
    CommonModule,
    FormsModule,
    TableModule,
    InputModule,
    GridModule,
    NgbModule
  ],
  exports: [
    ButtonTruncateTextComponent,
    HashtypeDetectorComponent,
    LoadingSpinnerComponent,
    TimeoutDialogComponent,
    ActiveSpinnerComponent,
    HexconvertorComponent,
    PassStrenghtComponent,
    FilterTextboxModule,
    HorizontalNavModule,
    CheatsheetComponent,
    PassMatchComponent,
    SwitchThemeModule,
    DynamicFormModule,
    ColorPickerModule,
    PaginationModule,
    TimeoutComponent,
    PageTitleModule,
    AlertComponent,
    ButtonsModule,
    LottiesModule,
    GraphsModule,
    CommonModule,
    InputModule,
    TableModule,
    GridModule
  ]
})
export class ComponentsModule {}
