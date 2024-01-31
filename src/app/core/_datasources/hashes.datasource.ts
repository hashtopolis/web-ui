import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { HashListFormat } from '../_constants/hashlist.config';
import { Hashlist } from '../_models/hashlist.model';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { Hash } from '../_models/hash.model';

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

    const params: any = {
      maxResults: this.pageSize,
      startAt: this.currentPage * this.pageSize,
      expand: 'hashlist,chunk'
    };

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
