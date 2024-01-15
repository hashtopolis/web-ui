import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import {
  CRACKER_TYPE_FIELD_MAPPING,
  CRACKER_VERSION_FIELD_MAPPING
} from 'src/app/core/_constants/select.config';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { TooltipService } from '../../core/_services/shared/tooltip.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../core/_services/main.config';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { MatDialog } from '@angular/material/dialog';
import {
  benchmarkType,
  staticChunking
} from 'src/app/core/_constants/tasks.config';
import { CheatsheetComponent } from 'src/app/shared/alert/cheatsheet/cheatsheet.component';
import { Hashlist } from 'src/app/core/_models/hashlist.model';
import {
  compareVersions,
  transformSelectOptions
} from '../../shared/utils/forms';
import { ListResponseWrapper } from 'src/app/core/_models/response.model';
import { Preprocessor } from 'src/app/core/_models/preprocessor.model';
import { FileType } from 'src/app/core/_models/file.model';

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

  /** Form group for the new SuperHashlist. */
  form: FormGroup;

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

  // Tooltips
  tasktip: any = [];

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
   * @returns {void}
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
  buildForm() {
    this.form = new FormGroup({
      taskName: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
      hashlistId: new FormControl(),
      attackCmd: new FormControl(
        this.uiService.getUIsettings('hashlistAlias').value,
        [Validators.required]
      ),
      priority: new FormControl(null || this.priority, [
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ]),
      maxAgents: new FormControl(null || this.maxAgents),
      chunkTime: new FormControl(
        null || Number(this.uiService.getUIsettings('chunktime').value)
      ),
      statusTimer: new FormControl(
        null || Number(this.uiService.getUIsettings('statustimer').value)
      ),
      color: new FormControl(''),
      isCpuTask: new FormControl(null || false),
      skipKeyspace: new FormControl(null || 0),
      crackerBinaryId: new FormControl(null || 1),
      crackerBinaryTypeId: new FormControl(),
      isArchived: new FormControl(false),
      staticChunks: new FormControl(null || 0),
      chunkSize: new FormControl(null || this.chunkSize),
      forcePipe: new FormControl(null || false),
      preprocessorId: new FormControl(null || 0),
      preprocessorCommand: new FormControl(''),
      isSmall: new FormControl(null || false),
      useNewBench: new FormControl(null || true),
      files: new FormControl('' || [])
    });

    //subscribe to changes to handle select cracker binary
    this.form.get('crackerBinaryId').valueChanges.subscribe((newvalue) => {
      this.handleChangeBinary(newvalue);
    });
  }

  /**
   * Loads data for hashslists and crackers types.
   */
  loadData() {
    // Load Hahslists Select Options
    const loadHashlistsSubscription$ = this.gs
      .getAll(SERV.HASHLISTS, {
        filter: 'isArchived=false,format=0'
      })
      .subscribe((response: ListResponseWrapper<Hashlist>) => {
        this.selectHashlists = response.values;
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
    this.unsubscribeService.add(loadHashlistsSubscription$);

    // Load Cracker Types and Crackers Select Options
    const loadCrackerTypesSubscription$ = this.gs
      .getAll(SERV.CRACKERS_TYPES)
      .subscribe((response) => {
        const transformedOptions = transformSelectOptions(
          response.values,
          this.selectCrackertypeMap
        );
        this.selectCrackertype = transformedOptions;
        let id = '';
        if (this.selectCrackertype.find((obj) => obj.name === 'hashcat')._id) {
          id = this.selectCrackertype.find((obj) => obj.name === 'hashcat')._id;
        } else {
          id = this.selectCrackertype.slice(-1)[0]['_id'];
        }
        const loadCrackersSubscription$ = this.gs
          .getAll(SERV.CRACKERS, {
            filter: 'crackerBinaryTypeId=' + id + ''
          })
          .subscribe((response) => {
            const transformedOptions = transformSelectOptions(
              response.values,
              this.selectCrackervMap
            );
            this.selectCrackerversions = transformedOptions;
            const lastItem = this.selectCrackerversions.slice(-1)[0]['_id'];
            this.form.get('crackerBinaryTypeId').patchValue(lastItem);
          });
        this.unsubscribeService.add(loadCrackersSubscription$);
      });

    this.unsubscribeService.add(loadCrackerTypesSubscription$);

    // Load Preprocessor Select Options
    const loadPreprocessorsSubscription$ = this.gs
      .getAll(SERV.PREPROCESSORS)
      .subscribe((response: ListResponseWrapper<Preprocessor>) => {
        this.selectPreprocessor = response.values;
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
    const onChangeBinarySubscription$ = this.gs
      .getAll(SERV.CRACKERS, { filter: 'crackerBinaryTypeId=' + id + '' })
      .subscribe((response: any) => {
        const transformedOptions = transformSelectOptions(
          response.values,
          this.selectCrackervMap
        );
        this.selectCrackerversions = transformedOptions;
        const lastItem = this.selectCrackerversions.slice(-1)[0]['_id'];
        this.form.get('crackerBinaryTypeId').patchValue(lastItem);
      });
    this.unsubscribeService.add(onChangeBinarySubscription$);
  }

  /**
   * Initialize the form based on the copied data.
   * @param isTask Determines whether the copied data is a Task or Pretask.
   */
  private initForm(isTask: boolean) {
    if (this.copyMode) {
      const endpoint = isTask ? SERV.TASKS : SERV.PRETASKS;
      const expandField = isTask
        ? 'hashlist,speeds,crackerBinary,crackerBinaryType,files'
        : 'pretaskFiles';

      this.gs
        .get(endpoint, this.editedIndex, { expand: expandField })
        .subscribe((result) => {
          const arrFiles: Array<any> = [];
          const filesField = isTask ? 'files' : 'pretaskFiles';

          if (result[filesField]) {
            for (let i = 0; i < result[filesField].length; i++) {
              arrFiles.push(result[filesField][i]['fileId']);
            }
            this.copyFiles = arrFiles;
          }

          this.form = new FormGroup({
            taskName: new FormControl(
              result['taskName'] +
                `_(Copied_${isTask ? 'task_id' : 'pretask_id'}_${
                  this.editedIndex
                })`,
              [Validators.required, Validators.minLength(1)]
            ),
            notes: new FormControl(
              `Copied from ${isTask ? 'task' : 'pretask'} id ${
                this.editedIndex
              }`
            ),
            hashlistId: new FormControl(result['hashlist']['hashlistId']),
            attackCmd: new FormControl(result['attackCmd'], [
              Validators.required
            ]),
            maxAgents: new FormControl(result['maxAgents']),
            chunkTime: new FormControl(result['chunkTime']),
            statusTimer: new FormControl(result['statusTimer']),
            priority: new FormControl(result['priority']),
            color: new FormControl(result['color']),
            isCpuTask: new FormControl(result['isCpuTask']),
            crackerBinaryTypeId: new FormControl(result['crackerBinaryTypeId']),
            isSmall: new FormControl(result['isSmall']),
            useNewBench: new FormControl(result['useNewBench']),
            skipKeyspace: new FormControl(isTask ? result['skipKeyspace'] : 0),
            crackerBinaryId: new FormControl(
              isTask ? 1 : result.crackerBinary['crackerBinaryId']
            ),
            isArchived: new FormControl(false),
            staticChunks: new FormControl(isTask ? result['staticChunks'] : 0),
            chunkSize: new FormControl(
              isTask ? this.chunkSize : result['chunkSize']
            ),
            forcePipe: new FormControl(isTask ? result['forcePipe'] : false),
            preprocessorId: new FormControl(
              isTask ? result['preprocessorId'] : 0
            ),
            preprocessorCommand: new FormControl(
              isTask ? result['preprocessorCommand'] : ''
            ),
            files: new FormControl(arrFiles)
          });
        });
    }
  }

  /**
   * Submits the form data and creates a new Task.
   */
  onSubmit() {
    if (this.form.valid) {
      const onSubmitSubscription$ = this.gs
        .create(SERV.TASKS, this.form.value)
        .subscribe(() => {
          this.alert.okAlert('New Task created!', '');
          this.form.reset();
          this.router.navigate(['tasks/show-tasks']);
        });
      this.unsubscribeService.add(onSubmitSubscription$);
    }
  }

  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = 'IE and Edge Message';
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.form.valid) {
      return false;
    }
    return true;
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
