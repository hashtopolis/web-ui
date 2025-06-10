/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
import { ExportMenuAction, ExportMenuLabel } from './export-menu.constants';

import { BaseMenuComponent } from '../base-menu/base-menu.component';

@Component({
    selector: 'export-menu',
    templateUrl: './export-menu.component.html',
    standalone: false
})
export class ExportMenuComponent extends BaseMenuComponent implements OnInit {
  ngOnInit(): void {
    this.actionMenuItems[0] = [
      {
        label: ExportMenuLabel.EXCEL,
        action: ExportMenuAction.EXCEL,
        icon: 'file_download'
      },
      {
        label: ExportMenuLabel.CSV,
        action: ExportMenuAction.CSV,
        icon: 'file_download'
      },
      // @todo implement print export
      //{
      //  label: ExportMenuLabel.PRINT,
      //  action: ExportMenuAction.PRINT,
      //  icon: 'print',
      //},
      {
        label: ExportMenuLabel.COPY,
        action: ExportMenuAction.COPY,
        icon: 'content_copy'
      }
    ];
  }
}
