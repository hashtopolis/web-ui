import { catchError, finalize, forkJoin, of } from 'rxjs';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { FileData, FileType } from '../_models/file.model';
import { AccessGroupDataAttributes } from '../_models/access-group.model';

export class FilesDataSource extends BaseDataSource<FileData> {
  private fileType: FileType = 0;
  private editIndex?: number;
  private editType?: number;

  setFileType(fileType: FileType): void {
    this.fileType = fileType;
  }

  getFileType(): FileType {
    return this.fileType;
  }

  setEditValues(index: number, editType: number): void {
    this.editIndex = index;
    this.editType = editType;
  }

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
        .subscribe((response: ListResponseWrapper<FileData>) => {
          let files: FileData[] = [];

            response.data.forEach((value: FileData) => {
                const file: FileData = value;
                let accessGroupId: number = value.attributes.accessGroupId;
                let includedAccessGroup = response.included.find((inc) => inc.type === "accessGroup" && inc.id === accessGroupId);
                file.attributes.accessGroup = includedAccessGroup.attributes as AccessGroupDataAttributes;

              files.push(file);
            });

          if (!this.editType) {
            this.setPaginationConfig(
              this.pageSize,
              this.currentPage,
              response.total
            );
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
