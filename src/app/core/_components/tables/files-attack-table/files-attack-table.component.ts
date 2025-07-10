import { CheckboxChangeEvent, HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FileType, JFile } from '@models/file.model';
import {
  FilesAttackTableCol,
  FilesAttackTableColumnLabel
} from '@components/tables/files-attack-table/files-attack-table.constants';

import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { FilesDataSource } from '@datasources/files.datasource';
import { FilterType } from '@src/app/core/_models/request-params.model';
import { formatFileSize } from '@src/app/shared/utils/util';

@Component({
  selector: 'app-files-attack-table',
  templateUrl: './files-attack-table.component.html',
  standalone: false
})
export class FilesAttackTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  @Input() fileType: FileType = 0;
  @Input() cmdTask = true;
  @Input() cmdPrepro = false;
  @Input() customLabel: string;
  @Input() bulkWordlistRule = false;
  @Input() showExport = false;
  @Input() checkboxChangedData: CheckboxChangeEvent;
  @Input() formData: {
    attackCmd: string;
    preprocessorCommand?: string;
    files: any;
  };

  @Output() updateFormEvent = new EventEmitter<any>();
  tableColumns: HTTableColumn[] = [];
  dataSource: FilesDataSource;
  selectedFilterColumn: string = '_id';
  ngOnInit(): void {
    this.setColumnLabels(FilesAttackTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new FilesDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.setFileType(this.fileType);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(input: string) {
    const selectedColumn = this.selectedFilterColumn;
    if (input && input.length > 0) {
      this.dataSource.loadAll({ value: input, field: selectedColumn, operator: FilterType.ICONTAINS });
      return;
    } else {
      this.dataSource.loadAll(); // Reload all data if input is empty
    }
  }
  getColumns(): HTTableColumn[] {
    return [
      {
        id: FilesAttackTableCol.ID,
        dataKey: '_id',
        isSearchable: true,
        isSortable: true,
        render: (file: JFile) => file.id,
        export: async (file: JFile) => file.id + ''
      },
      {
        id: FilesAttackTableCol.NAME,
        dataKey: 'filename',
        isSearchable: true,
        icon: (file: JFile) => this.renderSecretIcon(file),
        render: (file: JFile) => file.filename,
        isSortable: true,
        export: async (file: JFile) => file.filename
      },
      {
        id: FilesAttackTableCol.SIZE,
        dataKey: 'size',
        render: (file: JFile) => formatFileSize(file.size, 'short'),
        isSortable: true,
        export: async (file: JFile) => formatFileSize(file.size, 'short')
      }
    ];
  }

  onCheckboxChanged(event: CheckboxChangeEvent): void {
    // Handle the checkbox change event
    this.cdr.detectChanges();
    const transformed = this.onPrepareAttack(this.formData, event);
    // Pass the event data to another component
    this.updateFormEvent.emit(transformed);
  }

  onPrepareAttack(form: any, event: CheckboxChangeEvent): object {
    let currentCmd;
    if (event.columnType === 'CMD') {
      currentCmd = form.attackCmd;
    } else {
      currentCmd = form.preprocessorCommand || '';
    }
    const newCmdArray = currentCmd.split(' ');
    const fileName = event.row.filename;
    const fileId = event.row.id;
    let newFileIds;
    if (event.columnType === 'CMD') {
      newFileIds = [...form.files];
    } else {
      newFileIds = form.otherFiles ? [...form.otherFiles] : [];
    }

    if (!event.checked) {
      // Remove -r and filename from the command
      const indexFileName = newCmdArray.indexOf(fileName);
      if (indexFileName !== -1) {
        newCmdArray.splice(indexFileName, 1);
      }
      if (event.row.fileType === 1) {
        newCmdArray.splice(indexFileName - 1, 1);
      }

      // Remove fileId from the array
      const fileIdIndex = newFileIds.indexOf(fileId);
      if (fileIdIndex !== -1) {
        newFileIds.splice(fileIdIndex, 1);
      }
    } else {
      // Add -r and filename to the command
      if (event.row.fileType === 1) {
        newCmdArray.push('-r');
      }

      newCmdArray.push(fileName);

      // Add fileId to the array
      if (!newFileIds.includes(fileId)) {
        newFileIds.push(fileId);
      }
    }

    const newCmd = newCmdArray.join(' ').trim();

    return {
      attackCmd: newCmd,
      files: newFileIds,
      otherFiles: newFileIds,
      type: event.columnType
    };
  }
}
