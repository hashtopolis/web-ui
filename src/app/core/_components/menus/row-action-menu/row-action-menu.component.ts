import { Component, Input, OnChanges } from '@angular/core';

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
export class RowActionMenuComponent extends BaseMenuComponent implements OnChanges {
  @Input() contextMenuService: ContextMenuService;
  @Input() disabledTooltip = 'No actions available';

  /** `disabled` input, widened to also cover "this row permits no action at all". */
  menuDisabled = false;

  /**
   * Rebuilt on every `data` change rather than once on init: views that track rows by id — the
   * card view does — keep the same menu instance across reloads, and the available actions depend
   * on the row (e.g. archive vs. unarchive).
   */
  ngOnChanges(): void {
    this.actionMenuItems = [];
    if (this.contextMenuService) {
      this.contextMenuService.getMenuItems().forEach((item) => {
        this.conditionallyAddMenuItem(item, this.data);
      });
    }
    this.menuDisabled = this.disabled || this.actionMenuItems.every((section) => !section?.length);
  }
}
