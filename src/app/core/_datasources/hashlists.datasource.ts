import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { HashListFormat } from '../_constants/hashlist.config';
import { HashlistData } from '../_models/hashlist.model';
import { IncludedAttributes, ListResponseWrapper } from '../_models/response.model';
import { Filter, RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class HashlistsDataSource extends BaseDataSource<HashlistData> {
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
      page: {
        size: this.pageSize,
        after: startAt
      },
      include: ['hashType','accessGroup'],
      filter: new Array<Filter>({field: 'isArchived', operator: 'eq', value: this.isArchived})
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.sort = [order];
    }

    let hashLists$;

    if (this._shashlistId) {
      hashLists$ = this.service.get(SERV.HASHLISTS, this._shashlistId, {
        include: ['hashlists','hashType']
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
        .subscribe((response: ListResponseWrapper<HashlistData>) => {
          let rows: HashlistData[] = [];
          if (this._shashlistId) {
            rows = response['hashlists'];
          } else {
            response.data.forEach((value: HashlistData) => {
              if (value.attributes.format !== HashListFormat.SUPERHASHLIST) {
                const hashlist: HashlistData = value;

                let hashlistId: number = value.attributes.hashTypeId;
                let includedHashType: IncludedAttributes = response.included.find((inc) => inc.type === "hashType" && inc.id === hashlistId)?.attributes;
                hashlist.attributes.hashTypeDescription = includedHashType.description;

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
