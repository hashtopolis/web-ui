import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonsModule } from '../buttons/buttons.module';
import { CoreFormsModule } from '../forms.module';
import { GridModule } from '../grid-containers/grid.module';
import { InputModule } from '../input/input.module';
import { PageTitleModule } from '../page-headers/page-title.module';
import { HashlistReportComponent } from './reports/hashlist-report/hashlist-report.component';
import { ReportBuilderComponent } from './reports/report-builder/report-builder.component';

import { DividerModule } from '@src/app/shared/divider/divider.module';

@NgModule({
  imports: [
    FormsModule,
    CoreFormsModule,
    ReactiveFormsModule,
    CommonModule,
    GridModule,
    InputModule,
    PageTitleModule,
    ButtonsModule,
    DividerModule
  ],
  exports: [HashlistReportComponent],
  declarations: [HashlistReportComponent, ReportBuilderComponent]
})
export class ReportsModule {}
