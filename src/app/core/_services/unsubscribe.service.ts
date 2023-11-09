import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

/**
 * Service for managing and unsubscribing from subscriptions in Angular components.
 */
@Injectable({
  providedIn: 'root',
})
export class UnsubscribeService {
  private subscriptions: Subscription[] = [];

  /**
   * Adds a subscription to the list of managed subscriptions.
   * @param subscription - The subscription to be managed and unsubscribed later.
   */
  add(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }

  /**
   * Unsubscribes from all managed subscriptions and clears the subscription list.
   */
  unsubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    });
    this.subscriptions.length = 0; // Clear the array
  }
}
