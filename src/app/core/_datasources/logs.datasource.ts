import { catchError, finalize, of } from 'rxjs';

import { JLog } from '@models/log.model';
import { Filter } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';

import { BaseDataSource } from '@datasources/base.datasource';

import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class LogsDataSource extends BaseDataSource<JLog> {
  private _currentFilter: Filter = null;

  loadAll(query?: Filter): void {
    this.loading = true;

    //ToDo: Reactivate sorting
    // this.sortingColumn.isSortable = false;
    // Store the current filter if provided
    if (query) {
      this._currentFilter = query;
    }

    // Use stored filter if no new filter is provided
    const activeFilter = query || this._currentFilter;
    let params = new RequestParamBuilder().addInitial(this);
    params = this.applyFilterWithPaginationReset(params, activeFilter, query) as RequestParamBuilder;

    const logs$ = this.service.getAll(SERV.LOGS, params.create());

    this.subscriptions.push(
      logs$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const responseData = { data: response.data, included: response.included };
          const logs = this.serializer.deserialize<JLog[]>(responseData);
          /* 
            this causes an infinite loop when searching im not sure what is the purpose of it since no other load all has it 
          */
          /*           if (this.currentPage * this.pageSize >= logs.length) {
            this.currentPage = 0;
            this.loadAll();
            return;
          } */

          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(response.links.next).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(response.links.prev).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          this.setData(logs);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
  clearFilter(): void {
    this._currentFilter = null;
    this.setPaginationConfig(this.pageSize, undefined, undefined, undefined, 0);
    this.reload();
  }
}
