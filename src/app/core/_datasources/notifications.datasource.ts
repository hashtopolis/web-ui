import { catchError, finalize, of } from 'rxjs';

import { JNotification } from '@models/notification.model';
import { ResponseWrapper } from '@models/response.model';

import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { SERV } from '@services/main.config';

import { BaseDataSource } from '@datasources/base.datasource';

export class NotificationsDataSource extends BaseDataSource<JNotification> {
  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).create();
    const notifications$ = this.service.getAll(SERV.NOTIFICATIONS, params);

    this.subscriptions.push(
      notifications$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const responseData = { data: response.data, included: response.included };
          const notifications = this.serializer.deserialize<JNotification[]>(responseData);

          const length = response.meta.page.total_elements;

          this.setPaginationConfig(
            this.pageSize,
            length,
            this.pageAfter,
            this.pageBefore,
            this.index
          );
          this.setData(notifications);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
