// typescript
import { firstValueFrom } from 'rxjs';

import { JPretask } from '@models/pretask.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JSuperTask } from '@models/supertask.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { IParamBuilder } from '@services/params/builder-types.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class PreTasksDataSource extends BaseDataSource<JPretask> {
  private _superTaskId = 0;
  private _reverseQuery = false;
  private _currentFilter: Filter = null;

  /**
   * Set the supertask ID to filter pre tasks for
   * @param superTaskId
   */
  setSuperTaskId(superTaskId: number): void {
    this._superTaskId = superTaskId;
  }

  /**
   * Set whether to reverse the query (NOT IN)
   * @param value
   */
  setReverseQuery(value: boolean): void {
    this._reverseQuery = value;
  }

  /**
   * Load all pre tasks with optional filtering
   * @param query
   */
  async loadAll(query?: Filter): Promise<void> {
    this.loading = true;

    // Store the current filter if provided
    if (query) {
      this._currentFilter = query;
    }

    // Use stored filter if no new filter is provided
    const activeFilter = query || this._currentFilter;

    try {
      if (this._superTaskId === 0) {
        let params: IParamBuilder = new RequestParamBuilder().addInitial(this).addInclude('pretaskFiles');
        params = this.applyFilterWithPaginationReset(params, activeFilter, query);
        const pretasks = await this.loadPretasks(params.create());
        this.setData(pretasks);
      } else {
        let params: IParamBuilder = new RequestParamBuilder().addInitial(this).addInclude('pretasks');
        params = this.applyFilterWithPaginationReset(params, activeFilter, query);

        const supertask = await this.loadSupertask(this._superTaskId, params.create());
        const superTaskPreTaskIds = (supertask.pretasks || []).map((p) => p.id);

        if (superTaskPreTaskIds && superTaskPreTaskIds.length > 0) {
          const pretaskFiles = await this.loadPretaskFiles(superTaskPreTaskIds);
          this.setData(pretaskFiles);
        } else {
          // No pretasks assigned to the supertask.
          // If reverseQuery (NOTIN) is requested then NOTIN empty set === all pretasks.
          if (this._reverseQuery) {
            let paramsAll: IParamBuilder = new RequestParamBuilder().addInitial(this).addInclude('pretaskFiles');
            paramsAll = this.applyFilterWithPaginationReset(paramsAll, activeFilter, query);
            const pretasks = await this.loadPretasks(paramsAll.create());
            this.setData(pretasks);
          } else {
            // No assigned pretasks and not reverse query -> empty result set
            this.setData([]);
            // ensure pagination is reset for empty result
            this.setPaginationConfig(this.pageSize, 0, undefined, undefined, 0);
          }
        }
      }
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load pretasks with given parameters
   * @param params Request parameters
   * @private
   */
  private async loadPretasks(params: RequestParams): Promise<JPretask[]> {
    const response = await firstValueFrom<ResponseWrapper>(this.service.getAll(SERV.PRETASKS, params));

    const length = response.meta.page.total_elements;
    const nextLink = response.links.next;
    const prevLink = response.links.prev;
    const after = nextLink ? new URL(response.links.next).searchParams.get('page[after]') : null;
    const before = prevLink ? new URL(response.links.prev).searchParams.get('page[before]') : null;

    this.setPaginationConfig(this.pageSize, length, after, before, this.index);
    const responseData = { data: response.data, included: response.included };
    return this.serializer.deserialize<JPretask[]>(responseData);
  }

  private async loadSupertask(superTaskId: number, params: RequestParams): Promise<JSuperTask> {
    const response = await firstValueFrom<ResponseWrapper>(this.service.get(SERV.SUPER_TASKS, superTaskId, params));

    const responseData = { data: response.data, included: response.included };
    return this.serializer.deserialize<JSuperTask>(responseData);
  }

  /**
   * Load pretask files for given pretask IDs
   * @param pretaskIds
   * @private
   */
  private async loadPretaskFiles(pretaskIds: number[]): Promise<JPretask[]> {
    const filterOperator = this._reverseQuery ? FilterType.NOTIN : FilterType.IN;
    if (pretaskIds && pretaskIds.length > 0) {
      const paramsPretaskFiles = new RequestParamBuilder()
        .addInitial(this)
        .addInclude('pretaskFiles')
        .addFilter({ field: 'pretaskId', operator: filterOperator, value: pretaskIds })
        .create();

      const response = await firstValueFrom<ResponseWrapper>(this.service.getAll(SERV.PRETASKS, paramsPretaskFiles));

      // set pagination info (same as loadPretasks)
      const length = response.meta?.page?.total_elements ?? 0;
      const nextLink = response.links?.next;
      const prevLink = response.links?.prev;
      const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
      const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;
      this.setPaginationConfig(this.pageSize, length, after, before, this.index);

      const responseData = { data: response.data, included: response.included };
      return this.serializer.deserialize<JPretask[]>(responseData);
    }
    return [];
  }

  /**
   * Reload the data source using the stored filter
   */
  reload(): void {
    this.clearSelection();
    void this.loadAll(); // This will use the stored filter
  }

  /**
   * Clear the current filter and reload data
   */
  clearFilter(): void {
    this._currentFilter = null;
    this.setPaginationConfig(this.pageSize, undefined, undefined, undefined, 0);
    this.reload();
  }
}
