import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { HealthCheck } from 'src/app/core/_models/health-check.model';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';

@Component({
  selector: 'app-edit-health-checks',
  templateUrl: './edit-health-checks.component.html'
})
export class EditHealthChecksComponent implements OnInit, OnDestroy {
  // The index of the edited health check.
  editedHealthCIndex: number;
  // The health check object.
  public healthc: HealthCheck;

  /**
   * Constructs a new instance of the YourComponentName class.
   * @param {AutoTitleService} titleService - The service for managing auto titles.
   * @param {ActivatedRoute} route - The activated route.
   * @param {GlobalService} gs - The global service.
   */
  constructor(
    private unsubscribeService: UnsubscribeService,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.onInitialize();
    titleService.set(['Edit Health Checks']);
  }

  /**
   * Component initialization get ID to use in Table component
   */
  onInitialize(): void {
    this.editedHealthCIndex = +this.route.snapshot.params['id'];
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
      .get(SERV.HEALTH_CHECKS, this.editedHealthCIndex)
      .subscribe((healthCheck: HealthCheck) => {
        this.healthc = healthCheck;
      });
    this.unsubscribeService.add(loadSubscription$);
  }
}
