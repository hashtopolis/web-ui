import { Component, Input, OnInit } from '@angular/core';

import { HashlistReportDataSource } from '@src/app/shared/report-builder/datasources/hashlists.datasource';
import { BaseReportComponent } from '@src/app/shared/report-builder/reports/base-report/base-report.component';

@Component({
  selector: 'hashlist-report',
  templateUrl: './hashlist-report.component.html',
  standalone: false
})
export class HashlistReportComponent extends BaseReportComponent implements OnInit {
  @Input() hashlistId = 0;

  dataSource: HashlistReportDataSource;

  ngOnInit(): void {
    this.dataSource = new HashlistReportDataSource(this.cdr, this.gs, this.uiService);
    if (this.hashlistId) {
      this.dataSource.setHashlistId(this.hashlistId);
    }
    this.dataSource.reload();
  }
}
