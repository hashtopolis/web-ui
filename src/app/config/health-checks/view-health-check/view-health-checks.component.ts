import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  UIConfig,
  uiConfigDefault
} from 'src/app/core/_models/config-ui.model';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { formatUnixTimestamp } from 'src/app/shared/utils/datetime';
import { GlobalService } from 'src/app/core/_services/main.service';
import { HealthCheck } from 'src/app/core/_models/health-check.model';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { UISettingsUtilityClass } from 'src/app/shared/utils/config';
import { LocalStorageService } from 'src/app/core/_services/storage/local-storage.service';

@Component({
  selector: 'app-view-health-checks',
  templateUrl: './view-health-checks.component.html'
})
export class ViewHealthChecksComponent implements OnInit, OnDestroy {
  // The index of the edited health check.
  viewedHealthCIndex: number;
  // The health check object.
  public healthc: HealthCheck;

  //Date format
  protected uiSettings: UISettingsUtilityClass;
  formatUnixTimestamp = formatUnixTimestamp;
  protected dateFormat: string;

  /**
   * Constructs a new instance of the YourComponentName class.
   * @param {AutoTitleService} titleService - The service for managing auto titles.
   * @param {ActivatedRoute} route - The activated route.
   * @param {GlobalService} gs - The global service.
   */
  constructor(
    protected settingsService: LocalStorageService<UIConfig>,
    private unsubscribeService: UnsubscribeService,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.onInitialize();
    titleService.set(['View Health Checks']);
  }

  /**
   * Component initialization get ID to use in Table component
   */
  onInitialize(): void {
    this.viewedHealthCIndex = +this.route.snapshot.params['id'];
    this.uiSettings = new UISettingsUtilityClass(this.settingsService);
    this.dateFormat = this.getDateFormat();
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Loads data, specifically health checks, for the view component.
   */
  loadData(): void {
    const loadSubscription$ = this.gs
      .get(SERV.HEALTH_CHECKS, this.viewedHealthCIndex)
      .subscribe((healthCheck: HealthCheck) => {
        this.healthc = healthCheck;
      });
    this.unsubscribeService.add(loadSubscription$);
  }

  private getDateFormat(): string {
    const fmt = this.uiSettings.getSetting<string>('timefmt');

    return fmt ? fmt : uiConfigDefault.timefmt;
  }
}
