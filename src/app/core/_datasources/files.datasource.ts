/**
 * Contains datasource definition for files
 * @module
 */

import { catchError, finalize, of } from 'rxjs';
import { FileType, JFile } from '../_models/file.model';
import { BaseDataSource } from './base.datasource';
import { JsonAPISerializer } from '../_services/api/serializer-service';
import { RequestParams } from '../_models/request-params.model';
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
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    let files$;

    if (this.editIndex !== undefined) {
      if (this.editType === 0) {
        files$ = this.service.get(SERV.TASKS, this.editIndex, {
          expand: 'files'
        });
      } else {
        files$ = this.service.get(SERV.PRETASKS, this.editIndex, {
          expand: 'pretaskFiles'
        });
      }
    } else {
      const params: RequestParams = {
        maxResults: this.pageSize,
        startsAt: startAt,
        include: 'accessGroup',
        filter: `filter[fileType__eq]=${this.fileType}`
      };
      if (sorting.dataKey && sorting.isSortable) {
        const order = this.buildSortingParams(sorting);
        params.ordering = order;
      }
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
