import { catchError, finalize, forkJoin, of } from 'rxjs';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { File, FileType } from '../_models/file.model';

export class FilesDataSource extends BaseDataSource<File> {
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
      const params = {
        maxResults: this.pageSize,
        startsAt: startAt,
        expand: 'accessGroup',
        filter: `fileType=${this.fileType}`
      };
      files$ = this.service.getAll(SERV.FILES, params);
    }

    this.subscriptions.push(
      files$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<File>) => {
          let files: File[];

          if (this.editType === 0) {
            files = response['files'];
            console.log(files);
          } else if (this.editType === 1) {
            files = response['pretaskFiles'];
          } else {
            files = response.values;
          }

          files.map((file: File) => {
            if (file.accessGroup) {
              file.accessGroupId = file.accessGroup.accessGroupId;
              file.accessGroupName = file.accessGroup.groupName;
            } else {
              const accessGroups$ = this.service.get(
                SERV.ACCESS_GROUPS,
                file.accessGroupId
              );
              forkJoin(accessGroups$).subscribe(
                (accessGroupResponses: any[]) => {
                  file.accessGroupName = accessGroupResponses['GroupName'];
                }
              );
            }
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
