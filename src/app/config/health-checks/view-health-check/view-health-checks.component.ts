import { zHealthCheckResponse } from '@generated/api/zod';

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UIConfig, uiConfigDefault } from '@models/config-ui.model';
import { JHealthCheck } from '@models/health-check.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { LocalStorageService } from '@services/storage/local-storage.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-view-health-checks',
  templateUrl: './view-health-checks.component.html',
  standalone: false
})
export class ViewHealthChecksComponent implements OnInit, OnDestroy {
  // The index of the edited health check.
  viewedHealthCIndex: number;
  // The health check object.
  public healthc: JHealthCheck;

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
  protected settingsService = inject(LocalStorageService) as LocalStorageService<UIConfig>;
  private unsubscribeService = inject(UnsubscribeService);
  private titleService = inject(AutoTitleService);
  private route = inject(ActivatedRoute);
  private gs = inject(GlobalService);

  constructor() {
    this.onInitialize();
    this.titleService.set(['View Health Checks']);
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
      .subscribe((response: ResponseWrapper) => {
        const healthCheck: JHealthCheck = new JsonAPISerializer().deserialize(response, zHealthCheckResponse);
        this.healthc = healthCheck;
      });
    this.unsubscribeService.add(loadSubscription$);
  }

  private getDateFormat(): string {
    const fmt = this.uiSettings.getSetting('timefmt');

    return fmt ? fmt : uiConfigDefault.timefmt;
  }
}
