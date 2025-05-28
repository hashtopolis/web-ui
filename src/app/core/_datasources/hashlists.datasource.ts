import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { HashListFormat } from '../_constants/hashlist.config';
import { JHashlist } from '../_models/hashlist.model';
import { ResponseWrapper } from '../_models/response.model';
import { FilterType } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { JsonAPISerializer } from '../_services/api/serializer-service';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class HashlistsDataSource extends BaseDataSource<JHashlist> {
  private isArchived = false;
  private _shashlistId = 0;

  setIsArchived(isArchived: boolean): void {
    this.isArchived = isArchived;
  }

  setSHashlistId(shashlistId: number): void {
    this._shashlistId = shashlistId;
  }

  loadAll(): void {
    this.loading = true;

    let hashLists$;
    if (this._shashlistId) {
      const params = new RequestParamBuilder().addInclude('hashlists').addInclude('hashType').create();
      hashLists$ = this.service.get(SERV.HASHLISTS, this._shashlistId, params);
    } else {
      const params = new RequestParamBuilder().addInitial(this).addInclude('hashType').addInclude('accessGroup').addFilter({
        field: 'isArchived',
        operator: FilterType.EQUAL,
        value: this.isArchived
      }).create();
      hashLists$ = this.service.getAll(SERV.HASHLISTS, params);
    }

    this.subscriptions.push(
      hashLists$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const serializer = new JsonAPISerializer();
          const responseData = { data: response.data, included: response.included };
          const hashlists = serializer.deserialize<JHashlist[]>(responseData);

          let rows: JHashlist[] = [];
          if (this._shashlistId) {
            rows = response['hashlists'];
          } else {
            hashlists.forEach((value) => {
              if (value.format !== HashListFormat.SUPERHASHLIST) {
                const hashlist = value;
                hashlist.hashTypeDescription = hashlist.hashType.description;
                hashlist.hashTypeId = hashlist.hashType.id;
                rows.push(hashlist);
              }
            });
          }

          const length = response.meta.page.total_elements;

          this.setPaginationConfig(
            this.pageSize,
            length,// TODO: This is incorrect because we exclude superhashlists?
            this.pageAfter,
            this.pageBefore,
            this.index
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
