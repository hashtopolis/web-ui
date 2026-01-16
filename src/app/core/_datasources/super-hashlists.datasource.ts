import { HashListFormat } from '@constants/hashlist.config';
import { catchError, finalize, of } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';

import { JHashlist } from '@models/hashlist.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';

import { BaseDataSource } from '@datasources/base.datasource';

import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class SuperHashlistsDataSource extends BaseDataSource<JHashlist> {
  private isArchived = false;
  private _currentFilter: Filter = null;
  setIsArchived(isArchived: boolean): void {
    this.isArchived = isArchived;
  }
  loadAll(query?: Filter): void {
    this.loading = true;
    // Store the current filter if provided
    if (query) {
      this._currentFilter = query;
    }

    // Use stored filter if no new filter is provided
    const activeFilter = query || this._currentFilter;

    let params = new RequestParamBuilder().addInitial(this).addInclude('hashType').addInclude('hashlists').addFilter({
      field: 'format',
      operator: FilterType.EQUAL,
      value: HashListFormat.SUPERHASHLIST
    });
    params = this.applyFilterWithPaginationReset(params, activeFilter, query);

    // Create headers to skip error dialog for filter validation errors
    const httpOptions = { headers: new HttpHeaders({ 'X-Skip-Error-Dialog': 'true' }) };
    const hashLists$ = this.service.getAll(SERV.HASHLISTS, params.create(), httpOptions);

    this.subscriptions.push(
      hashLists$
        .pipe(
          catchError((error) => {
            this.handleFilterError(error);
            return of([]);
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const serializer = new JsonAPISerializer();
          const responseData = { data: response.data, included: response.included };
          const superHashlists = serializer.deserialize<JHashlist[]>(responseData);

          const rows: JHashlist[] = [];
          superHashlists.forEach((superHashlist) => {
            superHashlist.hashTypeDescription = superHashlist.hashType?.description;
            rows.push(superHashlist);
          });

          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(response.links.next).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(response.links.prev).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          this.setData(rows);
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
