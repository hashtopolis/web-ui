import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AlertNavModule } from '@src/app/shared/alert/alert.module';
import { CheatsheetComponent } from '@src/app/shared/alert/cheatsheet/cheatsheet.component';
import { FixedAlertComponent } from '@src/app/shared/alert/fixed-alert/fixed-alert.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { TimeoutDialogComponent } from '@src/app/shared/dialog/timeout/timeout-dialog.component';
import { DividerModule } from '@src/app/shared/divider/divider.module';
import { DynamicFormModule } from '@src/app/shared/dynamic-form-builder/dynamicform.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';
import { GridModule } from '@src/app/shared/grid-containers/grid.module';
import { HashtypeDetectorComponent } from '@src/app/shared/hashtype-detector/hashtype-detector.component';
import { InputModule } from '@src/app/shared/input/input.module';
import { HorizontalNavModule } from '@src/app/shared/navigation/navigation.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';
import { PassStrenghtComponent } from '@src/app/shared/password/pass-strenght/pass-strenght.component';
import { ReportsModule } from '@src/app/shared/report-builder/reports.module';
import { TableModule } from '@src/app/shared/table/table-actions.module';
import { HexconvertorComponent } from '@src/app/shared/utils/hexconvertor/hexconvertor.component';
import { WordlistGeneratorComponent } from '@src/app/shared/wordlist-generator/wordlist-generator.component';

@NgModule({
  declarations: [
    WordlistGeneratorComponent,
    HashtypeDetectorComponent,
    TimeoutDialogComponent,
    HexconvertorComponent,
    PassStrenghtComponent,
    CheatsheetComponent,
    FixedAlertComponent
  ],
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    HorizontalNavModule,
    DynamicFormModule,
    CoreFormsModule,
    PageTitleModule,
    AlertNavModule,
    ButtonsModule,
    ReportsModule,
    CommonModule,
    TableModule,
    InputModule,
    GridModule,
    DividerModule
  ],
  exports: [
    WordlistGeneratorComponent,
    HashtypeDetectorComponent,
    TimeoutDialogComponent,
    HexconvertorComponent,
    PassStrenghtComponent,
    HorizontalNavModule,
    CheatsheetComponent,
    FixedAlertComponent,
    DynamicFormModule,
    PageTitleModule,
    AlertNavModule,
    ButtonsModule,
    ReportsModule,
    CommonModule,
    InputModule,
    TableModule,
    GridModule,
    DividerModule
  ]
})
export class ComponentsModule {}
