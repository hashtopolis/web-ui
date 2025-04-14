import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { UnsubscribeService } from '@services/unsubscribe.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { TooltipService } from '@services/shared/tooltip.service';
import { UIConfigService } from '@services/shared/storage.service';
import { AlertService } from '@services/shared/alert.service';
import { GlobalService } from '@services/main.service';

import { Filter, FilterType } from '@models/request-params.model';
import { FileType } from '@models/file.model';
import { ResponseWrapper } from '@models/response.model';
import { JCrackerBinary, JCrackerBinaryType } from '@models/cracker-binary.model';
import { JPreprocessor } from '@models/preprocessor.model';
import { JTask } from '@models/task.model';
import { JPretask } from '@models/pretask.model';

import { CheatsheetComponent } from '@src/app/shared/alert/cheatsheet/cheatsheet.component';
import { transformSelectOptions } from '@src/app/shared/utils/forms';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { SERV } from '@services/main.config';

import { CRACKER_TYPE_FIELD_MAPPING, CRACKER_VERSION_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { benchmarkType, staticChunking } from '@src/app/core/_constants/tasks.config';

import { environment } from '@src/environments/environment';

import { getNewTaskForm } from '@src/app/tasks/new-tasks/new-tasks.form';
import { JHashlist } from '@models/hashlist.model';

/**
 * Represents the NewTasksComponent responsible for creating a new Tasks.
 */
@Component({
  selector: 'app-new-tasks',
  templateUrl: './new-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class NewTasksComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;
  isLoadingCopyForm = true;

  /** Form group for the new SuperHashlist. */
  form: FormGroup;

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  /** Select Options. */
  selectHashlists: any;
  selectStaticChunking = staticChunking;
  selectBenchmarktype = benchmarkType;
  selectCrackertype: any;
  selectCrackerversions: any = [];
  selectPreprocessor: any;

  /** Select Options Mapping */
  selectCrackertypeMap = {
    fieldMapping: CRACKER_TYPE_FIELD_MAPPING
  };

  selectCrackervMap = {
    fieldMapping: CRACKER_VERSION_FIELD_MAPPING
  };

  // Initial Configuration
  private priority = environment.config.tasks.priority;
  private maxAgents = environment.config.tasks.maxAgents;
  private chunkSize = environment.config.tasks.chunkSize;

  // Copy Task or PreTask configuration
  copyMode = false;
  copyFiles: any;
  editedIndex: number;
  whichView: string;
  copyType: number; //0 copy from task and 1 copy from pretask
  isCopyHashlistId = null;

  // Tooltips
  tasktip: any = [];

  // Tables File Types
  fileTypeWordlist: FileType = 0;
  fileTypeRules: FileType = 1;
  fileTypeOther: FileType = 2;

  /**
   * Constructor for the Component.
   * Initializes and sets up necessary services, properties, and components.
   *
   * @param {UnsubscribeService} unsubscribeService - The service responsible for managing subscriptions.
   * @param {ChangeDetectorRef} changeDetectorRef - The reference to the Angular ChangeDetectorRef.
   * @param {AutoTitleService} titleService - The service responsible for setting the page title.
   * @param {TooltipService} tooltipService - The service responsible for managing tooltips.
   * @param {UIConfigService} uiService - The service providing UI configuration.
   * @param {ActivatedRoute} route - The Angular ActivatedRoute service for accessing route parameters.
   * @param {AlertService} alert - The service for displaying alert messages.
   * @param {GlobalService} gs - The service providing global functionality.
   * @param {MatDialog} dialog - The Angular Material Dialog service for creating dialogs.
   * @param {Router} router - The Angular Router service for navigation.
   */
  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private tooltipService: TooltipService,
    private uiService: UIConfigService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.onInitialize();
    titleService.set(['New Task']);
  }

  /**
   * Initializes the component by extracting and setting the copy ID,
   */
  onInitialize() {
    this.route.params.subscribe((params: Params) => {
      this.editedIndex = +params['id'];
      this.copyMode = params['id'] != null;
    });
    this.tasktip = this.tooltipService.getTaskTooltips();
  }

  /**
   * Initialize the component based on the data kind.
   */
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.determineView(data['kind']);
    });

    this.buildForm();
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
   * Determine the view and set up the component accordingly.
   * @param kind The type of data (e.g., 'new-task', 'copy-task', 'copy-pretask').
   */
  private determineView(kind: string): void {
    switch (kind) {
      case 'new-task':
        this.setupForCreate();
        break;

      case 'copy-task':
        this.setupForCopy(0);
        break;

      case 'copy-pretask':
        this.setupForCopy(1);
        break;
    }
  }

  /**
   * Set up the component for creating a new task.
   */
  private setupForCreate(): void {
    this.whichView = 'create';
  }

  /**
   * Set up the component for copying an existing task or pretask.
   * @param copyType The type of data to copy (0 for task, 1 for pretask).
   */
  private setupForCopy(copyType: number): void {
    this.whichView = 'edit';
    this.copyType = copyType;
    this.initForm(copyType === 0);
  }

  /**
   * Builds the form for creating a Task.
   * Initializes the form controls with default or UI settings values.
   */
  buildForm(): void {
    this.form = getNewTaskForm(this.uiService);

    //subscribe to changes to handle select cracker binary
    this.form.get('crackerBinaryId').valueChanges.subscribe((newvalue) => {
      this.handleChangeBinary(newvalue);
    });

    /**
     * If no Preprocessor was selected ('disabled'),
     * the value '0' must be used instead of 'null' for further processing
     */
    this.form.get('preprocessorId').valueChanges.subscribe((newvalue) => {
      if (newvalue === 'null') {
        this.form.get('preprocessorId').patchValue(0);
      } else {
        this.form.get('preprocessorId').patchValue(newvalue);
      }
    });
  }

  /**
   * Loads data for hashslists and crackers types.
   */
  loadData() {
    // Load Hahslists Select Options
    const filter = new Array<Filter>(
      { field: 'isArchived', operator: FilterType.EQUAL, value: false },
      { field: 'format', operator: FilterType.EQUAL, value: 0 }
    );
    const loadHashlistsSubscription$ = this.gs
      .getAll(SERV.HASHLISTS, {
        filter: filter
      })
      .subscribe((response: ResponseWrapper) => {
        this.selectHashlists = new JsonAPISerializer().deserialize<JHashlist>({
          data: response.data,
          included: response.included
        });
        this.isLoading = false;
        if (!this.selectHashlists.length) {
          this.alert.errorConfirmation('You need to create a Hashlist to continue creating a Task');
        }
        if (this.copyMode) {
          this.checkHashlisId();
        }
        this.changeDetectorRef.detectChanges();
      });
    this.unsubscribeService.add(loadHashlistsSubscription$);

    // Load Cracker Types and Crackers Select Options
    const loadCrackerTypesSubscription$ = this.gs.getAll(SERV.CRACKERS_TYPES).subscribe((response: ResponseWrapper) => {
      const crackerTypes = new JsonAPISerializer().deserialize<JCrackerBinaryType[]>({
        data: response.data,
        included: response.included
      });

      this.selectCrackertype = transformSelectOptions(crackerTypes, this.selectCrackertypeMap);
      let id = '';
      if (this.selectCrackertype.find((obj) => obj.name === 'hashcat').id) {
        id = this.selectCrackertype.find((obj) => obj.name === 'hashcat').id;
      } else {
        id = this.selectCrackertype.slice(-1)[0]['id'];
      }
      const requestParams = new RequestParamBuilder()
        .addFilter({ field: 'crackerBinaryTypeId', operator: FilterType.EQUAL, value: id })
        .create();
      const loadCrackersSubscription$ = this.gs
        .getAll(SERV.CRACKERS, requestParams)
        .subscribe((response: ResponseWrapper) => {
          const crackers = new JsonAPISerializer().deserialize<JCrackerBinary[]>({
            data: response.data,
            included: response.included
          });
          this.selectCrackerversions = transformSelectOptions(crackers, this.selectCrackervMap);
          const lastItem = this.selectCrackerversions.slice(-1)[0]['id'];
          this.form.get('crackerBinaryTypeId').patchValue(lastItem);
        });
      this.unsubscribeService.add(loadCrackersSubscription$);
    });

    this.unsubscribeService.add(loadCrackerTypesSubscription$);

    // Load Preprocessor Select Options
    const loadPreprocessorsSubscription$ = this.gs.getAll(SERV.PREPROCESSORS).subscribe((response: ResponseWrapper) => {
      this.selectPreprocessor = new JsonAPISerializer().deserialize<JPreprocessor>({
        data: response.data,
        included: response.included
      });
      this.changeDetectorRef.detectChanges();
    });
    this.unsubscribeService.add(loadPreprocessorsSubscription$);
  }

  /**
   * Retrieves the form data containing attack command and files.
   * @returns An object with attack command and files.
   */
  getFormData() {
    return {
      attackCmd: this.form.get('attackCmd').value,
      files: this.form.get('files').value,
      preprocessorCommand: this.form.get('preprocessorCommand').value
    };
  }

  /**
   * Check if the current form has preprocessor enabled, otherwise dont show on table
   * @returns {boolean} True if the form is for a preprocessor task, false otherwise.
   */
  isPreprocessor(): boolean {
    const preprocessorId = this.form.get('preprocessorId').value;
    return preprocessorId !== 0 && preprocessorId !== 'null';
  }

  /**
   * Updates the form based on the provided event data.
   * @param event - The event data containing attack command and files.
   */
  onUpdateForm(event: any): void {
    if (event.type === 'CMD') {
      this.form.patchValue({
        attackCmd: event.attackCmd,
        files: event.files
      });
    } else {
      this.form.patchValue({
        preprocessorCommand: event.attackCmd
      });
    }
  }

  /**
   * Handle the change of cracker binary type and update the available cracker versions.
   * @param {string} id - The identifier of the selected cracker binary type.
   */
  handleChangeBinary(id: string) {
    const requestParams = new RequestParamBuilder()
      .addFilter({
        field: 'crackerBinaryTypeId',
        operator: FilterType.EQUAL,
        value: id
      })
      .create();
    const onChangeBinarySubscription$ = this.gs
      .getAll(SERV.CRACKERS, requestParams)
      .subscribe((response: ResponseWrapper) => {
        const crackers = new JsonAPISerializer().deserialize<JCrackerBinary[]>({
          data: response.data,
          included: response.included
        });
        this.selectCrackerversions = transformSelectOptions(crackers, this.selectCrackervMap);
        const lastItem = this.selectCrackerversions.slice(-1)[0]['id'];
        this.form.get('crackerBinaryTypeId').patchValue(lastItem);
      });
    this.unsubscribeService.add(onChangeBinarySubscription$);
  }

  /**
   * OnCopy check that hashlisId exist, as could be deleted from loaded hashlists
   *
   */
  checkHashlisId() {
    const exists = this.selectHashlists.some((hashlist) => hashlist.id === this.isCopyHashlistId);

    if (!exists) {
      this.alert.errorConfirmation('Hashlist ID not found!');
    }
  }

  /**
   * Initialize the form based on the copied data.
   * @param isTask Determines whether the copied data is a Task or Pretask.
   */
  private initForm(isTask: boolean) {
    if (this.copyMode) {
      const endpoint = isTask ? SERV.TASKS : SERV.PRETASKS;
      const includedResources = isTask
        ? ['hashlist', 'speeds', 'crackerBinary', 'crackerBinaryType', 'files']
        : ['pretaskFiles'];

      const requestParamBuilder = new RequestParamBuilder();
      for (const resource in includedResources) {
        requestParamBuilder.addInclude(resource);
      }
      const requestParams = requestParamBuilder.create();

      this.gs.get(endpoint, this.editedIndex, requestParams).subscribe((response: ResponseWrapper) => {
        const task = new JsonAPISerializer().deserialize<JTask | JPretask>({
          data: response.data,
          included: response.included
        });

        const arrFiles: Array<any> = [];
        const filesField = isTask ? 'files' : 'pretaskFiles';
        this.isCopyHashlistId = this.copyType === 1 ? 999999 : task['hashlist'][0]['id'];
        if (task[filesField]) {
          for (let i = 0; i < task[filesField].length; i++) {
            arrFiles.push(task[filesField][i]['fileId']);
          }
          this.copyFiles = arrFiles;
        }

        this.form.setValue({
          taskName: task['taskName'] + `_(Copied_${isTask ? 'task_id' : 'pretask_id'}_${this.editedIndex})`,
          notes: `Copied from ${isTask ? 'task' : 'pretask'} id ${this.editedIndex}`,
          hashlistId: this.isCopyHashlistId,
          attackCmd: task['attackCmd'],
          maxAgents: task['maxAgents'],
          chunkTime: task['chunkTime'],
          priority: task['priority'],
          color: task['color'],
          isCpuTask: task['isCpuTask'],
          crackerBinaryTypeId: task['crackerBinaryTypeId'],
          isSmall: task['isSmall'],
          useNewBench: task['useNewBench'],
          skipKeyspace: isTask ? task['skipKeyspace'] : 0,
          crackerBinaryId: isTask ? task['crackerBinary']['crackerBinaryId'] : 1,
          isArchived: false,
          staticChunks: isTask ? task['staticChunks'] : 0,
          chunkSize: isTask ? task['chunkSize'] : this.chunkSize,
          forcePipe: isTask ? task['forcePipe'] : false,
          preprocessorId: isTask ? task['preprocessorId'] : 0,
          preprocessorCommand: isTask ? task['preprocessorCommand'] : '',
          files: arrFiles
        });
      });
    }
  }

  /**
   * Submits the form data and creates a new Task.
   */
  onSubmit() {
    if (this.form.valid) {
      this.isCreatingLoading = true;
      const onSubmitSubscription$ = this.gs.create(SERV.TASKS, this.form.value).subscribe(() => {
        this.alert.okAlert('New Task created!', '');
        this.router
          .navigate(['tasks/show-tasks'])
          .then((success) => {
            if (!success) {
              console.error('Navigation failed.');
            }
          })
          .catch((error) => {
            console.error('Error navigating to tasks/show-tasks:', error);
          });
        this.isCreatingLoading = false;
      });
      this.unsubscribeService.add(onSubmitSubscription$);
    }
  }

  // Modal Information
  openHelpDialog(): void {
    const dialogRef = this.dialog.open(CheatsheetComponent, {
      width: '100%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed with result:', result);
    });
  }
}
