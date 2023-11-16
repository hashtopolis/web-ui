import { File, FileType } from '../_models/file.model';
import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class FilesDataSource extends BaseDataSource<File> {
  private fileType: FileType = 0;

  setFileType(fileType: FileType): void {
    this.fileType = fileType;
  }

  getFileType(): FileType {
    return this.fileType;
  }

  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const params = {
      maxResults: this.pageSize,
      startAt: startAt,
      expand: 'accessGroup',
      filter: `fileType=${this.fileType}`
    };

    const files$ = this.service.getAll(SERV.FILES, params);

    this.subscriptions.push(
      files$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<File>) => {
          const files: File[] = response.values;

          files.map((file: File) => {
            if (file.accessGroup) {
              file.accessGroupId = file.accessGroup.accessGroupId;
              file.accessGroupName = file.accessGroup.groupName;
            }
          });

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
          );
          this.setData(response.values);
        })
    );
  }

  reload(): void {
    this.loadAll();
  }
}
