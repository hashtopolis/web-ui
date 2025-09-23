import { Subject, Subscription, timer } from 'rxjs';

import { Injectable, OnDestroy } from '@angular/core';

import { UIConfig } from '@models/config-ui.model';

import { AlertService } from '@services/shared/alert.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

/**
 * Service to manage auto-refresh functionality.
 * Components can subscribe to `refresh$` to get notified of refresh events.
 * The service uses RxJS `timer` to emit events at specified intervals.
 * It also tracks the timestamp of the next scheduled refresh.
 * Components can use this timestamp to display countdowns or next refresh info.
 * The service ensures proper cleanup of subscriptions on destruction.
 * Example usage:
 * ```typescript
 * constructor(private autoRefreshService: AutoRefreshService) {}
 * ngOnInit() {
 *   this.autoRefreshService.refresh$.subscribe(() => {
 *     // Handle refresh logic here
 *   });
 *   this.autoRefreshService.start(60000); // Start auto-refresh every 60 seconds
 * }
 * ngOnDestroy() {
 *   this.autoRefreshService.stop(); // Stop auto-refresh when component is destroyed
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AutoRefreshService implements OnDestroy {
  /** Subject to emit refresh events */
  private refreshSubject = new Subject<void>();
  /** Observable that components can subscribe to for refresh events */
  readonly refresh$ = this.refreshSubject.asObservable();
  /** Subscription for the timer */
  private timerSub?: Subscription;

  /** Timestamp of the next scheduled refresh */
  nextRefreshTimestamp!: number;

  /** UI Settings Utility */
  uiSettings: UISettingsUtilityClass;

  constructor(
    private localStorageService: LocalStorageService<UIConfig>,
    private alertService: AlertService
  ) {
    this.uiSettings = new UISettingsUtilityClass(this.localStorageService);
  }

  /**
   * Get the current refresh interval from settings (in seconds).
   */
  get refreshInterval(): number {
    return this.uiSettings.getSetting('refreshInterval');
  }

  /**
   * Returns whether auto-refresh page reload is enabled in UI settings.
   */
  get refreshPage(): boolean {
    return this.uiSettings.getSetting<boolean>('refreshPage');
  }

  /**
   * Start auto-refresh timer.
   * @param intervalMs Interval in milliseconds
   * @param options Configuration options:
   *   - immediate: whether to trigger the first refresh immediately (default: true)
   */
  private start(intervalMs: number, options: { immediate?: boolean } = {}): void {
    const { immediate = true } = options;
    this.stop();
    this.nextRefreshTimestamp = Date.now() + intervalMs;

    this.timerSub = timer(immediate ? 0 : intervalMs, intervalMs).subscribe(() => {
      this.refreshSubject.next();
      this.nextRefreshTimestamp = Date.now() + intervalMs;
    });
  }

  /**
   * Stop the auto-refresh timer.
   */
  private stop(): void {
    this.nextRefreshTimestamp = undefined;
    if (this.timerSub) {
      this.timerSub.unsubscribe();
      this.timerSub = undefined;
    }
  }

  /**
   * Configure auto-refresh in one step.
   * Updates settings, starts/stops refresh, and shows a message.
   * @param flag Whether to enable or disable auto-refresh
   * @param options Configuration options:
   *   - immediate: whether to trigger the first refresh immediately (default: true)
   */
  toggleAutoRefresh(flag: boolean, options: { immediate?: boolean } = {}): void {
    this.uiSettings.updateSettings({ refreshPage: flag });

    if (flag) {
      this.start(this.refreshInterval * 1000, options);
      this.alertService.showSuccessMessage('Autoreload is enabled');
    } else {
      this.stop();
      this.alertService.showSuccessMessage('Autoreload is paused');
    }
  }

  /**
   * Start auto-refresh with the current interval from settings.
   * @param options Configuration options:
   *   - immediate: whether to trigger the first refresh immediately (default: true)
   */
  startAutoRefresh(options: { immediate?: boolean } = {}): void {
    this.start(this.refreshInterval * 1000, options);
  }

  /**
   * Stop auto-refresh.
   */
  stopAutoRefresh(): void {
    this.stop();
  }

  /**
   * Cleanup on service destruction.
   */
  ngOnDestroy(): void {
    this.stop();
  }
}
