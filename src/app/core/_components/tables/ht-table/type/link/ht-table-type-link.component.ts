import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { BaseModel } from '@models/base.model';

import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';

@Component({
  selector: 'app-ht-table-link',
  templateUrl: './ht-table-type-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class HTTableTypeLinkComponent {
  @Input() element: BaseModel;
  @Input() tableColumn: HTTableColumn;

  @Output() linkClicked = new EventEmitter();

  onLinkClicked() {
    this.linkClicked.emit();
  }

  /**
   * TrackBy function for HTTableRouterLink items in an ngFor loop.
   *
   * This function helps Angular identify each item uniquely to optimize DOM updates
   * by avoiding re-rendering of unchanged items.
   *
   * Since HTTableRouterLink does not have a unique `id`, this function uses the
   * joined `routerLink` array as a unique key. If `routerLink` is empty, it falls back
   * to the `label`. If neither is available, it returns the index as a last resort.
   *
   * @param index - The index of the item in the iterable.
   * @param item - The HTTableRouterLink item.
   * @returns A unique identifier for the item (string, number, or index).
   */
  trackByFn(index: number, item: HTTableRouterLink): string | number {
    if (item.routerLink && item.routerLink.length) {
      return item.routerLink.join('-');
    }
    if (item.label) {
      return item.label;
    }
    return index;
  }
}
