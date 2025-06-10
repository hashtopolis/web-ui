import { catchError, map } from 'rxjs/operators';
import { Observable, forkJoin, of, firstValueFrom } from 'rxjs';

import { Injectable } from '@angular/core';
import { GlobalService } from '@services/main.service';
import { ServiceConfig } from '@services/main.config';

@Injectable({
  providedIn: 'root'
})
export class BulkService {
  private serviceConfig: ServiceConfig;
  constructor(private gs: GlobalService) {}

  Items: any[];
  Value: any;
  deleteDelay = 0;
  path: string;

  setItems(Items: any[]) {
    this.Items = Items;
  }

  setValue(Value: any[]) {
    this.Value = Value;
  }

  setServiceConfig(serviceConfig: ServiceConfig) {
    this.serviceConfig = serviceConfig;
  }

  /**
   * Handles bulk actions such as update and delete
   * Displays a progress bar and one is complete return confirmation of action
   *
   * @param {number} percentage - Progress value
   */

  async performBulkDelete(progressCallback: (percentage: number) => void): Promise<boolean> {
    const Items = this.Items;
    const totalItems = Items.length;
    let deletedItems = 0;

    // Create an array to collect the results (true for success, false for failure)
    const results: boolean[] = [];

    const itemObservables: Observable<boolean>[] = [];

    Items.forEach((item) => {
      const observable = this.gs.delete(this.serviceConfig, item).pipe(
        map(() => {
          deletedItems++;
          const progress = (deletedItems / totalItems) * 100;
          progressCallback(progress);
          return true; // Indicate success for each item
        }),
        catchError((error) => {
          // Handle errors
          return of(false); // Indicate failure for each item
        })
      );

      itemObservables.push(observable);
    });

    // Use forkJoin to wait for all item observables to complete
    const resultsArray = await firstValueFrom(forkJoin(itemObservables));

    // Check if any item deletion has failed
    const hasFailure = resultsArray.some((result) => result === false);

    return !hasFailure; // Return true if there are no failures
  }

  /**
   * Handles update bulk
   * Displays a progress bar and one is complete return confirmation of action
   *
   * @param {number} percentage - Progress value
   */

  async performBulkUpdate(progressCallback: (percentage: number) => void): Promise<boolean> {
    const Items = this.Items;
    const Value = this.Value;
    const totalItems = Items.length;
    let deletedItems = 0;

    // Create an array to collect the results (true for success, false for failure)
    const results: boolean[] = [];

    const itemObservables: Observable<boolean>[] = [];

    Items.forEach((item) => {
      const observable = this.gs.update(this.serviceConfig, item, Value).pipe(
        map(() => {
          deletedItems++;
          const progress = (deletedItems / totalItems) * 100;
          progressCallback(progress);
          return true; // Indicate success for each item
        }),
        catchError((error) => {
          // Handle errors
          return of(false); // Indicate failure for each item
        })
      );

      itemObservables.push(observable);
    });

    // Use forkJoin to wait for all item observables to complete
    const resultsArray = await firstValueFrom(forkJoin(itemObservables));

    // Check if any item deletion has failed
    const hasFailure = resultsArray.some((result) => result === false);

    return !hasFailure; // Return true if there are no failures
  }
}
