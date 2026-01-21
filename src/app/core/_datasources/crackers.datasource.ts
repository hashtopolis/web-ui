import { catchError, finalize, of } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';

import { JCrackerBinaryType } from '@models/cracker-binary.model';
import { Filter } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';

import { BaseDataSource } from '@datasources/base.datasource';

import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class CrackersDataSource extends BaseDataSource<JCrackerBinaryType> {
  private _currentFilter: Filter = null;

  loadAll(query?: Filter): void {
    this.loading = true;
    if (query) {
      this._currentFilter = query;
    }
    // Use stored filter if no new filter is provided
    const activeFilter = query || this._currentFilter;
    let params = new RequestParamBuilder().addInitial(this).addInclude('crackerVersions');

    params = this.applyFilterWithPaginationReset(params, activeFilter, query);

    // Create headers to skip error dialog for filter validation errors
    const httpOptions = { headers: new HttpHeaders({ 'X-Skip-Error-Dialog': 'true' }) };
    const crackers$ = this.service.getAll(SERV.CRACKERS_TYPES, params.create(), httpOptions);

    this.subscriptions.push(
      crackers$
        .pipe(
          catchError((error) => {
            this.handleFilterError(error);
            return of([]);
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const responseData = { data: response.data, included: response.included };
          const crackers = this.serializer.deserialize<JCrackerBinaryType[]>(responseData);

          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          this.setData(crackers);
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
