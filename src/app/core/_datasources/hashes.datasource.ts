import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { Hash } from '../_models/hash.model';
import { ListResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class HashesDataSource extends BaseDataSource<Hash> {
  private _id = 0;
  private _dataType: string;

  setId(id: number): void {
    this._id = id;
  }

  setDataType(type: string): void {
    this._dataType = type;
  }

  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      maxResults: this.pageSize,
      startsAt: startAt,
      expand: 'hashlist,chunk'
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.ordering = order;
    }

    // Add additional params based on _dataType
    if (this._dataType === 'chunks') {
      params.filter = 'chunkId=' + this._id;
    } else if (this._dataType === 'tasks') {
      // Add params for tasks if needed
    } else if (this._dataType === 'hashlists') {
      params.filter = 'hashlistId=' + this._id;
    }

    const hashes$ = this.service.getAll(SERV.HASHES, params);

    this.subscriptions.push(
      hashes$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<Hash>) => {
          const rows: Hash[] = response.values;

          console.log(rows);

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
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
