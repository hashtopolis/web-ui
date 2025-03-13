import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { HashListFormat } from '../_constants/hashlist.config';
import { HashlistData, JHashlist } from '../_models/hashlist.model';
import {  ResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { JsonAPISerializer } from '../_services/api/serializer-service';

export class HashlistsDataSource extends BaseDataSource<JHashlist> {
  private isArchived = false;
  private _shashlistId = 0;

  setIsArchived(isArchived: boolean): void {
    this.isArchived = isArchived;
  }

  setSHashlistId(shashlistId: number): void {
    this._shashlistId = shashlistId;
  }

  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      maxResults: this.pageSize,
      startsAt: startAt,
      include: 'hashType,accessGroup',
      filter: `filter[isArchived__eq]=${this.isArchived}`
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.ordering = order;
    }

    let hashLists$;

    if (this._shashlistId) {
      hashLists$ = this.service.get(SERV.HASHLISTS, this._shashlistId, {
        include: 'hashlists,hashType'
      });
    } else {
      hashLists$ = this.service.getAll(SERV.HASHLISTS, params);
    }

    this.subscriptions.push(
      hashLists$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const serializer = new JsonAPISerializer();
          const responseData = { data: response.data, included: response.included };
          const hashlists = serializer.deserialize<JHashlist[]>(responseData);

          let rows: JHashlist[] = [];
          if (this._shashlistId) {
            rows = response['hashlists'];
          } else {
            hashlists.forEach((value) => {
              if (value.format !== HashListFormat.SUPERHASHLIST) {
                const hashlist = value;
                hashlist.hashTypeDescription = hashlist.hashType.description;
                hashlist.hashTypeId = hashlist.hashType.id;
                rows.push(hashlist);
              }
            });
          }

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            hashlists.length // TODO: This is incorrect because we exclude superhashlists
          );
          this.setData(rows);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
