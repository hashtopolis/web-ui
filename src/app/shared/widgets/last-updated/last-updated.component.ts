import { Subscription, interval } from 'rxjs';


import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { UIConfig } from '@models/config-ui.model';

import { LocalStorageService } from '@services/storage/local-storage.service';

import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { formatDate } from '@src/app/shared/utils/datetime';

/**
 * Component to display the last updated time and a countdown to the next refresh.
 * Inputs:
 * - lastUpdated: Date of the last data load
 * - nextRefreshTimestamp: Timestamp (ms) of the next scheduled refresh
 * - refreshing: Boolean indicating if a refresh is currently in progress
 *
 * The component shows the last updated time formatted according to user settings.
 * It also displays a countdown timer to the next refresh, updating every second.
 * If a refresh is in progress, the countdown is hidden and a spinner is shown instead.
 *
 * Example usage:
 * ```html
 * <last-updated
 *   [lastUpdated]="lastUpdated"
 *   [nextRefreshTimestamp]="nextRefreshTimestamp"
 *   [refreshing]="isRefreshing">
 * </last-updated>
 * ```
 */
@Component({
  selector: 'last-updated',
  templateUrl: './last-updated.component.html',
  styleUrls: ['./last-updated.component.scss'],
  imports: [MatProgressSpinner],
  providers: [
    {
      provide: UISettingsUtilityClass,
      useFactory: (storage: LocalStorageService<UIConfig>) => new UISettingsUtilityClass(storage),
      deps: [LocalStorageService]
    }
  ]
})
export class LastUpdatedComponent implements OnInit, OnDestroy, OnChanges {
  /** The actual last time data was loaded */
  @Input() lastUpdated!: Date;

  /** Timestamp (ms) of the next scheduled refresh */
  @Input() nextRefreshTimestamp!: number;

  /** Whether a refresh is currently in progress */
  @Input() refreshing = false;

  /** Display string for countdown in mm:ss format */
  nextUpdateDisplay: string | null = null;

  /** Subscription for interval timer */
  private timerSubscription?: Subscription;

  /** Injected utility for UI settings */
  constructor(
    private util: UISettingsUtilityClass,
    private cd: ChangeDetectorRef
  ) {}

  /** Returns the formatted last updated time according to UI settings */
  get lastUpdatedDisplay(): string {
    return formatDate(this.lastUpdated, this.util.getSetting('timefmt'));
  }

  /** Initialize the countdown timer */
  ngOnInit(): void {
    this.startCountdown();
  }

  /** Handle changes to input properties */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nextRefreshTimestamp'] && changes['nextRefreshTimestamp'].currentValue) {
      this.updateCountdown(); // recalc immediately
      this.startCountdown(); // restart interval with the new timestamp
    }
  }

  /** Start or restart the countdown interval */
  private startCountdown(): void {
    this.timerSubscription?.unsubscribe();
    this.updateCountdown(); // ensure UI is correct on init

    this.timerSubscription = interval(250).subscribe(() => {
      this.updateCountdown();

      // stop interval once countdown reaches 00:00
      if (this.nextUpdateDisplay === '00:00') {
        this.timerSubscription?.unsubscribe();
      }
    });
  }

  /** Update countdown display based on the next refresh timestamp */
  private updateCountdown(): void {
    if (!this.nextRefreshTimestamp || this.refreshing) {
      this.nextUpdateDisplay = null;
      this.cd.detectChanges();
      return;
    }

    const diffMs = this.nextRefreshTimestamp - Date.now();
    if (diffMs <= 0) {
      this.nextUpdateDisplay = '00:00';
      this.cd.markForCheck();
      return;
    }

    const totalSec = Math.ceil(diffMs / 1000); // ceil keeps the last second visible
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;

    this.nextUpdateDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    this.cd.detectChanges();
  }

  /** Clean up the interval subscription */
  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}
