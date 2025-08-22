import { HashListFormat } from '@constants/hashlist.config';
import { catchError, finalize, of } from 'rxjs';

import { JHashlist } from '@models/hashlist.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { IParamBuilder } from '@services/params/builder-types.service';

import { BaseDataSource } from '@datasources/base.datasource';

import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class SuperHashlistsDataSource extends BaseDataSource<JHashlist> {
  private isArchived = false;
  private _currentFilter: Filter = null;
  setIsArchived(isArchived: boolean): void {
    this.isArchived = isArchived;
  }
  private applyFilterWithPaginationReset(params: IParamBuilder, activeFilter: Filter, query?: Filter): IParamBuilder {
    if (activeFilter?.value && activeFilter.value.toString().length > 0) {
      // Reset pagination only when filter changes (not during pagination)
      if (query && query.value) {
        console.log('Filter changed, resetting pagination');
        this.setPaginationConfig(this.pageSize, undefined, undefined, undefined, 0);
        params.setPageAfter(undefined);
        params.setPageBefore(undefined);
      }

      params.addFilter(activeFilter);
    }
    return params;
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

    const hashLists$ = this.service.getAll(SERV.HASHLISTS, params.create());

    this.subscriptions.push(
      hashLists$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const serializer = new JsonAPISerializer();
          const responseData = { data: response.data, included: response.included };
          const superHashlists = serializer.deserialize<JHashlist[]>(responseData);

          const rows: JHashlist[] = [];
          superHashlists.forEach((value) => {
            const superHashlist = value;
            superHashlist.hashTypeDescription = superHashlist.hashType.description;
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
