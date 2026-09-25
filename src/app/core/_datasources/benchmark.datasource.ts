import { HTTP_SKIP_ERROR_HEADER_CONFIG } from '@constants/http.config';
import { zBenchmarkListResponse } from '@generated/api/zod';
import { EMPTY, catchError, finalize } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';

import { JBenchmark } from '@models/benchmark.model';
import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';

import { BaseDataSource } from '@datasources/base.datasource';

import { Filter } from '@src/app/core/_models/request-params.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class BenchmarkDataSource extends BaseDataSource<JBenchmark> {
  private _currentFilter: Filter | null = null;

  loadAll(query?: Filter): void {
    this.loading = true;
    if (query) {
      this._currentFilter = query;
    }

    const activeFilter = query || this._currentFilter;
    let params = new RequestParamBuilder().addInitial(this);
    params = this.applyFilterWithPaginationReset(params, activeFilter, query);

    const httpOptions = { headers: new HttpHeaders(HTTP_SKIP_ERROR_HEADER_CONFIG) };
    const benchmarks$ = this.service.getAll(SERV.BENCHMARKS, params.create(), httpOptions);
    this.subscriptions.push(
      benchmarks$
        .pipe(
          catchError((error) => {
            this.handleFilterError(error);
            return EMPTY;
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const benchmarks: JBenchmark[] = this.serializer.deserialize(response, zBenchmarkListResponse);
          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          this.setData(benchmarks);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }

  clearFilter(): void {
    this._currentFilter = null;
    this.setPaginationConfig(this.pageSize, undefined, undefined, undefined, 0);
    this.reload();
  }
}
