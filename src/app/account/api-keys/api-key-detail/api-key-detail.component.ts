import { zApiTokenResponse } from '@generated/api/zod';
import { firstValueFrom } from 'rxjs';

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
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

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

  /** Loaded token. Null until the GET resolves; the template gates on this. */
  token: JApiToken | null = null;
  /** Status derived from the token's lifecycle (active / expired / revoked). */
  status: ApiTokenStatus | null = null;
  loading = true;
  notFound = false;

  protected dateFormat: string;

  constructor() {
    const uiSettings = new UISettingsUtilityClass(this.settingsService);
    const fmt = uiSettings.getSetting('timefmt');
    this.dateFormat = fmt ? fmt : uiConfigDefault.timefmt;
    this.titleService.set(['API Key Details']);
  }

  async ngOnInit(): Promise<void> {
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
    } catch {
      this.notFound = true;
      this.alert.showErrorMessage('Could not load API key.');
    } finally {
      this.loading = false;
    }
  }

  formatTimestamp(ts: number): string {
    return formatUnixTimestamp(ts, this.dateFormat);
  }

  goBack(): void {
    void this.router.navigate(['/account/api-keys']);
  }
}
