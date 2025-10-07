import { catchError, finalize, of } from 'rxjs';

import { JHash } from '@models/hash.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class HashesDataSource extends BaseDataSource<JHash> {
  private _id = 0;
  private _dataType: string;

  setId(id: number): void {
    this._id = id;
  }

  setDataType(type: string): void {
    this._dataType = type;
  }

  loadAll(query?: Filter): void {
    this.loading = true;

    if (this._dataType === 'tasks') {
      const hashesService = this.service.ghelper(SERV.HELPER, 'getCracksOfTask?task=' + this._id);

      this.subscriptions.push(
        hashesService
          .pipe(
            catchError(() => of([])),
            finalize(() => (this.loading = false))
          )
          .subscribe((response: ResponseWrapper) => {
            const hashes = new JsonAPISerializer().deserialize<JHash[]>({
              data: response.data,
              included: response.included
            });

            this.setData(hashes);
          })
      );
    } else {
      const params = new RequestParamBuilder().addInitial(this).addInclude('hashlist').addInclude('chunk');
      if (query) {
        params.addFilter(query);
      }
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

            const length = response.meta.page.total_elements;
            const nextLink = response.links.next;
            const prevLink = response.links.prev;
            const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
            const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

            this.setPaginationConfig(this.pageSize, length, after, before, this.index);
            this.setData(hashes);
          })
      );
    }
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
