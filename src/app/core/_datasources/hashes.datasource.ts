import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { Hash } from '../_models/hash.model';
import { ListResponseWrapper } from '../_models/response.model';
import { FilterType } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

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
    const params = new RequestParamBuilder().addInitial(this).addInclude('hashlist').addInclude('chunk');

    if (this._dataType === 'chunks') {
      params.addFilter({ field: 'chunkId', operator: FilterType.EQUAL, value: this._id });
    } else if (this._dataType === 'hashlists') {
      params.addFilter({ field: 'hashlistId', operator: FilterType.EQUAL, value: this._id });
    }

    const hashes$ = this.service.getAll(SERV.HASHES, params.create());

    this.subscriptions.push(
      hashes$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<Hash>) => {
          const rows: Hash[] = response.values;

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
