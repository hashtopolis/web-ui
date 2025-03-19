import {
  BehaviorSubject,
  Observable,
  Subscription,
  firstValueFrom
} from 'rxjs';
import { ChunkData, JChunk } from '../_models/chunk.model';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ChangeDetectorRef } from '@angular/core';
import { GlobalService } from '../_services/main.service';
import { HTTableColumn } from '../_components/tables/ht-table/ht-table.models';
import { ResponseWrapper } from '../_models/response.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';
import { SelectionModel } from '@angular/cdk/collections';
import { UIConfigService } from '../_services/shared/storage.service';
import { environment } from '@src/environments/environment';
import { JsonAPISerializer } from '../_services/api/serializer-service';

/**
 * BaseDataSource is an abstract class for implementing data sources
 * for Angular Material tables. It provides common functionality for
 * data loading, sorting, filtering, and row selection.
 *
 * @template T - The type of data that the data source holds.
 * @template P - The type of paginator, extending MatTableDataSourcePaginator.
 */
export abstract class BaseDataSource<
  T,
  P extends MatTableDataSourcePaginator = MatTableDataSourcePaginator
> implements DataSource<T> {
  public pageSize = 10;
  public currentPage = 0;
  public totalItems = 0;
  public sortingColumn;
  /**
   * Selection model for row selection in the table.
   */
  public selection = new SelectionModel<T>(true, []);
  /**
   * Reference to the paginator, if pagination is enabled.
   */
  public paginator: P | null;
  /**
   * The filter string to be applied to the table data.
   */
  public filter: string;
  /**
   * Reference to MatSort for sorting support.
   */
  public sort: MatSort;
  public serializer: JsonAPISerializer;
  /**
   * Array of subscriptions that will be unsubscribed on disconnect.
   */
  protected subscriptions: Subscription[] = [];
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
   * Max rows in API response
   */
  protected maxResults = environment.config.prodApiMaxResults;
  /**
   * Copy of the original dataSubject data used for filtering
   */
  private originalData: T[] = [];

  constructor(
    protected cdr: ChangeDetectorRef,
    protected service: GlobalService,
    protected uiService: UIConfigService
  ) {
    this.serializer = new JsonAPISerializer();
  }

  /**
   * Gets the observable for the loading state.
   * @return An observable that emits boolean values representing the loading state.
   */
  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  /**
   * Sets the loading state and triggers change detection.
   * @param value - The boolean value representing the loading state to be set.
   */
  set loading(value: boolean) {
    this.loadingSubject.next(value);
    this.cdr.detectChanges();
  }

  /**
   * Gets the original unfiltered data for the table.
   * @returns {T[]} The original unfiltered data.
   */
  getOriginalData(): T[] {
    return this.originalData;
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
   * Disconnect the data source from a collection viewer and unsubscribe.
   *
   * @param _collectionViewer - The collection viewer to disconnect.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disconnect(_collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();

    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
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
    const sortDirection = this.sort.direction;
    const data = this.dataSubject.value.slice();
    const columnMapping = this.columns.find(
      (mapping) => mapping.id + '' === this.sort.active
    );

    if (!columnMapping) {
      console.error('Column mapping not found for label: ' + this.sort.active);
      return;
    }

    const property = columnMapping.dataKey;
    const isAsc = sortDirection === 'asc';

    const sortedData = data.sort((a, b) => {
      return this.compare(a[property], b[property], isAsc);
    });

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
      const filteredData = this.originalData.filter((item) =>
        filterFn(item, filterValue)
      );

      this.dataSubject.next(filteredData);
    }
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
    return !!(this.selection.hasValue() && !this.isAllSelected());
  }

  /**
   * Checks whether at least one row is selected in the table.
   *
   * @returns True if at least one row is selected; otherwise, false.
   */
  hasSelected(): boolean {
    return this.selection.hasValue();
  }

  /**
   * Sets the pagination configuration for the data source, including page size, current page, and total items.
   *
   * @param pageSize - The number of items to display per page.
   * @param currentPage - The index of the current page.
   * @param totalItems - The total number of items in the data source.
   */
  setPaginationConfig(
    pageSize: number,
    currentPage: number,
    totalItems: number
  ): void {
    this.pageSize = pageSize;
    this.currentPage = currentPage;
    this.totalItems = totalItems;
  }

  /**
   * Resets the data source by clearing filters, deselecting all rows, and returning to page 1 (if using pagination).
   */
  reset(firstPage: boolean): void {
    this.resetFilter();
    this.resetData();
    this.clearSelection();
    // Return to page 1 if using pagination
    if (firstPage && this.paginator) {
      this.paginator.firstPage();
    }
  }

  clearSelection(): void {
    this.selection.clear();
  }

  resetData(): void {
    this.dataSubject.next(this.originalData);
  }

  resetFilter(): void {
    this.filter = '';
  }

  getFirstRow(): T | undefined {
    const data = this.dataSubject.value;

    if (data.length > 0) {
      return data[0];
    } else {
      return undefined;
    }
  }

  abstract reload(): void;

  async getChunkData(
    id: number,
    isAgent = true,
    keyspace = 0
  ): Promise<ChunkData> {
    const chunktime = this.uiService.getUIsettings('chunktime').value;

    const dispatched: number[] = [];
    const searched: number[] = [];
    const cracked: number[] = [];
    const speed: number[] = [];
    const timespent: number[] = [];
    const now = Date.now();
    const tasks: number[] = !isAgent ? [id] : [];
    const agents: number[] = isAgent ? [id] : [];
    const current = 0;
    let params: {};

    if (isAgent) {
      params = { 'filter[agentId__eq]': id };
    } else {
      params = { 'filter[taskId__eq]': id };
    }

    const response: ResponseWrapper = await firstValueFrom(
      this.service.getAll(SERV.CHUNKS, params)
    );

    const responseBody = { data: response.data, included: response.included };
    const chunks = this.serializer.deserialize<JChunk[]>(responseBody);

    for (const chunk of chunks) {
      agents.push(chunk.agentId);
      tasks.push(chunk.taskId);

      // If progress is 100%, add total chunk length to dispatched
      if (chunk.progress >= 10000) {
        dispatched.push(chunk.length);
      }
      cracked.push(chunk.cracked);
      searched.push(chunk.checkpoint - chunk.skip);

      // Calculate speed for chunks completed within the last chunktime
      if (
        now / 1000 - Math.max(chunk.solveTime, chunk.dispatchTime) <
        chunktime &&
        chunk.progress < 10000
      ) {
        speed.push(chunk.speed);
      }

      if (chunk.dispatchTime > current) {
        timespent.push(chunk.solveTime - chunk.dispatchTime);
      } else if (chunk.solveTime > current) {
        timespent.push(chunk.solveTime - current);
      }
    }

    return {
      tasks: Array.from(new Set(tasks)),
      agents: Array.from(new Set(agents)),
      dispatched:
        keyspace && dispatched.length
          ? dispatched.reduce((a, i) => a + i, 0) / keyspace
          : 0,
      searched:
        keyspace && searched.length
          ? searched.reduce((a, i) => a + i, 0) / keyspace
          : 0,
      cracked: cracked.length ? cracked.reduce((a, i) => a + i, 0) : 0,
      speed: speed.length ? speed.reduce((a, i) => a + i, 0) : 0,
      timeSpent: timespent.length ? timespent.reduce((a, i) => a + i) : 0
    };
  }

  /**
   * Compare function used for sorting.
   */
  private compare(
    a: number | string,
    b: number | string,
    isAsc: boolean
  ): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
