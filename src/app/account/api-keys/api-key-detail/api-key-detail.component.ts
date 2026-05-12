import { zApiTokenResponse } from '@generated/api/zod';
import { firstValueFrom } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiTokenStatus, JApiToken, computeApiTokenStatus } from '@models/api-token.model';
import { UIConfig, uiConfigDefault } from '@models/config-ui.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { formatUnixTimestamp, lastValidSecond } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-api-key-detail',
  templateUrl: './api-key-detail.component.html',
  standalone: false
})
export class ApiKeyDetailComponent implements OnInit {
  private gs = inject(GlobalService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alert = inject(AlertService);
  private serializer = inject(JsonAPISerializer);
  private settingsService = inject<LocalStorageService<UIConfig>>(LocalStorageService);
  private titleService = inject(AutoTitleService);

  protected readonly ApiTokenStatus = ApiTokenStatus;

  // null until fetched
  token: JApiToken | null = null;
  status: ApiTokenStatus | null = null;
  loading = true;
  notFound = false;
  loadError = false;

  protected dateFormat = uiConfigDefault.timefmt;

  ngOnInit() {
    this.titleService.set(['API Key Details']);
    const fmt = new UISettingsUtilityClass(this.settingsService).getSetting('timefmt');
    if (fmt) {
      this.dateFormat = fmt;
    }
    this.loadToken();
  }

  private async loadToken(): Promise<void> {
    const id = Number(this.route.snapshot.params['id']);
    if (!Number.isFinite(id)) {
      this.notFound = true;
      this.loading = false;
      return;
    }

    try {
      const params = new RequestParamBuilder().addInclude('user').create();
      const response = await firstValueFrom(this.gs.get(SERV.API_TOKENS, id, params));
      const token: JApiToken = this.serializer.deserialize(response, zApiTokenResponse, {
        include: ['user']
      });
      this.token = token;
      this.status = computeApiTokenStatus(token);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) {
        this.notFound = true;
        this.alert.showErrorMessage('Could not load API key.');
      } else {
        this.loadError = true;
        this.alert.showErrorMessage('Could not load API key — please try again later.');
      }
    } finally {
      this.loading = false;
    }
  }

  formatTimestamp(ts: number): string {
    return formatUnixTimestamp(ts, this.dateFormat);
  }

  /** Format an exclusive endValid cutoff as the last second of validity. */
  formatExpiry(endValidSec: number): string {
    return formatUnixTimestamp(lastValidSecond(endValidSec), this.dateFormat);
  }

  goBack(): void {
    void this.router.navigate(['/account/api-keys']);
  }
}
