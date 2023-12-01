/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { DataType, HTTableColumn, HTTableEditable } from './ht-table.models';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  UIConfig,
  uiConfigDefault
} from 'src/app/core/_models/config-ui.model';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseDataSource } from 'src/app/core/_datasources/base.datasource';
import { BulkActionMenuComponent } from '../../menus/bulk-action-menu/bulk-action-menu.component';
import { ColumnSelectionDialogComponent } from '../column-selection-dialog/column-selection-dialog.component';
import { LocalStorageService } from 'src/app/core/_services/storage/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { UISettingsUtilityClass } from 'src/app/shared/utils/config';

/**
 * The `HTTableComponent` is a custom table component that allows you to display tabular data with
 * features like sorting, filtering, and row selection. It provides flexibility in selecting columns
 * to display and handling various table actions.
 *
 * Usage:
 * ```
 * <ht-table
 *   [name]="tableName"
 *   [dataSource]="myDataSource"
 *   [isPageable]="true"
 *   [isSortable]="true"
 *   [isSelectable]="true"
 *   [isFilterable]="true"
 *   [tableColumns]="myTableColumns"
 *   [hasRowAction]="true"
 *   [paginationSizes]="[5, 10, 15]"
 *   [defaultPageSize]="10"
 *   [filterFn]="customFilterFunction"
 *   (rowActionClicked)="myRowActionHandler($event)"
 *   (bulkActionClicked)="myBulkActionHandler($event)">
 * </ht-table>
 *
 * ```
 *
 * - `[name]`: The internal name of the table used when storing user customizations.
 * - `[dataSource]`: An instance of a data source that extends `BaseDataSource`.
 * - `[isPageable]`: Set to `true` to enable pagination.
 * - `[isSortable]`: Set to `true` to enable column sorting.
 * - `[isSelectable]`: Set to `true` to enable row selection with checkboxes.
 * - `[isFilterable]`: Set to `true` to enable filtering.
 * - `[tableColumns]`: An array of `HTTableColumn` configurations for defining columns.
 * - `[hasRowAction]`: Set to `true` to enable custom row actions.
 * - `[paginationSizes]`: An array of available page sizes.
 * - `[defaultPageSize]`: The default page size for pagination.
 * - `[filterFn]`: A custom filter function for advanced filtering.
 * - `(rowActionClicked)`: Emits an `ActionMenuEvent` when a row action is triggered.
 * - `(bulkActionClicked)`: Emits an `ActionMenuEvent` when a bulk action is triggered.
 * - `(exportActionClicked)`: Emits an `ActionMenuEvent` when an export action is triggered.
 *
 * @see `BaseDataSource` for creating a data source.
 * @see `HTTableColumn` for defining column configurations.
 *
 */
