/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';

import { ContextMenuService } from '@services/context-menu/base/context-menu.service';

import { BaseMenuComponent } from '@components/menus/base-menu/base-menu.component';

/**
 * Component representing the row action menu for various data types.
 */
@Component({
  selector: 'row-action-menu',
  templateUrl: './row-action-menu.component.html',
  standalone: false
})
export class RowActionMenuComponent extends BaseMenuComponent implements OnInit {
  @Input() contextMenuService: ContextMenuService;

  ngOnInit(): void {
    if (this.contextMenuService) {
      this.contextMenuService.getMenuItems().forEach((item) => {
        this.conditionallyAddMenuItem(item, this.data);
      });
    }
  }
}
