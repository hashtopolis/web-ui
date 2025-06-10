import { catchError, finalize, of } from 'rxjs';

import { JHash } from '@models/hash.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTaskWrapper } from '@models/task-wrapper.model';

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

  loadAll(): void {
    this.loading = true;

    if (this._dataType === 'tasks') {
      const paramsTaskwrapper = new RequestParamBuilder().addInitial(this).addInclude('tasks');

      const taskwrapperService = this.service.get(SERV.TASKS_WRAPPER, this._id, paramsTaskwrapper.create());

      this.subscriptions.push(
        taskwrapperService
          .pipe(
            catchError(() => of([])),
            finalize(() => (this.loading = false))
          )
          .subscribe((response: ResponseWrapper) => {
            const taskwrapper = new JsonAPISerializer().deserialize<JTaskWrapper>({
              data: response.data,
              included: response.included
            });

            const hashlistId = taskwrapper.hashlistId;

            const paramsHashlist = new RequestParamBuilder()
              .addInitial(this)
              .addFilter({ field: 'hashlistId', operator: FilterType.EQUAL, value: hashlistId });

            const hashlistService = this.service.getAll(SERV.HASHES, paramsHashlist.create());

            this.subscriptions.push(
              hashlistService
                .pipe(
                  catchError(() => of([])),
                  finalize(() => (this.loading = false))
                )
                .subscribe((responseHash: ResponseWrapper) => {
                  const hashes = new JsonAPISerializer().deserialize<JHash[]>({
                    data: responseHash.data,
                    included: responseHash.included
                  });

                  const length = response.meta.page.total_elements;

                  this.setPaginationConfig(
                    this.pageSize,
                    length,
                    this.pageAfter,
                    this.pageBefore,
                    this.index
                  );
                  this.setData(hashes);
                })
            );
          })
      );
    } else {
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

            const length = response.meta.page.total_elements;

            this.setPaginationConfig(
              this.pageSize,
              length,
              this.pageAfter,
              this.pageBefore,
              this.index
            );
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
