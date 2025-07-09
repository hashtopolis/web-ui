/**
 * Contains datasource definition for files
 * @module
 */

import { FileType, JFile } from '../_models/file.model';
import { Filter, FilterType } from '@src/app/core/_models/request-params.model';
import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { JPretask } from '@models/pretask.model';
import { JTask } from '@models/task.model';
import { JsonAPISerializer } from '../_services/api/serializer-service';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

/**
 * Data source class definition for files
 */
export class FilesDataSource extends BaseDataSource<JFile> {
  private fileType: FileType = 0;
  private editIndex?: number;
  private editType?: number;

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
      const params = paramsBuilder
        .addInitial(this)
        .addInclude('accessGroup')
        .addFilter({ field: 'fileType', operator: FilterType.EQUAL, value: this.fileType });
      if (query) {
        params.addFilter(query);
      }

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
            const length = response.meta.page.total_elements;

            if (!this.editType) {
              this.setPaginationConfig(this.pageSize, length, this.pageAfter, this.pageBefore, this.index);
            }

            this.setData(tasks.files);
          } else if (this.editType === 1) {
            const serializer = new JsonAPISerializer();
            const responseData = { data: response.data, included: response.included };
            const pretask = serializer.deserialize<JPretask>(responseData);

            if (!this.editType) {
              this.setPaginationConfig(this.pageSize, length, this.pageAfter, this.pageBefore, this.index);
            }

            this.setData(pretask.pretaskFiles);
          } else {
            const serializer = new JsonAPISerializer();
            const responseData = { data: response.data, included: response.included };
            const files = serializer.deserialize<JFile[]>(responseData);

            this.setPaginationConfig(this.pageSize, length, this.pageAfter, this.pageBefore, this.index);
            this.setData(files);
          }
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
