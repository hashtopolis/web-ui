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

  /** Select Options. */
  selectBenchmarktype = benchmarkType;
  selectCrackertype: any;

  /** Select Options Mapping */
  selectCrackertypeMap = {
    fieldMapping: CRACKER_TYPE_FIELD_MAPPING
  };
  cmdPrepro = false;
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

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      switch (data['kind']) {
        case 'new-preconfigured-tasks':
          this.whichView = 'create';
          break;

        case 'copy-preconfigured-tasks':
          this.whichView = 'edit';
          this.initForm();
          break;

        case 'copy-tasks':
          this.whichView = 'task';
          this.initFormt();
          break;
      }
    });

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
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  getFormData() {
    return {
      attackCmd: this.createForm.get('attackCmd').value,
      files: this.createForm.get('files').value
    };
  }

  onUpdateForm(event: any): void {
    this.createForm.patchValue({
      attackCmd: event.attackCmd,
      files: event.files
    });
  }

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

  private initForm() {
    if (this.copyMode) {
      const onCopyPretask$ = this.gs
        .get(SERV.PRETASKS, this.editedIndex, { expand: 'pretaskFiles' })
        .subscribe((result) => {
          const arrFiles: Array<any> = [];
          if (result['pretaskFiles']) {
            for (let i = 0; i < result['pretaskFiles'].length; i++) {
              arrFiles.push(result['pretaskFiles'][i]['fileId']);
            }
          }
          this.createForm = new FormGroup({
            taskName: new FormControl(
              result['taskName'] +
                '_(Copied_pretask_id_' +
                this.editedIndex +
                ')',
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
      this.unsubscribeService.add(onCopyPretask$);
    }
  }

  private initFormt() {
    if (this.copyMode) {
      const onCopyTask$ = this.gs
        .get(SERV.TASKS, this.editedIndex, { expand: 'files' })
        .subscribe((result) => {
          const arrFiles: Array<any> = [];
          if (result.files) {
            for (let i = 0; i < result.files.length; i++) {
              arrFiles.push(result.files[i]['fileId']);
            }
          }
          this.createForm = new FormGroup({
            taskName: new FormControl(
              result['taskName'] +
                '_(Copied_pretask_from_task_id_' +
                this.editedIndex +
                ')',
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
      this.unsubscribeService.add(onCopyTask$);
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
