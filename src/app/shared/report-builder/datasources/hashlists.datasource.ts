import { catchError, finalize, of } from 'rxjs';
import { SERV } from 'src/app/core/_services/main.config';
import { Hashlist } from 'src/app/hashlists/hashlist.model';

import { JHashlist } from '@models/hashlist.model';
import { JTask } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';

import { ReportBaseDataSource } from './base.datasource';

export class HashlistReportDataSource extends ReportBaseDataSource<Hashlist> {
  private _hashlistId = 0;

  setHashlistId(hashlistId: number): void {
    this._hashlistId = hashlistId;
  }

  loadAll(): void {
    this.loading = true;

    const hashList$ = this.service.get(SERV.HASHLISTS, this._hashlistId, {
      include: ['accessGroup', 'tasks', 'hashType', 'hashlists']
    });

    this.subscriptions.push(
      hashList$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response) => {
          const responseBody = { data: response.data, included: response.included };
          const hashlist = new JsonAPISerializer().deserialize<JHashlist>(responseBody);

          const res = this.getReport(hashlist);
          this.setData(res);
        })
    );
  }

  reload(): void {
    this.loadAll();
  }

  getReport(data: any) {
    let sum = 0;
    const workflow = [];
    let preCommand;
    const files = [];
    data.tasks.forEach((item: JTask) => {
      if (item.keyspace && typeof item.keyspace === 'number') {
        sum += item.keyspace;
      }
      if (item.preprocessorCommand) {
        preCommand.push({
          subtitle: `Preprocessor Command: ${item.preprocessorCommand}`
        });
      }

      // Extract file names using regular expressions
      const fileNames = item.attackCmd.match(/\b\w+\.\w+\b/g);

      if (fileNames && fileNames.length > 0) {
        fileNames.forEach((fileName) => {
          files.push({
            text: `File: ${fileName}`,
            margin: [0, 0, 0, 5]
          });
        });
      }
      workflow.push({
        subtitle: `Command: ${item.attackCmd}`,
        ...preCommand,
        ul: [
          {
            text: `Keyspace: ${item.keyspace} (Progress: ${((item.keyspaceProgress / item.keyspace) * 100).toFixed(
              2
            )}%)`,
            margin: [0, 0, 0, 5]
          },
          // TODO implement Cracked entries for each task
          // {
          //   text: `Cracked entries: ${item.taskId}`,
          //   margin: [0, 0, 0, 5]
          // },
          ...files
        ]
      });
    });

    return [
      {
        title: 'Input Fields',
        table: {
          tableColumns: ['Name', 'Notes', 'Hash Mode', 'Hash Count', 'Retrieved', 'Total Keyspace explored'],
          tableValues: [data.name, data.notes, data.hashTypeId, data.hashCount, data.cracked, sum]
        }
      },
      { break: 1 },
      {
        title: 'WorkFlow Completed'
      },
      { break: 1 },
      ...workflow
    ];
  }
}
