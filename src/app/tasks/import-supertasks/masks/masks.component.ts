import { CRACKER_TYPE_FIELD_MAPPING } from 'src/app/core/_constants/select.config';
import { benchmarkType } from 'src/app/core/_constants/tasks.config';
import { HorizontalNav } from 'src/app/core/_models/horizontalnav.model';
import { GlobalService } from 'src/app/core/_services/main.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { transformSelectOptions } from 'src/app/shared/utils/forms';

import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { JPretask } from '@models/pretask.model';

import { SERV } from '@services/main.config';

import { JCrackerBinaryType } from '@src/app/core/_models/cracker-binary.model';
import { ResponseWrapper } from '@src/app/core/_models/response.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';

/**
 * ImportSupertaskMaskComponent is a component responsible for importing SuperTasks with masks.
 *
 */
@Component({
  selector: 'app-import-supertasks',
  templateUrl: './masks.component.html',
  standalone: false
})
export class MasksComponent implements OnInit, OnDestroy {
  /**
   * @private unsubscribeService - The service responsible for managing subscriptions.
   * @private changeDetectorRef - The reference to the Angular ChangeDetectorRef.
   * @private titleService - The service responsible for setting the page title.
   * @private alert - The service for displaying alert messages.
   * @private gs - The service providing global functionality.
   * @private router - The Angular Router service for navigation.
   * @private serializer - The serializer service for API response.
   */

  private unsubscribeService = inject(UnsubscribeService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private titleService = inject(AutoTitleService);
  private uiService = inject(UIConfigService);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);
  private serializer = inject(JsonAPISerializer);

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

  /**
   * @returns {void}
   *
   * @ngModule AppModule
   */
  constructor() {
    this.buildForm();
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
      optFlag: new FormControl(false),
      useNewBench: new FormControl(true),
      crackerBinaryId: new FormControl(1),
      masks: new FormControl('', [Validators.required])
    });
  }

  /**
   * Loads data, specifically Cracker Type, for the component.
   */
  loadData(): void {
    const loadSubscription$ = this.gs.getAll(SERV.CRACKERS_TYPES).subscribe((response: ResponseWrapper) => {
      const responseBody = { data: response.data, included: response.included };
      const crackerBinaryTypes = this.serializer.deserialize<JCrackerBinaryType[]>(responseBody);

      this.selectCrackertype = transformSelectOptions(crackerBinaryTypes, CRACKER_TYPE_FIELD_MAPPING);
    });
    this.unsubscribeService.add(loadSubscription$);
  }

  /**
   * Create Pretasks
   * Name: first line of mask
   * Attack: #HL# -a 3 {mask} {options}
   * Options: Flag -O (Optimize)
   */
  private async preTasks(form): Promise<number[]> {
    return new Promise<number[]>((resolve, reject) => {
      const preTasksIds: number[] = [];

      // Split masks from form.masks by line break and create an array to iterate
      const masksArray: string[] = form.masks.split('\n');

      // Create an array to hold all subscription promises
      const subscriptionPromises: Promise<void>[] = [];

      // Iterate over the masks array
      masksArray.forEach((maskline, index) => {
        let attackCmdSuffix = '';
        if (form.optFlag) {
          attackCmdSuffix = '-O';
        }
        const payload = {
          taskName: maskline,
          attackCmd: `#HL# -a 3 ${maskline} ${attackCmdSuffix}`,
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
          files: []
        };

        // Create a subscription promise and push it to the array
        const subscriptionPromise = new Promise<void>((resolve, reject) => {
          const onSubmitSubscription$ = this.gs.create(SERV.PRETASKS, payload).subscribe((result) => {
            const pretask = new JsonAPISerializer().deserialize<JPretask>({
              data: result.data
            });
            preTasksIds.push(pretask.id);
            resolve(); // Resolve the promise when subscription completes
          }, reject); // Reject the promise if there's an error
          this.unsubscribeService.add(onSubmitSubscription$);
        });

        subscriptionPromises.push(subscriptionPromise);
      });

      // Wait for all subscription promises to resolve
      Promise.all(subscriptionPromises)
        .then(() => {
          resolve(preTasksIds);
        })
        .catch(reject);
    });
  }

  /**
   * Handles the submission of the form to create a new super task.
   * If the form is valid, it asynchronously performs the following steps:
   * 1. Calls preTasks to create preTasks based on the form data.
   * 2. Calls superTask with the created preTasks IDs and the super task name.
   * Any errors that occur during the process are caught and logged.
   * @returns {Promise<void>} A promise that resolves when the submission process is completed.
   */
  async onSubmit(): Promise<void> {
    if (this.createForm.valid) {
      try {
        this.isLoading = true; // Show spinner
        const ids = await this.preTasks(this.createForm.value);
        this.superTask(this.createForm.value.name, ids);
      } catch (error) {
        console.error('Error in preTasks:', error);
        // Handle error if needed
      } finally {
        this.isLoading = false; // Hide spinner regardless of success or error
      }
    } else {
      this.createForm.markAllAsTouched();
      this.createForm.updateValueAndValidity();
    }
  }

  /**
   * Creates a new super task with the given name and preTasks IDs.
   * @param {string} name - The name of the super task.
   * @param {string[]} ids - An array of preTasks IDs to be associated with the super task.
   * @returns {void}
   */
  private superTask(name: string, ids: number[]) {
    const payload = { supertaskName: name, pretasks: ids };
    const createSubscription$ = this.gs.create(SERV.SUPER_TASKS, payload).subscribe(() => {
      this.alert.showSuccessMessage('New Supertask Mask created');
      this.router.navigate(['/tasks/supertasks']);
    });

    this.unsubscribeService.add(createSubscription$);
    this.isLoading = false;
  }
}
