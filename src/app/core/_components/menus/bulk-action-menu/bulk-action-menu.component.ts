/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';

import { ContextMenuService } from '@services/context-menu/base/context-menu.service';

import { BaseMenuComponent } from '@components/menus/base-menu/base-menu.component';
import { DataType } from '@components/tables/ht-table/ht-table.models';

/**
 * Component representing the bulk action menu for various data types.
 */
@Component({
  selector: 'bulk-action-menu',
  templateUrl: './bulk-action-menu.component.html',
  standalone: false
})
export class BulkActionMenuComponent extends BaseMenuComponent implements OnInit {
  @Input() dataType: DataType;
  @Input() isArchived: boolean;
  @Input() contextMenuService: ContextMenuService;

  ngOnInit(): void {
    this.data = { isArchived: this.isArchived };
    this.loadMenu();
  }

  reload(): void {
    this.loadMenu();
  }

  private loadMenu(): void {
    if (this.contextMenuService) {
      this.contextMenuService.getBulkMenuItems().forEach((item) => {
        this.conditionallyAddMenuItem(item, this.data);
      });
    }
  }
}
