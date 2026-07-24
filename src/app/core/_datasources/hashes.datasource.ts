import { zHashListResponse, zHashlistResponse } from '@generated/api/zod';
import { EMPTY, Observable, catchError, finalize, of, switchMap } from 'rxjs';
import { z } from 'zod';

import { JHash } from '@models/hash.model';
import { JHashlist } from '@models/hashlist.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

import { HashListFormat } from '@src/app/core/_constants/hashlist.config';

const crackedFilterSchema = z.enum(['cracked', 'uncracked']);

export class HashesDataSource extends BaseDataSource<JHash> {
  private _id = 0;
  private _dataType: string;
  private _filterparam: string;

  setId(id: number): void {
    this._id = id;
  }

  setDataType(type: string): void {
    this._dataType = type;
  }

  setFilterParam(filterparam: string): void {
    this._filterparam = filterparam;
  }

  loadAll(query?: Filter): void {
    this.loading = true;

    if (this._dataType === 'tasks') {
      const hashesService = this.service.ghelper(SERV.HELPER, 'getCracksOfTask', { task: this._id });

      this.subscriptions.push(
        hashesService
          .pipe(
            catchError(() => EMPTY),
            finalize(() => (this.loading = false))
          )
          .subscribe((response: ResponseWrapper) => {
            const hashes: JHash[] = this.serializer.deserialize(response, zHashListResponse);

            this.setData(hashes);
          })
      );
      return;
    }

    if (this._dataType === 'hashlists') {
      this.loadHashlistHashes(query);
      return;
    }

    const params = new RequestParamBuilder().addInitial(this).addInclude('hashlist').addInclude('chunk');
    if (query) {
      params.addFilter(query);
    }
    if (this._dataType === 'chunks') {
      params.addFilter({ field: 'chunkId', operator: FilterType.EQUAL, value: this._id });
    }

    this.subscriptions.push(
      this.service
        .getAll(SERV.HASHES, params.create())
        .pipe(
          catchError(() => EMPTY),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => this.setHashesData(response))
    );
  }

  /**
   * A superhashlist owns no hashes directly — they belong to its member hashlists. So resolve the record
   * first: for a superhashlist filter the hashes by `hashlistId IN <member ids>`, otherwise by the id itself.
   */
  private loadHashlistHashes(query?: Filter): void {
    const hashlistParams = new RequestParamBuilder().addInclude('hashlists');

    this.subscriptions.push(
      this.service
        .get(SERV.HASHLISTS, this._id, hashlistParams.create())
        .pipe(
          switchMap((response: ResponseWrapper): Observable<ResponseWrapper | null> => {
            const hashlist: JHashlist = this.serializer.deserialize(response, zHashlistResponse);
            const params = new RequestParamBuilder().addInitial(this).addInclude('hashlist').addInclude('chunk');
            if (query) {
              params.addFilter(query);
            }

            if (hashlist.format === HashListFormat.SUPERHASHLIST) {
              const memberIds = (hashlist.hashlists ?? []).map((member) => member.id);
              if (memberIds.length === 0) {
                return of(null);
              }
              params.addFilter({ field: 'hashlistId', operator: FilterType.IN, value: memberIds });
            } else {
              params.addFilter({ field: 'hashlistId', operator: FilterType.EQUAL, value: this._id });
            }

            const crackedFilter = crackedFilterSchema.safeParse(this._filterparam);
            if (crackedFilter.success) {
              params.addFilter({
                field: 'isCracked',
                operator: FilterType.EQUAL,
                value: crackedFilter.data === 'cracked'
              });
            }

            return this.service.getAll(SERV.HASHES, params.create());
          }),
          catchError(() => EMPTY),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper | null) => {
          if (!response) {
            this.setPaginationConfig(this.pageSize, 0, null, null, this.index);
            this.setData([]);
            return;
          }
          this.setHashesData(response);
        })
    );
  }

  private setHashesData(response: ResponseWrapper): void {
    const hashes: JHash[] = this.serializer.deserialize(response, zHashListResponse);

    const length = response.meta.page.total_elements;
    const nextLink = response.links.next;
    const prevLink = response.links.prev;
    const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
    const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

    this.setPaginationConfig(this.pageSize, length, after, before, this.index);
    this.setData(hashes);
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
