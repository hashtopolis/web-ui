import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ResponseWrapper } from '../_models/response.model';
import { JNotification } from '../_models/notification.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

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

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            notifications.length
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