@Component({
  selector: 'ht-table',
  templateUrl: './ht-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HTTableComponent implements OnInit, AfterViewInit {
  /** The list of column names to be displayed in the table. */
  displayedColumns: string[] = [];

  /** Reference to MatPaginator for pagination support. */
  @ViewChild(MatPaginator, { static: false }) matPaginator: MatPaginator;

  /** Reference to MatSort for sorting support. */
  @ViewChild(MatSort, { static: true }) matSort: MatSort;

  /** Name of the table, used when storing user customizations */
  @Input() name: string;

  /** All available column labels */
  @Input() columnLabels: { [key: number]: string };

  /** Data type displayed in the table, used to load relevant context menus */
  @Input() dataType: DataType;

  /** Function used to filter table data. */
  @Input() filterFn: (item: any, filterValue: string) => boolean;

  /** The data source for the table. */
  @Input() dataSource: BaseDataSource<any>;

  /** Flag to enable or disable pagination. */
  @Input() isPageable = false;

  /** Flag to enable or disable sorting. */
  @Input() isSortable = false;

  /** Flag to enable or disable selectable rows. */
  @Input() isSelectable = false;

  /** Flag to enable or disable filtering. */
  @Input() isFilterable = false;

  /** Flag show archived data. */
  @Input() isArchived = false;

  /** The list of table columns and their configurations. */
  @Input() tableColumns: HTTableColumn[] = [];

  /** Flag to enable row action menu */
  @Input() hasRowAction = false;

  /** Flag to enable bulk action menu */
  @Input() hasBulkActions = true;

  /** Pagination sizes to choose from. */
  @Input() paginationSizes: number[] = [3, 25, 50, 100, 250];

  /** Default page size for pagination. */
  @Input() defaultPageSize = this.paginationSizes[1];

  /** Event emitter for when the user triggers a row action */
  @Output() rowActionClicked: EventEmitter<ActionMenuEvent<any>> =
    new EventEmitter<ActionMenuEvent<any>>();

  /** Event emitter for when the user triggers a bulk action */
  @Output() bulkActionClicked: EventEmitter<ActionMenuEvent<any>> =
    new EventEmitter<ActionMenuEvent<any>>();

  /** Event emitter for when the user triggers an export action */
  @Output() exportActionClicked: EventEmitter<ActionMenuEvent<any>> =
    new EventEmitter<ActionMenuEvent<any>>();

  /** Event emitter for when the user saves an editable input */
  @Output() editableSaved: EventEmitter<HTTableEditable<any>> =
    new EventEmitter<HTTableEditable<any>>();

  /** Fetches user customizations */
  private uiSettings: UISettingsUtilityClass;

  @ViewChild('bulkMenu') bulkMenu: BulkActionMenuComponent;

  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private storage: LocalStorageService<UIConfig>
  ) {}

  ngOnInit(): void {
    this.uiSettings = new UISettingsUtilityClass(this.storage);
    const displayedColumns = this.uiSettings.getTableSettings(this.name);
    if (displayedColumns) {
      this.setDisplayedColumns(displayedColumns);
    } else {
      this.setDisplayedColumns(uiConfigDefault.tableSettings[this.name]);
    }
  }

  ngAfterViewInit(): void {
    // Configure paginator and sorting
    this.dataSource.paginator = this.matPaginator;
    this.dataSource.sort = this.matSort;
    this.dataSource.pageSize = this.defaultPageSize;
    this.matSort.sortChange.subscribe(() => {
      this.dataSource.sortData();
    });
  }

  /**
   * Opens a dialog for selecting table columns to display.
   */
  openColumnSelectionDialog(): void {
    const dialogRef = this.dialog.open(ColumnSelectionDialogComponent, {
      width: '400px',
      data: {
        availableColumns: this.filterKeys(
          this.columnLabels,
          this.tableColumns.map((col) => col.id + '')
        ),
        selectedColumns: this.displayedColumns
      }
    });

    dialogRef.afterClosed().subscribe((selectedColumns: number[]) => {
      if (selectedColumns) {
        this.setDisplayedColumns(selectedColumns);
        this.uiSettings.updateTableSettings(this.name, selectedColumns);
        this.cd.detectChanges();
      }
    });
  }

  private filterKeys(
    original: { [key: string]: string },
    include: string[]
  ): any {
    const filteredObject: { [key: string]: string } = {};

    for (const attribute of include) {
      if (original.hasOwnProperty(attribute)) {
        filteredObject[attribute] = original[attribute];
      }
    }

    return filteredObject;
  }

  rowAction(event: ActionMenuEvent<any>): void {
    this.rowActionClicked.emit(event);
  }

  bulkAction(event: ActionMenuEvent<any>): void {
    this.bulkActionClicked.emit(event);
  }

  exportAction(event: ActionMenuEvent<any>): void {
    this.exportActionClicked.emit(event);
  }

  /**
   * Sets the displayed columns based on user selection.
   *
   * @param columnNames - The list of column names to display.
   */
  setDisplayedColumns(columnNames: number[]): void {
    this.displayedColumns = [];
    if (this.isSelectable) {
      // Add checkbox if enabled
      this.displayedColumns.push('100'); // 100 = select
    }
    for (const num of columnNames) {
      this.displayedColumns.push(num + '');
    }

    if (this.hasRowAction) {
      // Add action menu if enabled
      this.displayedColumns.push('200'); // 200 = row action
    }
  }

  /**
   * Applies a filter to the table based on user input.
   */
  applyFilter() {
    if (this.filterFn) {
      this.dataSource.filterData(this.filterFn);
    }
  }

  /**
   * Checks if a row is selected.
   *
   * @param row - The row to check.
   */
  isSelected(row: any): boolean {
    return this.dataSource.isSelected(row);
  }

  /**
   * Checks if all rows are selected.
   */
  isAllSelected(): boolean {
    return this.dataSource.isAllSelected();
  }

  /**
   * Toggles selection for all rows.
   */
  toggleAll(): void {
    this.dataSource.toggleAll();
  }

  /**
   * Checks if there are selected rows.
   */
  hasSelected(): boolean {
    return this.dataSource.hasSelected();
  }

  /**
   * Checks if the selection state is indeterminate.
   */
  indeterminate(): boolean {
    return this.dataSource.indeterminate();
  }

  /**
   * Toggles selection for a specific row.
   *
   * @param row - The row to toggle.
   */
  toggleSelect(row: any): void {
    if (this.isSelectable) {
      this.dataSource.toggleRow(row);
    }
  }

  /**
   * Reloads the data in the table and the bulk menu.
   */
  reload(): void {
    this.dataSource.reset(true);
    this.dataSource.reload();
    if (this.bulkMenu) {
      this.bulkMenu.reload();
    }
  }

  /**
   * Handles the page change event, including changes in page size and page index.
   *
   * @param event - The `PageEvent` object containing information about the new page configuration.
   */
  onPageChange(event: PageEvent): void {
    this.dataSource.setPaginationConfig(
      event.pageSize,
      event.pageIndex,
      this.dataSource.totalItems
    );
    this.dataSource.reload();
  }

  editableInputSaved(editable: HTTableEditable<any>): void {
    this.editableSaved.emit(editable);
  }
}
