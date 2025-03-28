import { catchError, finalize, of } from 'rxjs';

import { FilterType } from '@models/request-params.model';
import { JHash } from '@models/hash.model';
import { ResponseWrapper } from '@models/response.model';

import { BaseDataSource } from '@datasources/base.datasource';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { SERV } from '@services/main.config';

export class HashesDataSource extends BaseDataSource<JHash> {
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
        .subscribe((response: ResponseWrapper) => {
          const hashes = new JsonAPISerializer().deserialize<JHash[]>({
            data: response.data,
            included: response.included
          });

          this.setPaginationConfig(this.pageSize, this.currentPage, hashes.length);
          this.setData(hashes);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
