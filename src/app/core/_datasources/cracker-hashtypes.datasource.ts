import { HTTP_SKIP_ERROR_HEADER_CONFIG } from '@constants/http.config';
import { zHashTypeListResponse } from '@generated/api/zod';
import { EMPTY, catchError, finalize } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';

import { JHashtype } from '@models/hashtype.model';
import { CrackerBinaryId } from '@models/id.types';
import { Filter } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { RelationshipType, SERV, ServiceConfig } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

/**
 * Hashtypes of a cracker version, paged, sorted and filtered by the backend
 * (GET /ui/crackers/{id}/hashtypes, a hashcat version supports several hundred hashtypes).
 */
export class CrackerHashtypesDataSource extends BaseDataSource<JHashtype> {
  private _crackerBinaryId: CrackerBinaryId = 0;
  private _currentFilter: Filter | null = null;

  setCrackerBinaryId(crackerBinaryId: CrackerBinaryId): void {
    this._crackerBinaryId = crackerBinaryId;
  }

  loadAll(query?: Filter): void {
    this.loading = true;
    // Store the current filter if provided, reloads keep using it
    if (query) {
      this._currentFilter = query;
    }
    const activeFilter = query || this._currentFilter;
    let params = new RequestParamBuilder().addInitial(this);
    params = this.applyFilterWithPaginationReset(params, activeFilter, query);

    const httpOptions = { headers: new HttpHeaders(HTTP_SKIP_ERROR_HEADER_CONFIG) };
    this.subscriptions.push(
      this.service
        .getAll(this.relatedHashtypes(), params.create(), httpOptions)
        .pipe(
          catchError((error) => {
            this.handleFilterError(error);
            return EMPTY;
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const hashtypes: JHashtype[] = this.serializer.deserialize(response, zHashTypeListResponse);
          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          this.setData(hashtypes);
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

  /** Related resource route of the hashtypes of the cracker version */
  private relatedHashtypes(): ServiceConfig {
    return {
      URL: `${SERV.CRACKERS.URL}/${this._crackerBinaryId}/${RelationshipType.HASHTYPES}`,
      RESOURCE: SERV.HASHTYPES.RESOURCE
    };
  }
}
