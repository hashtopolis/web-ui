/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  InputFieldsTableCol,
  InputFieldsTableColumnLabel
} from './hashlists-table.constants';
import { HashlistReportDataSource } from '../../datasources/hashlists.datasource';
import { BaseReportComponent } from '../base-report/base-report.component';
import { ReportTableColumn } from '../report-builder/report.models';

@Component({
    selector: 'hashlist-report',
    templateUrl: './hashlist-report.component.html',
    standalone: false
})
export class HashlistReportComponent
  extends BaseReportComponent
  implements OnInit, OnDestroy
{
  @Input() hashlistId = 0;

  dataSource: HashlistReportDataSource;
  reportStructure: any[] = [];

  ngOnInit(): void {
    this.dataSource = new HashlistReportDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
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
