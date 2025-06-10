import { catchError, finalize, of } from 'rxjs';

import { JHashlist } from '@models/hashlist.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

import { HashListFormat } from '@src/app/core/_constants/hashlist.config';

export class HashlistsDataSource extends BaseDataSource<JHashlist> {
  private isArchived = false;
  private superHashListID = 0;

  setIsArchived(isArchived: boolean): void {
    this.isArchived = isArchived;
  }

  setSuperHashListID(superHashListID: number): void {
    this.superHashListID = superHashListID;
  }

  loadAll(): void {
    this.loading = true;

    if (this.superHashListID) {
      const params = new RequestParamBuilder().addInclude('hashlists').addInclude('hashType').create();
      this.subscriptions.push(
        this.service
          .get(SERV.HASHLISTS, this.superHashListID, params)
          .pipe(
            catchError(() => of([])),
            finalize(() => (this.loading = false))
          )
          .subscribe((response: ResponseWrapper) => {
            const responseData = { data: response.data, included: response.included };
            const superHashList: JHashlist = this.serializer.deserialize<JHashlist>({
              data: responseData.data,
              included: responseData.included
            });
            this.setData(superHashList.hashlists);
            const length = response.meta.page.total_elements;
            this.setPaginationConfig(this.pageSize, length, this.pageAfter, this.pageBefore, this.index);
          })
      );
    } else {
      const params = new RequestParamBuilder()
        .addInitial(this)
        .addInclude('hashType')
        .addInclude('accessGroup')
        .addFilter({
          field: 'isArchived',
          operator: FilterType.EQUAL,
          value: this.isArchived
        })
        .addFilter({ field: 'format', operator: FilterType.NOTIN, value: [HashListFormat.SUPERHASHLIST] })
        .create();

      this.subscriptions.push(
        this.service
          .getAll(SERV.HASHLISTS, params)
          .pipe(
            catchError(() => of([])),
            finalize(() => (this.loading = false))
          )
          .subscribe((response: ResponseWrapper) => {
            const responseData = { data: response.data, included: response.included };
            const hashlists = this.serializer.deserialize<JHashlist[]>(responseData).map((element) => {
              element.hashTypeDescription = element.hashType.description;
              element.hashTypeId = element.hashType.id;
              return element;
            });

            const length = response.meta.page.total_elements;
            this.setPaginationConfig(this.pageSize, length, this.pageAfter, this.pageBefore, this.index);
            this.setData(hashlists);
          })
      );
    }
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
