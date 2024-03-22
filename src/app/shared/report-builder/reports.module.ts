import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ButtonsModule } from '../buttons/buttons.module';
import { PageTitleModule } from '../page-headers/page-title.module';
import { CoreFormsModule } from '../forms.module';
import { GridModule } from '../grid-containers/grid.module';
import { HashlistReportComponent } from './reports/hashlist-report/hashlist-report.component';
import { ReportBuilderComponent } from './reports/report-builder/report-builder.component';
import { InputModule } from '../input/input.module';

@NgModule({
  imports: [
    FormsModule,
    CoreFormsModule,
    ReactiveFormsModule,
    CommonModule,
    GridModule,
    InputModule,
    PageTitleModule,
    ButtonsModule
  ],
  exports: [HashlistReportComponent],
  declarations: [HashlistReportComponent, ReportBuilderComponent]
})
export class ReportsModule {}
