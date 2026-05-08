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
import { endOfDay, startOfDay } from '@src/app/shared/utils/datetime';

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

  form: FormGroup<NewApiKeyForm> = getNewApiKeyForm();
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

  get validityDays(): number | null {
    const from = this.form.controls.validFrom.value;
    const until = this.form.controls.validUntil.value;
    if (!from || !until) {
      return null;
    }
    const days = Math.round((until.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
    return days > 0 ? days : null;
  }

  ngOnInit(): void {
    this.titleService.set(['New API Key']);
    void this.loadGranted();
  }

  private async loadGranted(): Promise<void> {
    this.loadingScopes = true;
    try {
      this.granted = await firstValueFrom(this.permissionService.loadPermissions());
      const allGranted = Object.entries(this.granted)
        .filter(([, held]) => held)
        .map(([key]) => key);
      this.form.controls.scopes.setValue(allGranted);
    } catch {
      this.alert.showErrorMessage('Could not load available scopes for this user.');
    } finally {
      this.loadingScopes = false;
    }
  }

  onSelectionChange(next: string[]): void {
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
      return;
    }

    this.submitting = true;
    try {
      const payload = {
        scopes,
        startValid: Math.floor(startOfDay(validFrom).getTime() / 1000),
        endValid: Math.floor(endOfDay(validUntil).getTime() / 1000),
        userId: this.gs.userId,
        isRevoked: false
      };

      const response = await firstValueFrom(this.gs.create(SERV.API_TOKENS, payload));
      const created: JApiToken = new JsonAPISerializer().deserialize(response, zApiTokenPostPatchResponse);

      if (!created.token) {
        // No token in the response means we can't show the user anything useful;
        // the row will appear in the list but the secret is unrecoverable.
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
}
