/**
 * Contains datasource definition for files
 * @module
 */

import { zFileListResponse, zPreTaskResponse, zTaskResponse } from '@generated/api/zod';
import { catchError, finalize, of } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';

import { FileType, JFile } from '@models/file.model';
import { JPretask } from '@models/pretask.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask } from '@models/task.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

/**
 * Data source class definition for files
 */
export class FilesDataSource extends BaseDataSource<JFile> {
  private fileType: FileType = 0;
  private editIndex?: number;
  private editType?: number;
  private _currentFilter: Filter | null = null;
  isDetail = false;
  /**
   * Set file type
   * @param fileType
   */
  setFileType(fileType: FileType): void {
    this.fileType = fileType;
  }

  getFileType(): FileType {
    return this.fileType;
  }

  /**
   * Set edit values
   * @param index
   * @param editType
   */
  setEditValues(index: number, editType: number): void {
    this.editIndex = index;
    this.editType = editType;
  }
  /**
   * Load all files from server
   */
  loadAll(query?: Filter): void {
    this.loading = true;

    let files$: ReturnType<typeof this.service.get> | ReturnType<typeof this.service.getAll> | undefined;
    const httpOptions = { headers: new HttpHeaders({ 'X-Skip-Error-Dialog': 'true' }) };

    const paramsBuilder = new RequestParamBuilder();

    if (this.editIndex !== undefined) {
      if (this.editType === 0) {
        files$ = this.service.get(SERV.TASKS, this.editIndex, paramsBuilder.addInclude('files').create(), httpOptions);
      } else if (this.editType === 1) {
        files$ = this.service.get(
          SERV.PRETASKS,
          this.editIndex,
          paramsBuilder.addInclude('pretaskFiles').create(),
          httpOptions
        );
      }
    } else {
      let params = paramsBuilder
        .addInitial(this)
        .addInclude('accessGroup')
        .addFilter({ field: 'fileType', operator: FilterType.EQUAL, value: this.fileType });
      if (query) {
        this._currentFilter = query;
      }

      // Use stored filter if no new filter is provided
      const activeFilter = query || this._currentFilter;
      params = this.applyFilterWithPaginationReset(params, activeFilter, query);
      files$ = this.service.getAll(SERV.FILES, params.create(), httpOptions);
    }

    // Create headers to skip error dialog for filter validation errors already created above

    if (!files$) {
      this.loading = false;
      return;
    }

    this.subscriptions.push(
      files$
        .pipe(
          catchError((error) => {
            this.handleFilterError(error);
            return of([]);
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          if (this.editIndex !== undefined && this.editType === 0) {
            const tasks: JTask = this.serializer.deserialize(response, zTaskResponse);

            this.setData(tasks.files!);
          } else if (this.editType === 1) {
            const pretask: JPretask = this.serializer.deserialize(response, zPreTaskResponse);

            if (!this.editType) {
              const nextLink = response.links.next;
              const prevLink = response.links.prev;
              const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
              const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;
              const totalElements = response.meta.page.total_elements;

              this.setPaginationConfig(this.pageSize, totalElements, after, before, this.index);
            }

            this.setData(pretask.pretaskFiles!);
          } else {
            const files: JFile[] = this.serializer.deserialize(response, zFileListResponse);

            const nextLink = response.links.next;
            const prevLink = response.links.prev;
            const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
            const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;
            const length = response.meta.page.total_elements;

            this.setPaginationConfig(this.pageSize, length, after, before, this.index);
            this.setData(files);
          }
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
}
