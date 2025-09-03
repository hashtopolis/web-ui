import { firstValueFrom } from 'rxjs';

import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

import {
  NewPreprocessorForm,
  getNewPreprocessorForm
} from '@src/app/config/engine/preprocessors/new-preprocessor/new-preprocessor/new-preprocessor.form';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { GridModule } from '@src/app/shared/grid-containers/grid.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';

@Component({
  selector: 'app-new-preprocessor',
  imports: [
    ButtonsModule,
    FlexModule,
    FormsModule,
    GridModule,
    InputModule,
    NgIf,
    PageTitleModule,
    ReactiveFormsModule
  ],
  templateUrl: './new-preprocessor.component.html'
})
export class NewPreprocessorComponent {
  newPreprocessorForm: FormGroup<NewPreprocessorForm>;

  loading: boolean;

  constructor(
    private gs: GlobalService,
    private router: Router,
    private alert: AlertService
  ) {
    this.newPreprocessorForm = getNewPreprocessorForm();
    this.loading = false;
  }

  /**
   * Create new preprocessor upon form submission and redirect to preprocessor page on success
   */
  async onSubmit() {
    if (this.newPreprocessorForm.invalid) return;
    this.loading = true;

    try {
      const payload = {
        name: this.newPreprocessorForm.value.name,
        binaryName: this.newPreprocessorForm.value.binaryName,
        url: this.newPreprocessorForm.value.url,
        keyspaceCommand: this.newPreprocessorForm.value.keyspaceCommand,
        limitCommand: this.newPreprocessorForm.value.limitCommand,
        skipCommand: this.newPreprocessorForm.value.skipCommand
      };

      await firstValueFrom(this.gs.create(SERV.PREPROCESSORS, payload));
      this.alert.showSuccessMessage('Preprocessor created!');
      void this.router.navigate(['config/engine/preprocessors']);
    } catch (err) {
      const msg = 'Error creating preprocessor!';
      console.error(msg, err);
      this.alert.showErrorMessage(msg);
    } finally {
      this.loading = false;
    }
  }
}
