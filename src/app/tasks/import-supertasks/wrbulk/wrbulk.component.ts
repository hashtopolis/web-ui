import { firstValueFrom } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { JCrackerBinaryType } from '@models/cracker-binary.model';
import { JFile } from '@models/file.model';
import { HorizontalNav } from '@models/horizontalnav.model';
import { JPretask } from '@models/pretask.model';
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
import { PageTitle } from '@src/app/core/_decorators/autotitle';
import { transformSelectOptions } from '@src/app/shared/utils/forms';

@Component({
  selector: 'app-wrbulk',
  templateUrl: './wrbulk.component.html',
  standalone: false
})
@PageTitle(['Import SuperTask - Wordlist/Rules Bulk'])
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
  selectCrackertype: any;

  /** Select Options Mapping */
  selectCrackertypeMap = {
    fieldMapping: CRACKER_TYPE_FIELD_MAPPING
  };

  /** on create loading */
  isLoading = false;

  /** Table custome label */
  customLabel = 'Base | Iterate';

  constructor(
    private unsubscribeService: UnsubscribeService,
    private titleService: AutoTitleService,
    private uiService: UIConfigService,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router,
    private serializer: JsonAPISerializer
  ) {
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
      useNewBench: new FormControl(false),
      crackerBinaryId: new FormControl(1),
      attackCmd: new FormControl(this.uiService.getUIsettings('hashlistAlias').value, [Validators.required]),
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
   * Create pre-tasks asynchronously.
   *
   * @param {Object} form - The form data containing task configurations.
   * @returns {Promise<string[]>} A Promise that resolves with an array of pre-task IDs.
   */
  private async preTasks(form): Promise<string[]> {
    const preTasksIds: string[] = [];
    const iterFiles: number[] = form.iterFiles;

    try {
      const promises = iterFiles.map(async (iter, index) => {
        const payload = {
          taskName: '',
          attackCmd: '',
          maxAgents: form.maxAgents,
          chunkTime: Number(this.uiService.getUIsettings('chunktime').value),
          statusTimer: Number(this.uiService.getUIsettings('statustimer').value),
          priority: index + 1,
          color: '',
          isCpuTask: form.isCpuTask,
          crackerBinaryTypeId: form.crackerBinaryId,
          isSmall: form.isSmall,
          useNewBench: form.useNewBench,
          isMaskImport: true,
          files: form.baseFiles
        };

        // Get file name
        const fileName: string = await new Promise((resolve, reject) => {
          const fileSubscription$ = this.gs.get(SERV.FILES, iter).subscribe({
            next: (response: ResponseWrapper) => {
              const file = new JsonAPISerializer().deserialize<JFile>({
                data: response.data,
                included: response.included
              });
              resolve(file.filename);
            },
            error: reject
          });

          this.unsubscribeService.add(fileSubscription$);
        });

        const updatedAttackCmd = form.attackCmd.replace('FILE', fileName);
        payload.taskName = form.name + ' + ' + fileName;
        payload.attackCmd = updatedAttackCmd;

        const result: ResponseWrapper = await firstValueFrom(this.gs.create(SERV.PRETASKS, payload));
        const pretask = new JsonAPISerializer().deserialize<JPretask>({ data: result.data, included: result.included });
        preTasksIds.push(pretask.id.toString());
      });

      await Promise.all(promises);
      return preTasksIds;
    } catch (error) {
      return Promise.reject(error);
    }
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
      const crackerBinaryId: any = formValue.crackerBinaryId;
      const baseFiles: [] = formValue.baseFiles;
      const iterFiles: [] = formValue.iterFiles;

      const attackAlias = this.uiService.getUIsettings('hashlistAlias').value;
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

        // Check if at least one base file is selected
        if (!baseFiles || baseFiles.length === 0) {
          const warning = 'You need to select at least one base file!';
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
        const ids = await this.preTasks(formValue);
        this.superTask(formValue.name, ids);
      } catch (error) {
        console.error('Error when importing supertask:', error);
        // Handle error if needed
      } finally {
        this.isLoading = false; // Hide spinner regardless of success or error
      }
    }
  }

  /**
   * Creates a new super task with the given name and preTasks IDs.
   * @param {string} name - The name of the super task.
   * @param {string[]} ids - An array of preTasks IDs to be associated with the super task.
   * @returns {void}
   */
  private superTask(name: string, ids: string[]) {
    const payload = { supertaskName: name, pretasks: ids };
    const createSubscription$ = this.gs.create(SERV.SUPER_TASKS, payload).subscribe(() => {
      this.alert.showSuccessMessage('New Supertask Wordlist/Rules Bulk created');
      this.router.navigate(['/tasks/supertasks']);
    });

    this.unsubscribeService.add(createSubscription$);
    this.isLoading = false;
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
  onUpdateForm(event: any): void {
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
