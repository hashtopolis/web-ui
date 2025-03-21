import { catchError, finalize, of } from 'rxjs';

import { ReportBaseDataSource } from './base.datasource';
import { Hashlist } from 'src/app/hashlists/hashlist.model';
import { SERV } from 'src/app/core/_services/main.config';

export class HashlistReportDataSource extends ReportBaseDataSource<Hashlist> {
  private _hashlistId = 0;

  setHashlistId(hashlistId: number): void {
    this._hashlistId = hashlistId;
  }

  loadAll(): void {
    this.loading = true;

    const hashList$ = this.service.get(SERV.HASHLISTS, this._hashlistId, {
      include: ['accessGroup', 'tasks', 'hashes', 'hashType', 'hashlists']
    });

    this.subscriptions.push(
      hashList$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response) => {
          const res = this.getReport(response);
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
    data['tasks'].forEach((item) => {
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
            text: `Keyspace: ${item.keyspace} (Progress: ${(
              (item.keyspaceProgress / item.keyspace) *
              100
            ).toFixed(2)}%)`,
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

    const report = [
      {
        title: 'Input Fields',
        table: {
          tableColumns: [
            'Name',
            'Notes',
            'Hash Mode',
            'Hash Count',
            'Retrieved',
            'Total Keyspace explored'
          ],
          tableValues: [
            data.name,
            data.notes,
            data.hashType.hashTypeId,
            data.hashCount,
            data.cracked,
            sum
          ]
        }
      },
      { break: 1 },
      {
        title: 'WorkFlow Completed'
      },
      { break: 1 },
      ...workflow
    ];
    return report;
  }
}
