import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { HashlistReportDataSource } from '@src/app/shared/report-builder/datasources/hashlists.datasource';
import { BaseReportComponent } from '@src/app/shared/report-builder/reports/base-report/base-report.component';
import { ReportSection } from '@src/app/shared/report-builder/reports/report-builder/report.models';

@Component({
  selector: 'hashlist-report',
  templateUrl: './hashlist-report.component.html',
  standalone: false
})
export class HashlistReportComponent extends BaseReportComponent implements OnInit, OnDestroy {
  @Input() hashlistId = 0;

  dataSource: HashlistReportDataSource;
  reportStructure: ReportSection[] = [];

  ngOnInit(): void {
    this.dataSource = new HashlistReportDataSource(this.cdr, this.gs, this.uiService);
    if (this.hashlistId) {
      this.dataSource.setHashlistId(this.hashlistId);
    }
    this.dataSource.reload();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
