import { BaseDataSource } from '@datasources/base.datasource';
import { JHash } from '@models/hash.model';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { FilterType } from '@models/request-params.model';
import { SERV } from '@services/main.config';
import { catchError, finalize, of } from 'rxjs';
import { ResponseWrapper } from '@models/response.model';

export class SearchHashDataSource extends BaseDataSource<JHash> {
  private _search: string[];

  setSearch(hashArray: string[]): void {
    if (hashArray && hashArray.length > 0) {
      this._search = [...hashArray[0]];
    }
  }

  loadAll(): void {
    this.loading = true;
    const result = [];

    this._search.forEach(hashToSearch => {
      const params = new RequestParamBuilder().addInclude('hashlist').addFilter({
        field: 'hash',
        operator: FilterType.EQUAL,
        value: hashToSearch,
      });

      this.subscriptions.push(
        this.service.getAll(SERV.HASHES, params.create())
          .pipe(
            catchError((error) => {
              console.error(`Error loading hash: ${hashToSearch}`, error);
              return of([]);
            }),
            finalize(() => {
              this.loading = false;
              this.setData(result);
              this.setPaginationConfig(
                this.pageSize,
                result.length,
                this.pageAfter,
                this.pageBefore,
                this.index
              );
            })
          )
          .subscribe((response: ResponseWrapper) => {
            const responseData = { data: response.data, included: response.included };
            const hashes = this.serializer.deserialize<JHash[]>(responseData);
            if (hashes[0]) {
              result.push(hashes[0]);
            } else {
              result.push({ hash: hashToSearch, isCracked: false });
            }
          })
      );
    })
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
