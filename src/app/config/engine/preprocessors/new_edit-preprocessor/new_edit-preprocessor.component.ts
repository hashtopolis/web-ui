import { Subscription, firstValueFrom } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { JPreprocessor } from '@models/preprocessor.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV, ValidationPatterns } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AlertService } from '@services/shared/alert.service';

import {
  NewEditPreprocessorForm,
  getNewEditPreprocessorForm
} from '@src/app/config/engine/preprocessors/new_edit-preprocessor/new_edit-preprocessor.form';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { GridModule } from '@src/app/shared/grid-containers/grid.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';

@Component({
  selector: 'app-new-preprocessor',
  imports: [ButtonsModule, FlexModule, FormsModule, GridModule, InputModule, PageTitleModule, ReactiveFormsModule],
  templateUrl: './new_edit-preprocessor.component.html'
})
export class NewEditPreprocessorComponent implements OnInit {
  urlPattern = ValidationPatterns.URL;

  pageTitle = 'New Preprocessor';
  submitButtonText = 'Create';

  isEditMode = false;
  preprocessorId: number | null = null;

  newEditPreprocessorForm: FormGroup<NewEditPreprocessorForm>;

  loading: boolean;

  /**
   * Array to hold subscriptions for cleanup on component destruction.
   * This prevents memory leaks by unsubscribing from observables when the component is destroyed.
   */
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService,
    private router: Router,
    private alert: AlertService
  ) {
    this.newEditPreprocessorForm = getNewEditPreprocessorForm();
    this.loading = false;
  }

  ngOnInit() {
    this.preprocessorId = parseInt(this.route.snapshot.paramMap.get('id'));
    if (this.preprocessorId) {
      this.isEditMode = true;
      this.pageTitle = 'Edit Preprocessor';
      this.submitButtonText = 'Update';

      this.loadPreprocessor(this.preprocessorId);
    }
  }

  /**
   * Load preprocessor data from the server and patch the form with the data
   * @param preprocessorId ID of the preprocessor to load
   */
  private loadPreprocessor(preprocessorId: number) {
    const params = new RequestParamBuilder().create();
    this.subscriptions.push(
      this.gs.get(SERV.PREPROCESSORS, preprocessorId, params).subscribe((response: ResponseWrapper) => {
        const preprocessor = new JsonAPISerializer().deserialize<JPreprocessor>({
          data: response.data,
          included: response.included
        });

        this.newEditPreprocessorForm.patchValue({
          name: preprocessor.name,
          binaryName: preprocessor.binaryName,
          url: preprocessor.url,
          keyspaceCommand: preprocessor.keyspaceCommand,
          limitCommand: preprocessor.limitCommand,
          skipCommand: preprocessor.skipCommand
        });
      })
    );
  }

  /**
   * Create new preprocessor upon form submission and redirect to preprocessor page on success
   */
  async onSubmit() {
    if (this.newEditPreprocessorForm.invalid) return;
    this.loading = true;

    const payload = {
      name: this.newEditPreprocessorForm.value.name,
      binaryName: this.newEditPreprocessorForm.value.binaryName,
      url: this.newEditPreprocessorForm.value.url,
      keyspaceCommand: this.newEditPreprocessorForm.value.keyspaceCommand,
      limitCommand: this.newEditPreprocessorForm.value.limitCommand,
      skipCommand: this.newEditPreprocessorForm.value.skipCommand
    };

    if (this.isEditMode) {
      try {
        this.subscriptions.push(
          this.gs.update(SERV.PREPROCESSORS, this.preprocessorId, payload).subscribe(() => {
            this.alert.showSuccessMessage('Preprocessor updated');
            void this.router.navigate(['config/engine/preprocessors']);
          })
        );
      } catch (err) {
        const msg = 'Error updating preprocessor!';
        console.error(msg, err);
        this.alert.showErrorMessage(msg);
      } finally {
        this.loading = false;
      }
    } else {
      try {
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
}
