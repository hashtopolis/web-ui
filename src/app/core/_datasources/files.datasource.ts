/**
 * Contains datasource definition for files
 * @module
 */

import { catchError, finalize, of } from 'rxjs';

import { FileType, JFile } from '@models/file.model';
import { JPretask } from '@models/pretask.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';

import { BaseDataSource } from '@datasources/base.datasource';

import { Filter, FilterType } from '@src/app/core/_models/request-params.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

/**
 * Data source class definition for files
 */
export class FilesDataSource extends BaseDataSource<JFile> {
  private fileType: FileType = 0;
  private editIndex?: number;
  private editType?: number;
  private _currentFilter: Filter = null;
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

    let files$;

    const paramsBuilder = new RequestParamBuilder();

    if (this.editIndex !== undefined) {
      if (this.editType === 0) {
        files$ = this.service.get(SERV.TASKS, this.editIndex, paramsBuilder.addInclude('files').create());
      } else {
        files$ = this.service.get(SERV.PRETASKS, this.editIndex, paramsBuilder.addInclude('pretaskFiles').create());
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
      files$ = this.service.getAll(SERV.FILES, params.create());
    }

    this.subscriptions.push(
      files$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          if (this.editIndex !== undefined && this.editType === 0) {
            const serializer = new JsonAPISerializer();
            const responseData = { data: response.data, included: response.included };
            const tasks = serializer.deserialize<JTask>(responseData);

            this.setData(tasks.files);
          } else if (this.editType === 1) {
            const serializer = new JsonAPISerializer();
            const responseData = { data: response.data, included: response.included };
            const pretask = serializer.deserialize<JPretask>(responseData);

            if (!this.editType) {
              const nextLink = response.links.next;
              const prevLink = response.links.prev;
              const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
              const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

              this.setPaginationConfig(this.pageSize, length, after, before, this.index);
            }

            this.setData(pretask.pretaskFiles);
          } else {
            const serializer = new JsonAPISerializer();
            const responseData = { data: response.data, included: response.included };
            const files = serializer.deserialize<JFile[]>(responseData);

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
