import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { GlobalService } from "../_services/main.service";
import { MatTableDataSourcePaginator } from "@angular/material/table";
import { HTTableColumn } from "../_components/ht-table/ht-table.models";
import { MatSort } from "@angular/material/sort";
import { SelectionModel } from '@angular/cdk/collections';
import { UIConfigService } from "../_services/shared/storage.service";

/**
 * BaseDataSource is an abstract class for implementing data sources
 * for Angular Material tables. It provides common functionality for
 * data loading, sorting, filtering, and row selection.
 *
 * @template T - The type of data that the data source holds.
 * @template P - The type of paginator, extending MatTableDataSourcePaginator.
 */
export abstract class BaseDataSource<T, P extends MatTableDataSourcePaginator = MatTableDataSourcePaginator> implements DataSource<T> {


  public pageSize = 10;
  public currentPage = 0;
  public totalItems = 0;

  /**
   * Copy of the original dataSubject data used for filtering 
   */
  private originalData: T[] = [];

  /**
   * BehaviorSubject to track the loading state.
   */
  protected loadingSubject = new BehaviorSubject<boolean>(false);

  /**
   * BehaviorSubject to track the data for the table.
   */
  protected dataSubject = new BehaviorSubject<T[]>([]);

  /**
   * An array of table columns.
   */
  protected columns: HTTableColumn[] = [];

  /**
   * Selection model for row selection in the table.
   */
  public selection = new SelectionModel<T>(true, []);

  /**
   * Observable to track the loading state.
   */
  public loading$ = this.loadingSubject.asObservable();

  /**
   * Reference to the paginator, if pagination is enabled.
   */
  public paginator: P | null

  /**
   * The filter string to be applied to the table data.
   */
  public filter: string

  /**
   * Reference to MatSort for sorting support.
   */
  public sort: MatSort

  constructor(protected service: GlobalService, protected uiService: UIConfigService) {
  }

  /**
   * Connect the data source to a collection viewer.
   *
   * @param _collectionViewer - The collection viewer to connect.
   * @returns Observable of the data source.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connect(_collectionViewer: CollectionViewer): Observable<T[]> {
    return this.dataSubject.asObservable();
  }

  /**
   * Disconnect the data source from a collection viewer.
   *
   * @param _collectionViewer - The collection viewer to disconnect.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disconnect(_collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  /**
   * Sets the data for the table.
   *
   * @param data - The data to be set in the data source.
   */
  setData(data: T[]): void {
    this.originalData = data;
    this.dataSubject.next(data);
  }

  /**
   * Sets the columns for the table.
   *
   * @param columns - An array of HTTableColumn for defining table columns.
   */
  setColumns(columns: HTTableColumn[]): void {
    this.columns = columns;
  }

  /**
   * Sorts the data based on the sort configuration.
   */
  sortData(): void {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return;
    }
    const sortDirection = this.sort.direction
    const data = this.dataSubject.value.slice();
    const columnMapping = this.columns.find(mapping => mapping.name === this.sort.active);

    if (!columnMapping) {
      console.error('Column mapping not found for label: ' + this.sort.active);
      return;
    }

    const property = columnMapping.dataKey;
    const isAsc = sortDirection === 'asc';

    const sortedData = data.sort((a, b) => {
      return this.compare(a[property], b[property], isAsc);
    })

    this.dataSubject.next(sortedData);
  }

  /**
   * Filters the data based on a filter function.
   *
   * @param filterFn - A function to filter the data based on filterValue.
   */
  filterData(filterFn: (item: T, filterValue: string) => boolean): void {
    const filterValue = this.filter.trim().toLowerCase();
    if (!filterValue) {
      this.dataSubject.next(this.originalData);
    } else {
      const filteredData = this.originalData.filter((item) => filterFn(item, filterValue));

      this.dataSubject.next(filteredData);
    }
  }

  /**
   * Compare function used for sorting.
   */
  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  /**
   * Toggle all rows' selection.
   */
  toggleAll() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSubject.value.forEach((row) => {
        this.selection.select(row);
      });
    }
  }

  /**
   * Checks whether all rows are selected.
   * 
   * @returns True if all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSubject.value.length;

    return !!(numSelected > 0 && numSelected === numRows);
  }

  // Select all rows.
  selectAll(): void {
    this.dataSubject.value.forEach((row) => this.selection.select(row));
  }

  // Select a specific row.
  selectRow(row: T): void {
    this.selection.select(row);
  }

  // Deselect a specific row.
  deselectRow(row: T): void {
    this.selection.deselect(row);
  }

  // Checks if a row is selected.
  isSelected(row: T): boolean {
    return this.selection.isSelected(row);
  }

  // Toggle selection for a specific row.
  toggleRow(row: T): void {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    } else {
      this.selection.select(row);
    }
  }

  /**
   * Checks whether the selection model is in an indeterminate state.
   *
   * @returns True if the selection is in an indeterminate state; otherwise, false.
   */
  indeterminate() {
    return !!(this.selection.hasValue() && !this.isAllSelected())
  }

  /**
   * Checks whether at least one row is selected in the table.
   *
   * @returns True if at least one row is selected; otherwise, false.
   */
  hasSelected(): boolean {
    return this.selection.hasValue()
  }

  /**
   * Sets the pagination configuration for the data source, including page size, current page, and total items.
   *
   * @param pageSize - The number of items to display per page.
   * @param currentPage - The index of the current page.
   * @param totalItems - The total number of items in the data source.
   */
  setPaginationConfig(pageSize: number, currentPage: number, totalItems: number): void {
    this.pageSize = pageSize;
    this.currentPage = currentPage;
    this.totalItems = totalItems;
  }

  /**
   * Resets the data source by clearing filters, deselecting all rows, and returning to page 1 (if using pagination).
   */
  reset(): void {
    // Clear any applied filters
    this.filter = '';
    this.dataSubject.next(this.originalData);

    // Deselect all selected rows
    this.selection.clear();

    // Return to page 1 if using pagination
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  getFirstRow(): T | undefined {
    const data = this.dataSubject.value;

    if (data.length > 0) {
      return data[0];
    } else {
      return undefined;
    }
  }

  abstract reload(): void
}