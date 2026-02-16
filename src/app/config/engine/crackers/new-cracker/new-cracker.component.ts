import { firstValueFrom } from 'rxjs';

import { Component, inject } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { CrackerBinaryRoleService } from '@services/roles/binaries/cracker-binary-role.service';
import { AlertService } from '@services/shared/alert.service';

import { NewCrackerForm, getNewCrackerForm } from '@src/app/config/engine/crackers/new-cracker/new-cracker.form';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { GridModule } from '@src/app/shared/grid-containers/grid.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';

@Component({
  selector: 'app-new-cracker',
  imports: [ButtonsModule, FlexModule, FormsModule, GridModule, InputModule, PageTitleModule, ReactiveFormsModule],
  templateUrl: './new-cracker.component.html'
})
export class NewCrackerComponent {
  private gs = inject(GlobalService);
  private router = inject(Router);
  private alert = inject(AlertService);
  protected roleService = inject(CrackerBinaryRoleService);

  newCrackerForm: FormGroup<NewCrackerForm> = getNewCrackerForm();
  loading: boolean = false;

  /**
   * Create new cracker upon form submission and redirect to cracker type table page on success
   */
  async onSubmit() {
    if (this.newCrackerForm.invalid) {
      this.newCrackerForm.markAllAsTouched();
      this.newCrackerForm.updateValueAndValidity();
      return;
    }
    this.loading = true;

    try {
      const payload = {
        typeName: this.newCrackerForm.value.typeName,
        isChunkingAvailable: this.newCrackerForm.value.isChunkingAvailable
      };

      await firstValueFrom(this.gs.create(SERV.CRACKERS_TYPES, payload));
      this.alert.showSuccessMessage('Cracker type created!');
      void this.router.navigate(['config/engine/crackers']);
    } catch (err) {
      if (!err.error?.title) {
        this.alert.showErrorMessage('An error occurred while creating the Cracker type.');
      }
    } finally {
      this.loading = false;
    }
  }
}
