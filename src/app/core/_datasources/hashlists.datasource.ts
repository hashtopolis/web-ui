import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { HashListFormat } from '../_constants/hashlist.config';
import { Hashlist } from '../_models/hashlist.model';
import { ListResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class HashlistsDataSource extends BaseDataSource<Hashlist> {
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
      expand: 'hashType,accessGroup',
      filter: `isArchived=${this.isArchived}`
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.ordering = order;
    }

    let hashLists$;

    if (this._shashlistId) {
      hashLists$ = this.service.get(SERV.HASHLISTS, this._shashlistId, {
        expand: 'hashlists,hashType'
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
        .subscribe((response: ListResponseWrapper<Hashlist>) => {
          let rows: Hashlist[] = [];
          if (this._shashlistId) {
            rows = response['hashlists'];
          } else {
            response.values.forEach((value: Hashlist) => {
              if (value.format !== HashListFormat.SUPERHASHLIST) {
                const hashlist = value;

                hashlist.hashTypeDescription = hashlist.hashType.description;

                rows.push(hashlist);
              }
            });
          }

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total // TODO: This is incorrect because we exclude superhashlists
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
