import { catchError, finalize, of } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';

import { JHashlist } from '@models/hashlist.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

import { HashListFormat } from '@src/app/core/_constants/hashlist.config';

export class HashlistsDataSource extends BaseDataSource<JHashlist> {
  private isArchived = false;
  private superHashListID = 0;
  private _currentFilter: Filter = null;

  setIsArchived(isArchived: boolean): void {
    this.isArchived = isArchived;
    this.reset(true);
    this.pageAfter = null;
    this.pageBefore = null;
    this.index = 0;
  }

  setSuperHashListID(superHashListID: number): void {
    this.superHashListID = superHashListID;
  }
  loadAll(query?: Filter): void {
    this.loading = true;
    // Store the current filter if provided
    if (query) {
      this._currentFilter = query;
    }

    // Use stored filter if no new filter is provided
    const activeFilter = query || this._currentFilter;

    // Create headers to skip error dialog for filter validation errors
    const httpOptions = { headers: new HttpHeaders({ 'X-Skip-Error-Dialog': 'true' }) };

    if (this.superHashListID) {
      let params = new RequestParamBuilder().addInclude('hashlists').addInclude('hashType');
      params = this.applyFilterWithPaginationReset(params, activeFilter, query);
      this.subscriptions.push(
        this.service
          .get(SERV.HASHLISTS, this.superHashListID, params.create(), httpOptions)
          .pipe(
            catchError((error) => {
              this.handleFilterError(error);
              return of(null);
            }),
            finalize(() => (this.loading = false))
          )
          .subscribe((response: ResponseWrapper | null) => {
            if (!response) {
              return; // Don't update data if there was an error
            }
            const responseData = { data: response.data, included: response.included };
            const superHashList: JHashlist = this.serializer.deserialize<JHashlist>({
              data: responseData.data,
              included: responseData.included
            });
            this.setData(superHashList.hashlists);
            const length = response.meta.page.total_elements;
            const nextLink = response.links.next;
            const prevLink = response.links.prev;
            const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
            const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

            this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          })
      );
    } else {
      const params = new RequestParamBuilder()
        .addInitial(this)
        .addInclude('hashType')
        .addInclude('accessGroup')
        .addFilter({
          field: 'isArchived',
          operator: FilterType.EQUAL,
          value: this.isArchived
        })
        .addFilter({ field: 'format', operator: FilterType.NOTIN, value: [HashListFormat.SUPERHASHLIST] });
      if (query) {
        params.addFilter(query);
      }

      this.subscriptions.push(
        this.service
          .getAll(SERV.HASHLISTS, params.create(), httpOptions)
          .pipe(
            catchError((error) => {
              this.handleFilterError(error);
              return of(null);
            }),
            finalize(() => (this.loading = false))
          )
          .subscribe((response: ResponseWrapper | null) => {
            if (!response) {
              return; // Don't update data if there was an error
            }
            const responseData = { data: response.data, included: response.included };
            const deserialized = this.serializer.deserialize<JHashlist[]>(responseData);
            if (!deserialized || !Array.isArray(deserialized)) {
              return; // Safety check: if deserialize returns null or non-array, exit
            }
            const hashlists = deserialized.map((element) => {
              if (element.hashType) {
                element.hashTypeDescription = element.hashType.description;
                element.hashTypeId = element.hashType.id;
              } else {
                element.hashTypeDescription = '';
              }
              return element;
            });

            const length = response.meta.page.total_elements;
            const nextLink = response.links.next;
            const prevLink = response.links.prev;
            const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
            const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

            this.setPaginationConfig(this.pageSize, length, after, before, this.index);
            this.setData(hashlists);
          })
      );
    }
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
