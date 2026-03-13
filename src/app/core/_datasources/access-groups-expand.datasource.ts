import { catchError, finalize, of } from 'rxjs';

import { JAccessGroup } from '@models/access-group.model';
import { JAgent } from '@models/agent.model';
import { ResponseWrapper } from '@models/response.model';
import { JUser } from '@models/user.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { BaseDataSource } from '@datasources/base.datasource';

export class AccessGroupsExpandDataSource extends BaseDataSource<JUser | JAgent> {
  private _accessgroupId = 0;
  private _include = '';
  private _activeFilterValue = '';
  private _activeFilterColumn: HTTableColumn | null = null;

  setAccessGroupId(accessgroupId: number) {
    this._accessgroupId = accessgroupId;
  }

  setAccessGroupExpand(include: string) {
    this._include = include;
  }

  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInclude(this._include).create();

    const accessGroup$ = this.service.get(SERV.ACCESS_GROUPS, this._accessgroupId, params);

    this.subscriptions.push(
      accessGroup$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const accessGroup = new JsonAPISerializer().deserialize<JAccessGroup>({
            data: response.data,
            included: response.included
          });
          this.originalData = accessGroup[this._include] || [];
          this.applyClientFilter(this._activeFilterValue, this._activeFilterColumn);
        })
    );
  }

  /**
   * Overrides the base client filter to persist the active filter state so that
   * reload() can re-apply it without a network request. Pagination reset and
   * sorting are handled by the base implementation.
   *
   * @param filterValue - The search string. Empty string clears the filter.
   * @param selectedColumn - The column to filter on. Null searches all fields.
   */
  override applyClientFilter(filterValue: string, selectedColumn: HTTableColumn | null): void {
    this._activeFilterValue = filterValue || '';
    if (selectedColumn !== undefined) {
      this._activeFilterColumn = selectedColumn;
    }
    super.applyClientFilter(this._activeFilterValue, this._activeFilterColumn);
  }

  getData(): (JUser | JAgent)[] {
    return this.getOriginalData();
  }

  override reload(): void {
    this.clearSelection();
    if (this.originalData.length > 0) {
      this.applyClientFilter(this._activeFilterValue, this._activeFilterColumn);
    } else {
      this.loadAll();
    }
  }
}
