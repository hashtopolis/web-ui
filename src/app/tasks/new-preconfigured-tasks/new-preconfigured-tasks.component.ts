import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { CRACKER_TYPE_FIELD_MAPPING } from 'src/app/core/_constants/select.config';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { FileTypePipe } from 'src/app/core/_pipes/file-type.pipe';
import { FileType } from 'src/app/core/_models/file.model';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { ChangeDetectorRef } from '@angular/core';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { benchmarkType } from 'src/app/core/_constants/tasks.config';
import { transformSelectOptions } from 'src/app/shared/utils/forms';

@Component({
  selector: 'app-new-preconfigured-tasks',
  templateUrl: './new-preconfigured-tasks.component.html'
})
export class NewPreconfiguredTasksComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the Pretask. */
  createForm: FormGroup;
  cmdPrepro = false;

  /** Select Options. */
  selectBenchmarktype = benchmarkType;
  selectCrackertype: any;

  /** Select Options Mapping */
  selectCrackertypeMap = {
    fieldMapping: CRACKER_TYPE_FIELD_MAPPING
  };

  // Copy Mode
  copyMode = false;
  editedIndex: number;
  whichView: string;

  // Form Preconfigured values
  private priority = environment.config.tasks.priority;
  private maxAgents = environment.config.tasks.maxAgents;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private uiService: UIConfigService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    this.onInitialize();
    titleService.set(['New Preconfigured Tasks']);
  }

  /**
   * Initializes the component by extracting and setting the copy ID,
   */
  onInitialize() {
    this.route.params.subscribe((params: Params) => {
      this.editedIndex = +params['id'];
      this.copyMode = params && params['id'] !== null;
    });
  }

  /**
   * Initializes the component when it is created.
   */
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      // Determine the view type based on the provided data
      this.whichView = this.determineView(data['kind']);

      // Initialize the form based on the determined view type
      this.initializeForm(this.whichView);
    });

    // Build the default form and load additional data
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
   * Determines the view based on the specified kind.
   * @param {string} kind - The kind of view ('new-preconfigured-tasks', 'copy-preconfigured-tasks', or 'copy-tasks').
   * @returns {string} The determined view type ('create', 'edit', or 'task').
   */
  private determineView(kind: string): string {
    switch (kind) {
      case 'new-preconfigured-tasks':
        return 'create';
      case 'copy-preconfigured-tasks':
        return 'edit';
      case 'copy-tasks':
        return 'task';
      default:
        return 'create';
    }
  }

  /**
   * Initializes the form based on the specified view.
   * @param {string} view - The view type ('edit' or 'task').
   * @returns {void}
   */
  private initializeForm(view: string): void {
    switch (view) {
      case 'edit':
        this.initForm(true);
        break;
      case 'task':
        this.initForm(false);
        break;
    }
  }

  /**
   * Builds the form for creating a Pretask.
   * Initializes the form controls with default or UI settings values.
   */
  buildForm() {
    this.createForm = new FormGroup({
      taskName: new FormControl('', [Validators.required]),
      attackCmd: new FormControl(
        this.uiService.getUIsettings('hashlistAlias').value,
        [Validators.required]
      ),
      maxAgents: new FormControl(null || this.maxAgents),
      chunkTime: new FormControl(
        null || Number(this.uiService.getUIsettings('chunktime').value)
      ),
      statusTimer: new FormControl(
        null || Number(this.uiService.getUIsettings('statustimer').value)
      ),
      priority: new FormControl(0),
      color: new FormControl(''),
      isCpuTask: new FormControl(null || false),
      crackerBinaryTypeId: new FormControl(null || 1),
      isSmall: new FormControl(null || false),
      useNewBench: new FormControl(null || true),
      isMaskImport: new FormControl(false),
      files: new FormControl('' || [])
    });
  }

  /**
   * Loads data for crackers types.
   * Fetches all crackers types from the backend, transforms the options,
   * and assigns them to the selectCrackertype property.
   */
  loadData() {
    const loadCrackersSubscription$ = this.gs
      .getAll(SERV.CRACKERS_TYPES)
      .subscribe((response: any) => {
        const transformedOptions = transformSelectOptions(
          response.values,
          this.selectCrackertypeMap
        );
        this.selectCrackertype = transformedOptions;
      });
    this.unsubscribeService.add(loadCrackersSubscription$);
  }

  /**
   * Retrieves the form data containing attack command and files.
   * @returns An object with attack command and files.
   */
  getFormData() {
    return {
      attackCmd: this.createForm.get('attackCmd').value,
      files: this.createForm.get('files').value
    };
  }

  /**
   * Updates the form based on the provided event data.
   * @param event - The event data containing attack command and files.
   */
  onUpdateForm(event: any): void {
    this.createForm.patchValue({
      attackCmd: event.attackCmd,
      files: event.files
    });
  }

  /**
   * Initializes the form based on the copy mode and the type of task.
   * @param isPretask - Indicates whether the task is a preconfigured task.
   */
  private initForm(isPretask: boolean) {
    if (this.copyMode) {
      const endpoint = isPretask ? SERV.PRETASKS : SERV.TASKS;
      const onCopy$ = this.gs
        .get(endpoint, this.editedIndex, {
          expand: isPretask ? 'pretaskFiles' : 'files'
        })
        .subscribe((result) => {
          const arrFiles: Array<any> = [];
          if (result[isPretask ? 'pretaskFiles' : 'files']) {
            for (
              let i = 0;
              i < result[isPretask ? 'pretaskFiles' : 'files'].length;
              i++
            ) {
              arrFiles.push(
                result[isPretask ? 'pretaskFiles' : 'files'][i]['fileId']
              );
            }
          }
          this.createForm = new FormGroup({
            taskName: new FormControl(
              result['taskName'] +
                `_(Copied_${
                  isPretask ? 'pretask_id' : 'pretask_from_task_id'
                }_${this.editedIndex})`,
              [Validators.required, Validators.minLength(1)]
            ),
            attackCmd: new FormControl(result['attackCmd']),
            maxAgents: new FormControl(result['maxAgents']),
            chunkTime: new FormControl(result['chunkTime']),
            statusTimer: new FormControl(result['statusTimer']),
            priority: new FormControl(result['priority']),
            color: new FormControl(result['color']),
            isCpuTask: new FormControl(result['isCpuTask']),
            crackerBinaryTypeId: new FormControl(result['crackerBinaryTypeId']),
            isSmall: new FormControl(result['isSmall']),
            useNewBench: new FormControl(result['useNewBench']),
            isMaskImport: new FormControl(false),
            files: new FormControl(arrFiles)
          });
        });
      this.unsubscribeService.add(onCopy$);
    }
  }

  /**
   * Submits the form data and creates a new PreTask.
   * If the form is valid, it sends a request to create a new PreTask and
   * resets the form on success.
   */
  onSubmit() {
    if (this.createForm.valid) {
      const onSubmitSubscription$ = this.gs
        .create(SERV.PRETASKS, this.createForm.value)
        .subscribe(() => {
          this.alert.okAlert('New PreTask created!', '');
          this.createForm.reset(); // success, we reset form
          this.router.navigate(['tasks/preconfigured-tasks']);
        });
      this.unsubscribeService.add(onSubmitSubscription$);
    }
  }

  // Navigation Modals

  navChanged(event) {
    console.log('navChanged', event);
  }

  // Modal Information
  closeResult = '';
  open(content) {
    this.modalService.open(content, { size: 'xl' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
