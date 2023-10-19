import { catchError, finalize, map, mergeMap, toArray } from 'rxjs/operators';
import { from, of, Observable, Subscription, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';

import { GlobalService } from '../main.service';

@Injectable({
  providedIn: 'root'
})
export class BulkService {

  constructor(
    private gs: GlobalService
  ) {}

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

  setPath(path: string) {
    this.path = path;
  }

  /**
   * Handles bulk actions such as update and delete
   * Displays a progress bar and one is complete return confirmation of action
   *
   * @param {number} percentage - Progress value
   */

  async performBulkDelete(
    progressCallback: (percentage: number) => void
  ): Promise<boolean> {
    const Items = this.Items;
    const totalItems = Items.length;
    let deletedItems = 0;

    // Create an array to collect the results (true for success, false for failure)
    const results: boolean[] = [];

    const itemObservables: Observable<boolean>[] = [];

    Items.forEach((item) => {
      const observable = this.gs.delete(this.path, item).pipe(
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
    const resultsArray = await forkJoin(itemObservables).toPromise();

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

    async performBulkUpdate(
      progressCallback: (percentage: number) => void
    ): Promise<boolean> {
      const Items = this.Items;
      const Value = this.Value;
      const totalItems = Items.length;
      let deletedItems = 0;

      // Create an array to collect the results (true for success, false for failure)
      const results: boolean[] = [];

      const itemObservables: Observable<boolean>[] = [];

      console.log(this.path)

      Items.forEach((item) => {
        const observable = this.gs.update(this.path, item, Value).pipe(
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
      const resultsArray = await forkJoin(itemObservables).toPromise();

      // Check if any item deletion has failed
      const hasFailure = resultsArray.some((result) => result === false);

      return !hasFailure; // Return true if there are no failures
    }

}

