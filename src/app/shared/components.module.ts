import { ActiveSpinnerComponent } from './loading-spinner/loading-spinner-active.component';
import { AlertComponent } from './alert/alert.component';
import { ButtonsModule } from './buttons/buttons.module';
import { CheatsheetComponent } from './alert/cheatsheet/cheatsheet.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { CommonModule } from '@angular/common';
import { DynamicFormModule } from './dynamic-form-builder/dynamicform.module';
import { FilterTextboxModule } from './filter-textbox/filter-textbox.module';
import { FormsModule } from '@angular/forms';
import { GraphsModule } from './graphs/graphs.module';
import { GridModule } from './grid-containers/grid.module';
import { HashtypeDetectorComponent } from './hashtype-detector/hashtype-detector.component';
import { HexconvertorComponent } from './utils/hexconvertor/hexconvertor.component';
import { HorizontalNavModule } from './navigation/navigation.module';
import { InputModule } from './input/input.module';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { LottiesModule } from './lottie/lottie.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from './page-headers/page-title.module';
import { PaginationModule } from './pagination/pagination.module';
import { PassMatchComponent } from './password/pass-match/pass-match.component';
import { PassStrenghtComponent } from './password/pass-strenght/pass-strenght.component';
import { SwitchThemeModule } from './switch-theme/switch-theme.module';
import { TableModule } from './table/table-actions.module';
import { TimeoutComponent } from './alert/timeout/timeout.component';
import { TimeoutDialogComponent } from './dialog/timeout/timeout-dialog.component';

@NgModule({
  declarations: [
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
    CommonModule,
    FormsModule,
    NgbModule,
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
    TableModule,
    InputModule,
    GridModule,
    NgbModule
  ],
  exports: [
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
