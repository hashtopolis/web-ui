import { zApiTokenPostPatchResponse } from '@generated/api/zod';
import { firstValueFrom } from 'rxjs';

import { Component, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { JApiToken } from '@models/api-token.model';
import { Permission } from '@models/global-permission-group.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { ApiKeyRevealStore } from '@services/api-key-reveal.store';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { NewApiKeyForm, getNewApiKeyForm } from '@src/app/account/api-keys/new-api-key/new-api-key.form';
import { PermissionValues } from '@src/app/core/_constants/userpermissions.config';
import {
  daysBetween,
  endOfDay,
  startOfDay,
  startOfNextDay,
  unixTimestampFromDate
} from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-new-api-key',
  templateUrl: './new-api-key.component.html',
  standalone: false
})
export class NewApiKeyComponent implements OnInit {
  private gs = inject(GlobalService);
  private router = inject(Router);
  private alert = inject(AlertService);
  private permissionService = inject(PermissionService);
  private revealStore = inject(ApiKeyRevealStore);
  private titleService = inject(AutoTitleService);

  private static readonly DEFAULT_VALIDITY_DAYS = 90;

  form: FormGroup<NewApiKeyForm> = getNewApiKeyForm(NewApiKeyComponent.DEFAULT_VALIDITY_DAYS);
  /**
   * The current user's permission map. The matrix only allows toggling cells
   * the user holds (`granted[key] === true`); the rest render disabled with
   * an explanatory tooltip. Backend would reject any scope the user can't
   * grant themselves, so this filter shapes both the UI and avoids
   * guaranteed-failed requests.
   */
  granted?: Permission;
  loadingScopes = false;
  submitting = false;

  ngOnInit(): void {
    this.titleService.set(['New API Key']);
    void this.loadGranted();
  }

  private async loadGranted(): Promise<void> {
    this.loadingScopes = true;
    try {
      this.granted = await firstValueFrom(this.permissionService.loadPermissions());
      // Permission is a Record<string, boolean>, so the filtered keys come back as
      // string[]. We trust the backend's map to be keyed by valid PermissionValues.
      const allGranted = Object.entries(this.granted)
        .filter(([, held]) => held)
        .map(([key]) => key) as PermissionValues[];
      this.form.controls.scopes.setValue(allGranted);
    } catch {
      this.alert.showErrorMessage('Could not load available scopes for this user.');
    } finally {
      this.loadingScopes = false;
    }
  }

  onSelectionChange(next: PermissionValues[]): void {
    this.form.controls.scopes.setValue(next);
    this.form.controls.scopes.markAsDirty();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { validFrom, validUntil, scopes } = this.form.getRawValue();
    if (!validFrom || !validUntil) {
      this.alert.showErrorMessage('Please select a valid date range.');
      return;
    }

    this.submitting = true;
    try {
      const payload = {
        scopes,
        startValid: unixTimestampFromDate(startOfDay(validFrom)),
        // endValid is an *exclusive* cutoff: the token is valid through the
        // whole picked day and expires exactly at the next-day midnight.
        endValid: unixTimestampFromDate(startOfNextDay(validUntil)),
        userId: this.gs.userId,
        isRevoked: false
      };

      const response = await firstValueFrom(this.gs.create(SERV.API_TOKENS, payload));
      const created: JApiToken = new JsonAPISerializer().deserialize(response, zApiTokenPostPatchResponse);

      if (!created.token) {
        this.alert.showErrorMessage('API key was created but no token was returned. Please contact an administrator.');
        await this.router.navigate(['/account/api-keys']);
        return;
      }

      this.revealStore.set(created.token);
      this.alert.showSuccessMessage('API key created.');
      await this.router.navigate(['/account/api-keys']);
    } catch {
      this.alert.showErrorMessage('Could not create API key.');
    } finally {
      this.submitting = false;
    }
  }

  get validityDays(): number | null {
    const from = this.form.controls.validFrom.value;
    const until = this.form.controls.validUntil.value;
    if (!from || !until) {
      return null;
    }
    const days = daysBetween(startOfDay(from), endOfDay(until));
    return days > 0 ? days : null;
  }
}
