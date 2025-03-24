import { catchError, finalize, of } from 'rxjs';
import { BaseDataSource } from './base.datasource';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { FilterType } from '../_models/request-params.model';
import { JHash } from '../_models/hash.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class SearchHashDataSource extends BaseDataSource<JHash> {
  private _search: string[];

  setSearch(hashArray: string[]): void {
    this._search = hashArray;
  }

  loadAll(): void {
    this.loading = true;

    const arr = [];

    for (let i = 0; i < this._search.length; i++) {
      const params = new RequestParamBuilder().addInitial(this).addInclude('hashlist').addFilter({
        field: 'hash',
        operator: FilterType.EQUAL,
        value: this._search[i]
      }).create();

      const hashs$ = this.service.getAll(SERV.HASHES, params);

      this.subscriptions.push(
        hashs$
          .pipe(
            catchError((error) => {
              console.error(`Error loading hash: ${this._search[i]}`, error);
              return of([]);
            }),
            finalize(() => {
              if (i === this._search.length - 1) {
                this.loading = false;
                this.setData(arr);
              }
            })
          )
          .subscribe((response: ResponseWrapper) => {

            const responseData = { data: response.data, included: response.included };
            const hashes = this.serializer.deserialize<JHash[]>(responseData);

            // const hashs: any[] = response.values;

            if (hashes[0]) {
              arr.push(hashes[0]);
            } else {
              arr.push({ hash: this._search[i], isCracked: 3 });
            }
            this.setPaginationConfig(
              this.pageSize,
              this.currentPage,
              hashes.length
            );
            this.setData(arr);
          })
      );
    }
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
