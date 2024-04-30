import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CRACKER_TYPE_FIELD_MAPPING } from 'src/app/core/_constants/select.config';
import { benchmarkType } from 'src/app/core/_constants/tasks.config';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { TooltipService } from '../../../core/_services/shared/tooltip.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';
import { Router } from '@angular/router';
import { HorizontalNav } from 'src/app/core/_models/horizontalnav.model';
import { OnDestroy } from '@angular/core';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { transformSelectOptions } from 'src/app/shared/utils/forms';

@Component({
  selector: 'app-wrbulk',
  templateUrl: './wrbulk.component.html'
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
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private tooltipService: TooltipService,
    private uiService: UIConfigService,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    this.buildForm();
    titleService.set(['Import SuperTask - Wordlist/Rules Bulk']);
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
      attackCmd: new FormControl(
        this.uiService.getUIsettings('hashlistAlias').value,
        [Validators.required]
      ),
      baseFiles: new FormControl([]),
      iterFiles: new FormControl([])
    });
  }

  loadData() {
    const loadSubscription$ = this.gs
      .getAll(SERV.CRACKERS_TYPES)
      .subscribe((response: any) => {
        const transformedOptions = transformSelectOptions(
          response.values,
          this.selectCrackertypeMap
        );
        this.selectCrackertype = transformedOptions;
      });
    this.unsubscribeService.add(loadSubscription$);
  }

  /**
   * Create Pretasks
   * Name: first line of mask
   */
  private async preTasks(form): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const preTasksIds: string[] = [];

      // Split masks from form.masks by line break and create an array to iterate
      const iterFiles: number[] = form.iterFiles;

      // Create an array to hold all subscription promises
      const subscriptionPromises: Promise<void>[] = [];

      // Iterate over the iteration files array
      iterFiles.forEach((maskline, index) => {
        const payload = {
          taskName: maskline,
          attackCmd: form.attackCmd,
          maxAgents: form.maxAgents,
          chunkTime: Number(this.uiService.getUIsettings('chunktime').value),
          statusTimer: Number(
            this.uiService.getUIsettings('statustimer').value
          ),
          priority: index + 1,
          color: '',
          isCpuTask: form.isCpuTask,
          crackerBinaryTypeId: form.crackerBinaryId,
          isSmall: form.isSmall,
          useNewBench: form.useNewBench,
          isMaskImport: true,
          files: form.baseFiles
        };

        // Create a subscription promise and push it to the array
        const subscriptionPromise = new Promise<void>((resolve, reject) => {
          const onSubmitSubscription$ = this.gs
            .create(SERV.PRETASKS, payload)
            .subscribe((result) => {
              preTasksIds.push(result._id);
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
      const formValue = this.createForm.value;
      const attackCmd: string = formValue.attackCmd;
      const crackerBinaryId: any = formValue.crackerBinaryId;

      const attackAlias = this.uiService.getUIsettings('hashlistAlias').value;

      try {
        // Check if crackerBinaryId is invalid or missing
        if (!crackerBinaryId) {
          const warning = 'Invalid cracker type ID!';
          this.alert.warningConfirmation(warning).then((confirmed) => {
            if (confirmed) {
              return;
            }
          });
        }

        // Check if attackCmd contains the hashlist alias
        if (!attackCmd.includes(attackAlias)) {
          console.log(attackAlias);
          const warning =
            'Command line must contain hashlist alias (' + attackAlias + ')!';
          this.alert.warningConfirmation(warning).then((confirmed) => {
            if (confirmed) {
              return;
            }
          });
        }

        // Check if attackCmd contains FILE placeholder
        if (!attackCmd.includes('FILE')) {
          const warning = 'No placeholder (FILE) for the iteration!';
          this.alert.warningConfirmation(warning).then((confirmed) => {
            if (confirmed) {
              return;
            }
          });
        }

        this.isLoading = true; // Show spinner
        const ids = await this.preTasks(formValue);
        this.superTask(formValue.name, ids);
      } catch (error) {
        console.error('Error in onSubmit:', error);
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
    const createSubscription$ = this.gs
      .create(SERV.SUPER_TASKS, payload)
      .subscribe(() => {
        this.alert.okAlert('New Supertask Wordlist/Rules Bulk created!', '');
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
