import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

import { ChangeDetectorRef } from '@angular/core';
import { GlobalService } from 'src/app/core/_services/main.service';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { environment } from 'src/environments/environment';

export abstract class ReportBaseDataSource<T> implements DataSource<T> {
  /**
   * Copy of the original dataSubject data used for filtering
   */
  private originalData: T[] = [];

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
   * An array of report.
   */
  protected dataStructure: any[] = [];

  /**
   * Max rows in API response
   */
  protected maxResults = environment.config.prodApiMaxResults;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected service: GlobalService,
    protected uiService: UIConfigService
  ) {}

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

  setDataStructure(data: any): void {
    this.dataStructure = data;
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
}
