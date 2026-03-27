import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { JCrackerBinaryType } from '@models/cracker-binary.model';
import { HorizontalNav } from '@models/horizontalnav.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UIConfigService } from '@services/shared/storage.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { CRACKER_TYPE_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { benchmarkType } from '@src/app/core/_constants/tasks.config';
import { transformSelectOptions } from '@src/app/shared/utils/forms';

@Component({
  selector: 'app-wrbulk',
  templateUrl: './wrbulk.component.html',
  standalone: false
})
export class WrbulkComponent implements OnInit, OnDestroy {
  /**
   * Horizontal menu and redirection links.
   */
  menuItems: HorizontalNav[] = [
    { label: 'Masks', routeName: '/tasks/import-supertasks/masks' },
    {
      label: 'WordList/Rules Bulk',
      routeName: '/tasks/import-supertasks/wrbulk'
    }
  ];

  /** Form group for the new Mask. */
  createForm: FormGroup;

  /** Select Options. */
  selectBenchmarktype = benchmarkType;
  selectCrackertype = undefined;

  /** Select Options Mapping */
  selectCrackertypeMap = {
    fieldMapping: CRACKER_TYPE_FIELD_MAPPING
  };

  /** on create loading */
  isLoading = false;

  /** Table custome label */
  customLabel = 'Base | Iterate';

  private unsubscribeService = inject(UnsubscribeService);
  private titleService = inject(AutoTitleService);
  private uiService = inject(UIConfigService);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);
  private serializer = inject(JsonAPISerializer);

  constructor() {
    this.buildForm();
    this.titleService.set(['Import SuperTask - Wordlist/Rules Bulk']);
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
   * Builds the form for creating a new Mask.
   */
  buildForm(): void {
    this.createForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      maxAgents: new FormControl(0),
      isSmall: new FormControl(false),
      isCpuTask: new FormControl(false),
      useNewBench: new FormControl(true),
      crackerBinaryId: new FormControl(1),
      attackCmd: new FormControl(this.uiService.getUISettings()?.hashlistAlias ?? '', [Validators.required]),
      baseFiles: new FormControl([]),
      iterFiles: new FormControl([])
    });
  }

  /**
   * Loads data for the component.
   *
   * Retrieves cracker types from the server and transforms them into select options.
   *
   * @returns {void}
   */
  loadData() {
    const loadSubscription$ = this.gs.getAll(SERV.CRACKERS_TYPES).subscribe((response: ResponseWrapper) => {
      const responseBody = { data: response.data, included: response.included };
      const crackerBinaryTypes = this.serializer.deserialize<JCrackerBinaryType[]>(responseBody);

      this.selectCrackertype = transformSelectOptions(crackerBinaryTypes, CRACKER_TYPE_FIELD_MAPPING);
    });
    this.unsubscribeService.add(loadSubscription$);
  }

  /**
   * Create pre-tasks and supertask via the backend helper.
   *
   * @param {Object} form - The form data containing task configurations.
   */
  private createSupertask(form): void {
    const payload = {
      name: form.name,
      command: form.attackCmd,
      isCpu: form.isCpuTask,
      isSmall: form.isSmall,
      crackerBinaryTypeId: form.crackerBinaryId,
      benchtype: form.useNewBench ? 'speed' : 'runtime',
      maxAgents: form.maxAgents,
      basefiles: form.baseFiles,
      iterfiles: form.iterFiles
    };

    const subscription$ = this.gs.chelper(SERV.HELPER, 'bulkSupertaskBuilder', payload).subscribe({
      next: () => {
        this.alert.showSuccessMessage('New Supertask Wordlist/Rules Bulk created');
        this.router.navigate(['/tasks/supertasks']);
      },
      error: (error) => {
        console.error('Error creating bulk supertask:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });

    this.unsubscribeService.add(subscription$);
  }

  /**
   * Handles the submission of the form to create a new super task - Import Wordlist/Rule Bulk
   * If the form is valid, it asynchronously performs the following steps:
   * 1. Calls preTasks to create preTasks based on the form data.
   * 2. Calls superTask with the created preTasks IDs and the super task name.
   * Any errors that occur during the process are caught and logged.
   * @returns {Promise<void>} A promise that resolves when the submission process is completed.
   */
  async onSubmit(): Promise<void> {
    if (this.createForm.valid) {
      const formValue = this.createForm.value;
      const attackCmd: string = formValue.attackCmd;
      const crackerBinaryId: number = formValue.crackerBinaryId;
      const iterFiles: [] = formValue.iterFiles;

      const attackAlias = this.uiService.getUISettings()?.hashlistAlias ?? '';
      let hasError = false;

      try {
        // Check if crackerBinaryId is invalid or missing
        if (!crackerBinaryId) {
          const warning = 'Invalid cracker type ID!';
          this.alert.showErrorMessage(warning);
          hasError = true; // Set error flag
        }

        // Check if attackCmd contains the hashlist alias
        if (!attackCmd.includes(attackAlias)) {
          const warning = 'Command line must contain hashlist alias (' + attackAlias + ')!';
          this.alert.showErrorMessage(warning);
          hasError = true; // Set error flag
        }

        // Check if attackCmd contains FILE placeholder
        if (!attackCmd.includes('FILE')) {
          const warning = 'No placeholder (FILE) for the iteration!';
          this.alert.showErrorMessage(warning);
          hasError = true; // Set error flag
        }

        // Check if at least one iter file is selected
        if (!iterFiles || iterFiles.length === 0) {
          const warning = 'You need to select at least one iteration file!';
          this.alert.showErrorMessage(warning);
          hasError = true; // Set error flag
        }

        // Add more error checks here if needed

        if (hasError) {
          return; // Error occurred, stop further execution
        }

        this.isLoading = true; // Show spinner
        this.createSupertask(formValue);
      } catch (error) {
        console.error('Error when importing supertask:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.createForm.markAllAsTouched();
      this.createForm.updateValueAndValidity();
    }
  }

  /**
   * Retrieves the form data containing attack command and files.
   * @returns An object with attack command and files.
   */
  getFormData() {
    return {
      attackCmd: this.createForm.get('attackCmd').value,
      files: this.createForm.get('baseFiles').value,
      otherFiles: this.createForm.get('iterFiles').value
    };
  }

  /**
   * Updates the form based on the provided event data.
   * @param event - The event data containing attack command and files.
   */
  onUpdateForm(event): void {
    if (event.type === 'CMD') {
      this.createForm.patchValue({
        attackCmd: event.attackCmd,
        baseFiles: event.files
      });
    } else {
      this.createForm.patchValue({
        iterFiles: event.otherFiles
      });
    }
  }
}
