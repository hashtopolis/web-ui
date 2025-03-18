/**
 * Contains datasource definition for files
 * @module
 */

import { catchError, finalize, of } from 'rxjs';
import { FileType, JFile } from '../_models/file.model';
import { BaseDataSource } from './base.datasource';
import { ResponseWrapper } from '../_models/response.model';
import { JsonAPISerializer } from '../_services/api/serializer-service';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

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
  loadAll(): void {
    this.loading = true;

    let files$;

    const paramsBuilder = new RequestParamBuilder()

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
        .addFilter({field: "fileType", operator: "eq", value: this.fileType})
        .create()

      files$ = this.service.getAll(SERV.FILES, params);
    }

    this.subscriptions.push(
      files$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const serializer = new JsonAPISerializer();
          const responseData = { data: response.data, included: response.included };
          const files = serializer.deserialize<JFile[]>(responseData);
          files.forEach((file) => {
            files.push(file);
          });

          if (!this.editType) {
            this.setPaginationConfig(this.pageSize, this.currentPage, files.length);
          }

          this.setData(files);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
