import { zApiTokenListResponse } from '@generated/api/zod';
import { EMPTY, catchError, finalize } from 'rxjs';

import { ApiTokenStatus, JApiToken, computeApiTokenStatus } from '@models/api-token.model';
import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

/**
 * Each row is annotated with two derived boolean flags so the context-menu can
 * gate Revoke (active only) and Delete (expired only) — the menu's
 * ContextMenuCondition machinery only supports boolean keys.
 */
type ApiTokenRow = JApiToken & {
  isActive: boolean;
  isExpired: boolean;
};

export class ApiTokensDataSource extends BaseDataSource<JApiToken> {
  loadAll(): void {
    this.loading = true;

    const params = new RequestParamBuilder().addInitial(this).addInclude('user');
    const tokens$ = this.service.getAll(SERV.API_TOKENS, params.create());

    this.subscriptions.push(
      tokens$
        .pipe(
          catchError((error) => {
            this.handleFilterError(error);
            return EMPTY;
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const tokens: JApiToken[] = this.serializer.deserialize(response, zApiTokenListResponse, {
            include: ['user']
          });

          const annotated: ApiTokenRow[] = tokens.map((t) => {
            const status = computeApiTokenStatus(t);
            return {
              ...t,
              isActive: status === ApiTokenStatus.ACTIVE,
              isExpired: status === ApiTokenStatus.EXPIRED
            };
          });

          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          this.setData(annotated);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
