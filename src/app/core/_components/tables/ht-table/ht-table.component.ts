import { Subscription, take, timer } from 'rxjs';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { BaseModel } from '@models/base.model';
import { UIConfig } from '@models/config-ui.model';
import { JHash } from '@models/hash.model';

import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuComponent } from '@components/menus/bulk-action-menu/bulk-action-menu.component';
import { ColumnSelectionDialogComponent } from '@components/tables/column-selection-dialog/column-selection-dialog.component';
import {
  COL_ROW_ACTION,
  COL_SELECT,
  CheckboxChangeEvent,
  CheckboxFiles,
  DataType,
  HTTableColumn,
  HTTableEditable
} from '@components/tables/ht-table/ht-table.models';

import { BaseDataSource } from '@datasources/base.datasource';

import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

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
  styleUrls: ['./ht-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class HTTableComponent implements OnInit, AfterViewInit, OnDestroy {
  /** The list of column names to be displayed in the table. */
  displayedColumns: string[] = [];
  selectedFilterColumn: string = '_id';
  filterableColumns: HTTableColumn[] = [];
  colSelect = COL_SELECT;
  colRowAction = COL_ROW_ACTION;

  /** Flag to indicate if data is being loaded */
  loading = true;
  loadingTimeoutSubscription: Subscription;

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

  /** Flag to enable or disable cmd task attack checkbox. */
  @Input() isCmdTask = false;

  /** Selected checkbox Cmd files */
  @Input() isCmdFiles: CheckboxFiles;

  /** Flag to enable or disable cmd preprocessor attack checkbox. */
  @Input() isCmdPreproAttack = false;

  /** Flag to add dual label text. */
  @Input() isCmdLabel: string;

  /** Flag to enable or disable filtering. */
  @Input() isFilterable = false;

  /** Flag to show the export button. */
  @Input() showExport = true;

  /** Flag show archived data. */
  @Input() isArchived = false;

  /** The list of table columns and their configurations. */
  @Input() tableColumns: HTTableColumn[] = [];

  /** Pagination sizes to choose from. */
  @Input() paginationSizes: number[] = [5, 25, 50, 100, 250, 500, 1000, 5000];

  /** Default page size for pagination. */
  @Input() defaultPageSize = this.paginationSizes[1];

  /** Default start page. */
  @Input() defaultStartPage = undefined;

  /** Default start page. */
  @Input() defaultBeforePage = undefined;

  /** Default pagination index */
  @Input() defaultIndex = 0;

  /** Default total items index */
  @Input() defaultTotalItems = 0;

  /** Flag to enable  temperature Information dialog */
  @Input() hasTemperatureInformation = false;

  @Input() contextMenuService: ContextMenuService;

  /** Flag to enable auto refresh control, default: false */
  @Input() supportsAutoRefresh = false;

  /** Flag to color a table row */
  @Input() rowClass: (row: any) => string;

  /** Event emitter for when the user triggers a row action */
  @Output() rowActionClicked: EventEmitter<ActionMenuEvent<any>> = new EventEmitter<ActionMenuEvent<any>>();

  /** Event emitter for when the user triggers a bulk action */
  @Output() bulkActionClicked: EventEmitter<ActionMenuEvent<any>> = new EventEmitter<ActionMenuEvent<any>>();

  /** Event emitter for when the user triggers an export action */
  @Output() exportActionClicked: EventEmitter<ActionMenuEvent<any>> = new EventEmitter<ActionMenuEvent<any>>();

  /** Event emitter for when the user saves an editable input */
  @Output() editableSaved: EventEmitter<HTTableEditable<any>> = new EventEmitter<HTTableEditable<any>>();

  /** Event emitter for when the user saves a checkbox */
  @Output() editableCheckbox: EventEmitter<HTTableEditable<any>> = new EventEmitter<HTTableEditable<any>>();

  /** Event emitter for checkbox attack */
  @Output() checkboxChanged: EventEmitter<CheckboxChangeEvent> = new EventEmitter();

  /** Event emitter for checkbox attack */
  @Output() temperatureInformationClicked: EventEmitter<any> = new EventEmitter();
  @Output() selectedFilterColumnChanged: EventEmitter<string> = new EventEmitter();
  @Output() emitCopyRowData: EventEmitter<BaseModel> = new EventEmitter();
  @Output() emitFullHashModal: EventEmitter<JHash> = new EventEmitter();
  @Output() linkClicked = new EventEmitter();

  /** Fetches user customizations */
  @Output() backendSqlFilter: EventEmitter<string> = new EventEmitter();

  private uiSettings: UISettingsUtilityClass;

  @ViewChild('bulkMenu') bulkMenu: BulkActionMenuComponent;
  filterQueryFormGroup = new FormGroup({
    textFilter: new FormControl('')
  });
  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private storage: LocalStorageService<UIConfig>
  ) {}

  ngOnInit(): void {
    this.uiSettings = new UISettingsUtilityClass(this.storage);
    const displayedColumns = this.uiSettings.getTableSettings(this.name);
    this.defaultPageSize = this.uiSettings['uiConfig']['tableSettings'][this.name]['page'];
    this.defaultStartPage = this.uiSettings['uiConfig']['tableSettings'][this.name]['start'];
    this.defaultBeforePage = this.uiSettings['uiConfig']['tableSettings'][this.name]['before'];
    this.defaultIndex = this.uiSettings['uiConfig']['tableSettings'][this.name]['index'];
    this.defaultTotalItems = this.uiSettings['uiConfig']['tableSettings'][this.name]['totalItems'];

    if (Array.isArray(displayedColumns)) {
      this.setDisplayedColumns(displayedColumns);
    } else {
      // Handle the case when the retrieved value is neither an array nor a TableConfig
      console.error(`Unexpected table configuration for key: ${this.name}`);
    }
    // ToDo. this should be done with the real data, only used as UI friendly
    this.loadingTimeoutSubscription = timer(5000)
      .pipe(take(1))
      .subscribe(() => {
        this.loading = false;
      });
    this.initFilterableColumns();
    this.onFilterColumnChange();
  }
  initFilterableColumns(): void {
    this.filterableColumns = this.tableColumns.filter((column) => column.dataKey && column.isSearchable);
    if (this.filterableColumns.length > 0) {
      this.selectedFilterColumn = this.filterableColumns[0]?.dataKey;
    }
  }
  // Handle filter column change
  onFilterColumnChange(): void {
    this.selectedFilterColumnChanged.emit(this.selectedFilterColumn);
  }

  ngAfterViewInit(): void {
    // Configure paginator and sorting
    if (this.isPageable) {
      this.dataSource.paginator = this.matPaginator;
      // Get saved Pagesize from local storage, otherwise use default value
      // Get saved Pagesize from local storage, otherwise use default value
      this.dataSource.pageSize = this.defaultPageSize;
      // Get saved start page
      this.dataSource.pageAfter = this.defaultStartPage;
      // Get saved before page
      this.dataSource.pageBefore = this.defaultBeforePage;
      this.dataSource.index = this.defaultIndex;
      this.dataSource.totalItems = this.defaultTotalItems;

      this.dataSource.pageAfter = this.defaultStartPage;
      // Get saved before page
      this.dataSource.pageBefore = this.defaultBeforePage;
      this.dataSource.index = this.defaultIndex;
      this.dataSource.totalItems = this.defaultTotalItems;
    }

    // Search item
    this.dataSource.filter = this.uiSettings['uiConfig']['tableSettings'][this.name]['search'];
    // Sorted header arrow and sorting initialization
    this.dataSource.sortingColumn = this.uiSettings['uiConfig']['tableSettings'][this.name]['order'];
    if (this.dataSource.sortingColumn) {
      this.matSort.sort({
        id: this.dataSource.sortingColumn.id,
        start: this.dataSource.sortingColumn.direction,
        disableClear: false
      });
    }
    this.dataSource.sort = this.matSort;
    this.matSort.sortChange.subscribe(() => {
      this.uiSettings.updateTableSettings(this.name, {
        start: undefined,
        before: undefined,
        page: this.dataSource.pageSize, // Store the new page size
        index: this.dataSource.index, //store the new table index
        totalItems: this.dataSource.totalItems
      });

      // Update pagination configuration in the data source
      this.dataSource.setPaginationConfig(
        this.dataSource.pageSize,
        this.dataSource.totalItems,
        undefined,
        undefined,
        0
      );
    });
  }

  ngOnDestroy(): void {
    if (this.loadingTimeoutSubscription) {
      this.loadingTimeoutSubscription.unsubscribe();
    }
  }

  onLinkClicked() {
    this.linkClicked.emit();
  }

  copyRowDataEmit(event: JHash) {
    this.emitCopyRowData.emit(event);
  }

  showFullHashModalEmit(event: JHash): void {
    this.emitFullHashModal.emit(event);
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
        this.uiSettings.updateTableSettings(this.name, {
          columns: selectedColumns
        });
        this.cd.detectChanges();
      }
    });
  }

  /**
   * Handles the click event when a column header is clicked for sorting.
   * Updates the sorting order in the UI settings based on the clicked column.
   *
   * @param {any} column - The column that was clicked for sorting.
   * @returns {void}
   */
  onColumnHeaderClick(column: any): void {
    const sorting = {
      ...column,
      direction: this.dataSource.sort['_direction']
    };
    this.dataSource.sortingColumn = sorting;
    this.uiSettings.updateTableSettings(this.name, {
      order: sorting
    });
    this.dataSource.reload();
  }

  private filterKeys(original: { [key: string]: string }, include: string[]): any {
    const filteredObject: { [key: string]: string } = {};

    for (const attribute of include) {
      if (Object.prototype.hasOwnProperty.call(original, attribute)) {
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
      this.displayedColumns.push(COL_SELECT + '');
    }
    for (const num of columnNames) {
      if (num < Object.keys(this.columnLabels).length) {
        this.displayedColumns.push(num + '');
      }
    }

    if (this.contextMenuService !== undefined && this.contextMenuService.getHasContextMenu()) {
      // Add action menu if enabled
      this.displayedColumns.push(COL_ROW_ACTION + '');
    }
  }

  /**
   * Determines the position of the sorting arrow for the specified column.
   * If the column is currently sorted, returns the position based on the saved sorting order.
   * If the column is not sorted, returns null.
   *
   * @param {any} tableColumn - The column to determine the sorting arrow position for.
   * @returns {'before' | 'after' | null} The position of the sorting arrow.
   *   - 'before': The arrow should be displayed before the column label.
   *   - 'after': The arrow should be displayed after the column label.
   *   - null: No sorting arrow should be displayed for the column.
   */
  setColumnSorting(tableColumn: any): 'before' | 'after' {
    if (this.dataSource.sortingColumn && this.dataSource.sortingColumn.id === tableColumn.id) {
      return this.dataSource.sortingColumn.direction === 'asc' ? 'before' : 'after';
    } else {
      return null; // or set a default arrow position if no saved sorting
    }
  }

  /**
   * Applies a filter to the table based on user input.
   */
  /*   applyFilter() {
    if (this.filterFn) {
      this.dataSource.filterData(this.filterFn);
      this.uiSettings.updateTableSettings(this.name, {
        search: this.dataSource.filter
      });
    }
  } */
  emitFilterValue(): void {
    this.backendSqlFilter.emit(this.filterQueryFormGroup.get('textFilter').value);
  }
  /**
   * Clears a filter to the table based on user input.
   */
  /*   clearFilter() {
    // Reset the filter function to a default that passes all items
    const defaultFilterFn: (item: BaseModel, filterValue: string) => boolean = () => true;

    // Reapply the default filter function
    this.dataSource.filterData(defaultFilterFn);
    this.dataSource.filter = '';
    this.uiSettings.updateTableSettings(this.name, {
      search: ''
    });
  } */

  /**
   * Checks if a row is selected.
   *
   * @param row - The row to check.
   */
  isSelected(row: any): boolean {
    if (Array.isArray(this.isCmdFiles) && this.isCmdFiles.length > 0) {
      return this.isCmdFiles.includes(row._id);
    } else {
      return this.dataSource.isSelected(row);
    }
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
   * Handles the change event for the attack checkbox.
   *
   * @param event - The MatCheckboxChange event.
   * @param row - The data of the row.
   * @param type - The type of the column (CMD, main attack, or preprocessor).
   */
  toggleAttack(event: MatCheckboxChange, row: any, type: string): void {
    // Handle the change event for the Cmd Attack checkbox
    const checked = event.checked;

    // Emit the event with specific properties
    this.checkboxChanged.emit({
      row, // All row data
      columnType: type, // Column type CMD main attack or preprocessor
      checked: checked // Boolean
    });
  }
  // emit when Temperature Information is clicked
  temperatureInformationEmit() {
    this.temperatureInformationClicked.emit();
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
    this.filterQueryFormGroup.get('textFilter').setValue('');
  }
  clearSearchBox(): void {
    this.filterQueryFormGroup.get('textFilter').setValue('');
  }
  /**
   * Handles the page change event, including changes in page size and page index.
   *
   * @param event - The `PageEvent` object containing information about the new page configuration.
   */
  onPageChange(event: PageEvent): void {
    /*     this.clearFilter();
     */ let pageAfter = this.dataSource.pageAfter;
    let pageBefore = this.dataSource.pageBefore;
    let index = event.pageIndex;
    if (index > this.dataSource.index) {
      pageBefore = undefined;
    } else if (index < this.dataSource.index) {
      pageAfter = undefined;
    }
    if (event.pageSize !== this.dataSource.pageSize) {
      // TODO This code happens when user changes the page size, now we will just reset and
      // go to the first page, ideally you want to stay on the page you previously were
      // and recalculate the page index. The problem is that, this is very hard to do,
      // because we use cursor-based pagination.
      index = 0;
      pageAfter = undefined;
      pageBefore = undefined;
    } else if (event.pageIndex !== 0) {
      // const originalData = this.dataSource.getOriginalData();
      // const ids = originalData.map(items => items.id);
      // if (event.pageIndex > event.previousPageIndex) {
      //   pageAfter = Math.max(...ids);
      // } else {
      //   pageBefore = Math.min(...ids);
      // }
    }

    this.uiSettings.updateTableSettings(this.name, {
      // start: pageAfter, // Store the new page index
      // before: pageBefore, // Store the new page before
      start: pageAfter,
      before: pageBefore,
      page: event.pageSize, // Store the new page size
      index: index, //store the new table index
      totalItems: this.dataSource.totalItems
    });

    // Update pagination configuration in the data source
    this.dataSource.setPaginationConfig(event.pageSize, this.dataSource.totalItems, pageAfter, pageBefore, index);
    /*     this.dataSource.setPaginationConfig(event.pageSize, this.dataSource.totalItems, pageAfter, pageBefore, index);
     */
    // Reload data with updated pagination settings
    this.dataSource.reload();
  }

  editableInputSaved(editable: HTTableEditable<any>): void {
    this.editableSaved.emit(editable);
  }

  editableCheckboxSaved(editable: any): void {
    this.editableCheckbox.emit(editable);
  }
}
