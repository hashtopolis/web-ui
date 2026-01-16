import { catchError, firstValueFrom } from 'rxjs';

import { JHash } from '@models/hash.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class CracksDataSource extends BaseDataSource<JHash> {
  public length = 0;
  private _currentFilter: Filter = null;

  /**
   * Set table rows loaded from server
   */
  async loadAll(query?: Filter) {
    this.loading = true;
    try {
      const crackedHashes = await this.loadCrackedHashes(query);
      this.setData(crackedHashes);
    } catch (error) {
      console.error('Error loading data', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load cracked hashes from server
   * @return Promise of cracked hashes
   */
  async loadCrackedHashes(query?: Filter) {
    if (query) {
      this._currentFilter = query;
    }

    // Use stored filter if no new filter is provided
    const activeFilter = query || this._currentFilter;
    let params = new RequestParamBuilder().addInitial(this).addInclude('chunk').addFilter({
      field: 'isCracked',
      operator: FilterType.EQUAL,
      value: true
    });
    params = this.applyFilterWithPaginationReset(params, activeFilter, query);

    try {
      const response: ResponseWrapper = await firstValueFrom(
        this.service.getAll(SERV.HASHES, params.create()).pipe(
          catchError((error) => {
            this.handleFilterError(error);
            throw error;
          })
        )
      );
      const length = response.meta.page.total_elements;
      const nextLink = response.links.next;
      const prevLink = response.links.prev;
      const after = nextLink ? new URL(response.links.next).searchParams.get('page[after]') : null;
      const before = prevLink ? new URL(response.links.prev).searchParams.get('page[before]') : null;

      this.setPaginationConfig(this.pageSize, length, after, before, this.index);
      const serializer = new JsonAPISerializer();
      return serializer.deserialize<JHash[]>({ data: response.data, included: response.included });
    } catch {
      return [];
    }
  }

  /**
   * Load task from server
   * @param taskId ID of task
   * @return Promise of task
   */
  async loadTask(taskId: number) {
    try {
      const response = await firstValueFrom<ResponseWrapper>(
        this.service.get(SERV.TASKS, taskId).pipe(
          catchError((error) => {
            this.handleFilterError(error);
            throw error;
          })
        )
      );
      return new JsonAPISerializer().deserialize<JTask>({ data: response.data, included: response.included });
    } catch {
      return null;
    }
  }

  reload() {
    this.clearSelection();
    this.loadAll();
  }
  clearFilter(): void {
    this._currentFilter = null;
    this.setPaginationConfig(this.pageSize, undefined, undefined, undefined, 0);
    this.reload();
  }
}
