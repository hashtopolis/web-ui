// typescript
import { HTTP_SKIP_ERROR_HEADER_CONFIG } from '@constants/http.config';
import { zPreTaskListResponse, zSupertaskPretaskListResponse, zSupertaskResponse } from '@generated/api/zod';
import { catchError, lastValueFrom } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';

import { JPretask } from '@models/pretask.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JSupertaskPretask } from '@models/supertask-pretask.model';
import { JSuperTask } from '@models/supertask.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { IParamBuilder } from '@services/params/builder-types.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class PreTasksDataSource extends BaseDataSource<JPretask> {
  private _superTaskId = 0;
  private _reverseQuery = false;
  /** Cracker binary type the pretasks NOT part of the supertask are limited to, null for no limit */
  private _crackerBinaryTypeId: number | null = null;
  private _currentFilter: Filter | null = null;

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
   * Limit the reverse query (pretasks not part of the supertask) to pretasks of the given cracker binary type.
   * A supertask only accepts pretasks of its own type.
   * @param crackerBinaryTypeId the type, null for no limit
   */
  setCrackerBinaryTypeId(crackerBinaryTypeId: number | null): void {
    this._crackerBinaryTypeId = crackerBinaryTypeId;
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
        params = this.applyMaskImportFilter(params);
        params = this.applyFilterWithPaginationReset(params, activeFilter, query);
        const pretasks = await this.loadPretasks(params.create());
        this.setData(pretasks);
      } else {
        const supertaskParams = new RequestParamBuilder().addInitial(this).addInclude('pretasks').create();
        const supertask = await this.loadSupertask(this._superTaskId, supertaskParams);
        const superTaskPreTaskIds = (supertask?.pretasks || []).map((p) => p.id);

        if (superTaskPreTaskIds && superTaskPreTaskIds.length > 0) {
          const pretaskFiles = await this.loadPretaskFiles(superTaskPreTaskIds, activeFilter, query);
          if (!this._reverseQuery) {
            await this.mergeAssociations(pretaskFiles);
          }
          this.setData(pretaskFiles);
        } else {
          // No pretasks assigned to the supertask.
          // If reverseQuery (NOTIN) is requested then NOTIN empty set === all pretasks.
          if (this._reverseQuery) {
            let paramsAll: IParamBuilder = new RequestParamBuilder().addInitial(this).addInclude('pretaskFiles');
            paramsAll = this.applyMaskImportFilter(paramsAll);
            paramsAll = this.applyCrackerTypeFilter(paramsAll);
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
   * Exclude mask-importer pretasks (isMaskImport=true) when the hideImportMasks UI setting is on.
   * @param params
   * @private
   */
  private applyMaskImportFilter<B extends IParamBuilder>(params: B): B {
    if (this.uiService.getUISettings()?.hideImportMasks === 1) {
      params.addFilter({ field: 'isMaskImport', operator: FilterType.EQUAL, value: false });
    }
    return params;
  }

  /**
   * Limit to the cracker binary type of the supertask, only for the pretasks which are not part of it yet.
   * @param params
   * @private
   */
  private applyCrackerTypeFilter<B extends IParamBuilder>(params: B): B {
    if (this._reverseQuery && this._crackerBinaryTypeId !== null) {
      params.addFilter({ field: 'crackerBinaryTypeId', operator: FilterType.EQUAL, value: this._crackerBinaryTypeId });
    }
    return params;
  }

  /**
   * Load pretasks with given parameters
   * @param params Request parameters
   * @private
   */
  private async loadPretasks(params: RequestParams): Promise<JPretask[]> {
    const httpOptions = { headers: new HttpHeaders(HTTP_SKIP_ERROR_HEADER_CONFIG) };
    try {
      const response = await lastValueFrom<ResponseWrapper>(
        this.service.getAll(SERV.PRETASKS, params, httpOptions).pipe(
          catchError((error) => {
            this.handleFilterError(error);
            throw error;
          })
        )
      );

      const length = response.meta.page.total_elements;
      const nextLink = response.links.next;
      const prevLink = response.links.prev;
      const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
      const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

      this.setPaginationConfig(this.pageSize, length, after, before, this.index);
      return this.serializer.deserialize(response, zPreTaskListResponse);
    } catch {
      return [];
    }
  }

  private async loadSupertask(superTaskId: number, params: RequestParams): Promise<JSuperTask | null> {
    const httpOptions = { headers: new HttpHeaders(HTTP_SKIP_ERROR_HEADER_CONFIG) };
    try {
      const response = await lastValueFrom<ResponseWrapper>(
        this.service.get(SERV.SUPER_TASKS, superTaskId, params, httpOptions).pipe(
          catchError((error) => {
            this.handleFilterError(error);
            throw error;
          })
        )
      );

      return this.serializer.deserialize(response, zSupertaskResponse);
    } catch {
      return null;
    }
  }

  /**
   * Load pretask files for given pretask IDs
   * @param pretaskIds
   * @param activeFilter
   * @param query
   * @private
   */
  private async loadPretaskFiles(
    pretaskIds: number[],
    activeFilter?: Filter | null,
    query?: Filter
  ): Promise<JPretask[]> {
    const filterOperator = this._reverseQuery ? FilterType.NOTIN : FilterType.IN;
    if (pretaskIds && pretaskIds.length > 0) {
      let paramsBuilder = new RequestParamBuilder()
        .addInitial(this)
        .addInclude('pretaskFiles')
        .addFilter({ field: 'pretaskId', operator: filterOperator, value: pretaskIds });
      if (this._reverseQuery) {
        paramsBuilder = this.applyMaskImportFilter(paramsBuilder);
        paramsBuilder = this.applyCrackerTypeFilter(paramsBuilder);
      }
      paramsBuilder = this.applyFilterWithPaginationReset(paramsBuilder, activeFilter, query);
      const paramsPretaskFiles = paramsBuilder.create();
      const httpOptions = { headers: new HttpHeaders(HTTP_SKIP_ERROR_HEADER_CONFIG) };
      try {
        const response = await lastValueFrom<ResponseWrapper>(
          this.service.getAll(SERV.PRETASKS, paramsPretaskFiles, httpOptions).pipe(
            catchError((error) => {
              this.handleFilterError(error);
              throw error;
            })
          )
        );

        // set pagination info (same as loadPretasks)
        const length = response.meta?.page?.total_elements ?? 0;
        const nextLink = response.links?.next;
        const prevLink = response.links?.prev;
        const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
        const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;
        this.setPaginationConfig(this.pageSize, length, after, before, this.index);

        return this.serializer.deserialize(response, zPreTaskListResponse);
      } catch {
        return [];
      }
    }
    return [];
  }

  /**
   * Copies the priority a pretask has within the supertask, and the ID of the association holding
   * it, onto the given rows. The request is scoped to the rows of the current page, so it cannot be
   * cut short by the page size. A row without an association keeps its own priority.
   * @param pretasks
   * @private
   */
  private async mergeAssociations(pretasks: JPretask[]): Promise<void> {
    if (pretasks.length === 0) {
      return;
    }
    const pretaskIds = pretasks.map((pretask) => pretask.id);
    const params = new RequestParamBuilder()
      .addFilter({ field: 'supertaskId', operator: FilterType.EQUAL, value: this._superTaskId })
      .addFilter({ field: 'pretaskId', operator: FilterType.IN, value: pretaskIds })
      .setPageSize(pretaskIds.length)
      .create();
    const httpOptions = { headers: new HttpHeaders(HTTP_SKIP_ERROR_HEADER_CONFIG) };
    try {
      const response = await lastValueFrom<ResponseWrapper>(
        this.service.getAll(SERV.SUPER_TASK_PRETASKS, params, httpOptions)
      );
      const associations: JSupertaskPretask[] = this.serializer.deserialize(response, zSupertaskPretaskListResponse);
      for (const pretask of pretasks) {
        const association = associations.find((candidate) => candidate.pretaskId === pretask.id);
        if (association) {
          pretask.supertaskPretaskId = association.id;
          pretask.supertaskPriority = association.priority;
        }
      }
    } catch {
      // the rows stay usable without the association, the priority column then shows nothing
    }
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
