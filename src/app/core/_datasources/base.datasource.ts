import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { CollectionViewer, DataSource, SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';

import { ChunkData, JChunk } from '@models/chunk.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { GlobalService } from '@services/main.service';
import { UIConfigService } from '@services/shared/storage.service';

import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { environment } from '@src/environments/environment';

/**
 * BaseDataSource is an abstract class for implementing data sources
 * for Angular Material tables. It provides common functionality for
 * data loading, sorting, filtering, and row selection.
 *
 * @template T - The type of data that the data source holds.
 * @template P - The type of paginator, extending MatTableDataSourcePaginator.
 */
export abstract class BaseDataSource<T, P extends MatPaginator = MatPaginator> implements DataSource<T> {
  public pageSize = 10;
  public currentPage = 0;
  public totalItems = 0;
  public sortingColumn: { id: string; direction: SortDirection; isSortable: boolean };
  public pageAfter = undefined;
  public pageBefore = undefined;
  public index = 0;
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

  private readonly chunkTime: number = 600;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected service: GlobalService,
    protected uiService: UIConfigService
  ) {
    this.serializer = new JsonAPISerializer();
    const chunktimeSetting: string = this.uiService.getUIsettings('chunktime').value;
    if (chunktimeSetting) {
      this.chunkTime = Number(chunktimeSetting);
    }
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
    const columnMapping = this.columns.find((mapping) => mapping.id + '' === this.sort.active);

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
      const filteredData = this.originalData.filter((item) => filterFn(item, filterValue));

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
    const numSelected = this.selection.selected ? this.selection.selected.length : 0;
    const numRows = this.dataSubject && this.dataSubject.value ? this.dataSubject.value.length : 0;

    return !!(numSelected > 0 && numSelected === numRows);
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
   * @param totalItems - The total number of items in the data source.
   * @param pageAfter - the pagination after parameter to retrieve data after this index.
   * @param pageAfter - the pagination before parameter to retrieve data before this index.
   * @param index - the pagination index.
   */
  setPaginationConfig(pageSize: number, totalItems: number, pageAfter: number, pageBefore: number, index: number): void {
    this.pageSize = pageSize;
    this.totalItems = totalItems;
    this.pageAfter = pageAfter;
    this.pageBefore = pageBefore;
    this.index = index;
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

  abstract reload(): void;

  /**
   * Convert all JChunk objects related to a task or agent to a ChunkData object
   * @param id - model ID of task or agent
   * @param chunks - JChunk collection containing all tasks or agents related to the currenty displayed table object
   * @param isAgent - true, ID is an agent ID, false: ID is a task ID
   * @param keyspace - keyspace index
   * @return mew ChunkData object containing data from all related JChunk objects
   * @protected
   */
  protected convertChunks(id: number, chunks: Array<JChunk>, isAgent: boolean = true, keyspace = 0): ChunkData {
    let dispatched = 0;
    let searched = 0;
    let cracked: number = 0;
    let speed: number = 0;
    let timespent: number = 0;
    const tasks: Set<number> = new Set();
    const agents: Set<number> = new Set();

    if (isAgent) agents.add(id);
    else tasks.add(id);

    const filterFn = isAgent ? (element: JChunk) => element.agentId === id : (element: JChunk) => element.taskId === id;
    chunks.filter(filterFn).forEach((chunk) => {
      agents.add(chunk.agentId);
      tasks.add(chunk.taskId);

      // If progress is 100%, add total chunk length to dispatched
      if (chunk.progress >= 10000) {
        dispatched += chunk.length;
      }
      cracked += chunk.cracked;
      searched += chunk.checkpoint - chunk.skip;

      // Calculate speed for chunks completed within the last chunktime
      if (
        Date.now() / 1000 - Math.max(chunk.solveTime, chunk.dispatchTime) < this.chunkTime &&
        chunk.progress < 10000
      ) {
        speed += chunk.speed;
      }

      if (chunk.dispatchTime > 0) {
        timespent += chunk.solveTime - chunk.dispatchTime;
      } else if (chunk.solveTime > 0) {
        timespent += chunk.solveTime;
      }
    });

    return {
      tasks: Array.from(tasks),
      agents: Array.from(agents),
      dispatched: keyspace ? dispatched / keyspace : 0,
      searched: keyspace ? searched / keyspace : 0,
      cracked: cracked,
      speed: speed,
      timeSpent: timespent
    };
  }

  /**
   * Compare function used for sorting.
   */
  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
