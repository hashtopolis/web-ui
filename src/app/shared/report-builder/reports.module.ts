import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { DividerModule } from '@src/app/shared/divider/divider.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';
import { GridModule } from '@src/app/shared/grid-containers/grid.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';
import { HashlistReportComponent } from '@src/app/shared/report-builder/reports/hashlist-report/hashlist-report.component';
import { ReportBuilderComponent } from '@src/app/shared/report-builder/reports/report-builder/report-builder.component';

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
