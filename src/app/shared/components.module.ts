import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AlertComponent } from '@src/app/shared/alert/alert.component';
import { AlertNavModule } from '@src/app/shared/alert/alert.module';
import { CheatsheetComponent } from '@src/app/shared/alert/cheatsheet/cheatsheet.component';
import { FixedAlertComponent } from '@src/app/shared/alert/fixed-alert/fixed-alert.component';
import { TimeoutComponent } from '@src/app/shared/alert/timeout/timeout.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { TimeoutDialogComponent } from '@src/app/shared/dialog/timeout/timeout-dialog.component';
import { DynamicFormModule } from '@src/app/shared/dynamic-form-builder/dynamicform.module';
import { FilterTextboxModule } from '@src/app/shared/filter-textbox/filter-textbox.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';
import { GraphsModule } from '@src/app/shared/graphs/graphs.module';
import { GridModule } from '@src/app/shared/grid-containers/grid.module';
import { HashtypeDetectorComponent } from '@src/app/shared/hashtype-detector/hashtype-detector.component';
import { InputModule } from '@src/app/shared/input/input.module';
import { ActiveSpinnerComponent } from '@src/app/shared/loading-spinner/loading-spinner-active.component';
import { LoadingSpinnerComponent } from '@src/app/shared/loading-spinner/loading-spinner.component';
import { HorizontalNavModule } from '@src/app/shared/navigation/navigation.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';
import { PaginationModule } from '@src/app/shared/pagination/pagination.module';
import { PassMatchComponent } from '@src/app/shared/password/pass-match/pass-match.component';
import { PassStrenghtComponent } from '@src/app/shared/password/pass-strenght/pass-strenght.component';
import { ReportsModule } from '@src/app/shared/report-builder/reports.module';
import { SwitchThemeModule } from '@src/app/shared/switch-theme/switch-theme.module';
import { TableModule } from '@src/app/shared/table/table-actions.module';
import { HexconvertorComponent } from '@src/app/shared/utils/hexconvertor/hexconvertor.component';
import { WordlisGeneratorComponent } from '@src/app/shared/wordlist-generator/wordlist-generatorcomponent';

@NgModule({
  declarations: [
    WordlisGeneratorComponent,
    HashtypeDetectorComponent,
    LoadingSpinnerComponent,
    TimeoutDialogComponent,
    ActiveSpinnerComponent,
    HexconvertorComponent,
    PassStrenghtComponent,
    CheatsheetComponent,
    FixedAlertComponent,
    PassMatchComponent,
    TimeoutComponent,
    AlertComponent
  ],
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    FilterTextboxModule,
    HorizontalNavModule,
    DynamicFormModule,
    SwitchThemeModule,
    PaginationModule,
    CoreFormsModule,
    PageTitleModule,
    FlexLayoutModule,
    AlertNavModule,
    ButtonsModule,
    ReportsModule,
    CommonModule,
    GraphsModule,
    TableModule,
    InputModule,
    GridModule,
    NgbModule
  ],
  exports: [
    WordlisGeneratorComponent,
    HashtypeDetectorComponent,
    LoadingSpinnerComponent,
    TimeoutDialogComponent,
    ActiveSpinnerComponent,
    HexconvertorComponent,
    PassStrenghtComponent,
    FilterTextboxModule,
    HorizontalNavModule,
    CheatsheetComponent,
    FixedAlertComponent,
    PassMatchComponent,
    SwitchThemeModule,
    DynamicFormModule,
    PaginationModule,
    TimeoutComponent,
    PageTitleModule,
    AlertComponent,
    AlertNavModule,
    ButtonsModule,
    ReportsModule,
    GraphsModule,
    CommonModule,
    InputModule,
    TableModule,
    GridModule
  ]
})
export class ComponentsModule {}
