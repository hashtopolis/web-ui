import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

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

/**
 * Represents the NewTasksComponent responsible for creating a new Tasks.
 */
@Component({
  selector: 'app-new-tasks',
  templateUrl: './new-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class NewTasksComponent implements OnInit {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the new SuperHashlist. */
  createForm: FormGroup;

  /** Select Options. */
  selectHashlists: any;
  selectStaticChunking = staticChunking;
  selectBenchmarktype = benchmarkType;
  selectCrackertype: any;
  selectCrackerversions: any = [];
  selectPreprocessor: any;

  /** Select Options Mapping */
  selectCrackertypeMap = {
    fieldMapping: {
      name: 'typeName',
      _id: 'crackerBinaryTypeId'
    }
  };
  selectCrackervMap = {
    fieldMapping: {
      name: 'version',
      _id: 'crackerBinaryId'
    }
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

  // TABLES
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  public allfiles: any;

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
    titleService.set(['New Task']);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.editedIndex = +params['id'];
      this.copyMode = params['id'] != null;
    });

    this.tasktip = this.tooltipService.getTaskTooltips();

    this.route.data.subscribe((data) => {
      switch (data['kind']) {
        case 'new-task':
          this.whichView = 'create';
          break;

        case 'copy-task':
          this.whichView = 'edit';
          this.copyType = 0;
          this.initFormt();
          break;

        case 'copy-pretask':
          this.whichView = 'edit';
          this.copyType = 1;
          this.initFormpt();
          break;
      }
    });

    this.loadData();
    this.loadTableData();

    this.createForm = new FormGroup({
      taskName: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
      hashlistId: new FormControl(),
      attackCmd: new FormControl(
        this.uiService.getUIsettings('hashlistAlias').value,
        [Validators.required, this.forbiddenChars(this.getBanChars())]
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
    this.createForm
      .get('crackerBinaryId')
      .valueChanges.subscribe((newvalue) => {
        this.handleChangeBinary(newvalue);
      });
  }

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
            this.createForm.get('crackerBinaryTypeId').patchValue(lastItem);
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

  // TABLES TO BE REMOVED
  loadTableData() {
    this.gs
      .getAll(SERV.FILES, {
        expand: 'accessGroup'
      })
      .subscribe((files) => {
        this.allfiles = files.values;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          setTimeout(() => {
            this.dtTrigger[0].next(null);
            dtInstance.columns.adjust();
          });
        });
      });
  }

  // Attack Command with Files Table
  filesFormArray: Array<any> = [];
  onChange(
    fileId: number,
    fileType: number,
    fileName: string,
    cmdAttk: number,
    $target: EventTarget
  ) {
    const isChecked = (<HTMLInputElement>$target).checked;
    if (isChecked && cmdAttk === 0) {
      if (this.copyMode) {
        this.filesFormArray = this.createForm.get('files').value;
      }
      this.filesFormArray.push(fileId);
      this.OnChangeAttack(fileName, fileType);
      this.createForm.get('files').value;
      this.createForm.patchValue({ files: this.filesFormArray });
    }
    if (isChecked && cmdAttk === 1) {
      this.OnChangeAttackPrep(fileName, fileType);
    }
    if (!isChecked && cmdAttk === 0) {
      if (this.copyMode) {
        this.filesFormArray = this.createForm.get('files').value;
      }
      const index = this.filesFormArray.indexOf(fileId);
      this.filesFormArray.splice(index, 1);
      this.createForm.patchValue({ files: this.filesFormArray });
      this.OnChangeAttack(fileName, fileType, true);
    }
    if (!isChecked && cmdAttk === 1) {
      this.OnChangeAttackPrep(fileName, fileType, true);
    }
  }

  onChecked(fileId: number) {
    return this.createForm.get('files').value.includes(fileId);
  }

  OnChangeAttack(item: string, fileType: number, onRemove?: boolean) {
    if (onRemove === true) {
      const currentCmd = this.createForm.get('attackCmd').value;
      let newCmd = item;
      if (fileType === 1) {
        newCmd = '-r ' + newCmd;
      }
      newCmd = currentCmd.replace(newCmd, '');
      newCmd = newCmd.replace(/^\s+|\s+$/g, '');
      this.createForm.patchValue({
        attackCmd: newCmd
      });
    } else {
      const currentCmd = this.createForm.get('attackCmd').value;
      let newCmd = item;
      if (fileType === 1) {
        newCmd = '-r ' + newCmd;
      }
      this.createForm.patchValue({
        attackCmd: currentCmd + ' ' + newCmd
      });
    }
  }

  OnChangeAttackPrep(item: string, fileType: number, onRemove?: boolean) {
    if (onRemove === true) {
      const currentCmd = this.createForm.get('preprocessorCommand').value;
      let newCmd = item;
      if (fileType === 1) {
        newCmd = '-r ' + newCmd;
      }
      newCmd = currentCmd.replace(newCmd, '');
      newCmd = newCmd.replace(/^\s+|\s+$/g, '');
      this.createForm.patchValue({
        preprocessorCommand: newCmd
      });
    } else {
      const currentCmd = this.createForm.get('preprocessorCommand').value;
      let newCmd = item;
      if (fileType === 1) {
        newCmd = '-r ' + newCmd;
      }
      this.createForm.patchValue({
        preprocessorCommand: currentCmd + ' ' + newCmd
      });
    }
  }

  onRemoveFChars() {
    let currentCmd = this.createForm.get('attackCmd').value;
    currentCmd = currentCmd.replace(this.getBanChars(), '');
    this.createForm.patchValue({
      attackCmd: currentCmd
    });
  }

  getBanChars() {
    const chars = this.uiService
      .getUIsettings('blacklistChars')
      .value.replace(']', '\\]')
      .replace('[', '\\[');
    return new RegExp('[' + chars + '/]', 'g');
  }

  getBanChar() {
    return this.uiService.getUIsettings('blacklistChars').value;
  }
  get attckcmd() {
    return this.createForm.controls['attackCmd'];
  }

  forbiddenChars(name: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const forbidden = name.test(control.value);
      return forbidden ? { forbidden: { value: control.value } } : null;
    };
  }

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
        this.createForm.get('crackerBinaryTypeId').patchValue(lastItem);
      });
    this.unsubscribeService.add(onChangeBinarySubscription$);
  }

  onSubmit() {
    if (this.createForm.valid) {
      const onSubmitSubscription$ = this.gs
        .create(SERV.TASKS, this.createForm.value)
        .subscribe(() => {
          this.alert.okAlert('New Task created!', '');
          this.createForm.reset();
          this.router.navigate(['tasks/show-tasks']);
        });
      this.unsubscribeService.add(onSubmitSubscription$);
    }
  }

  /**
   * Copied from Task
   */
  private initFormt() {
    if (this.copyMode) {
      this.gs
        .get(SERV.TASKS, this.editedIndex, {
          expand: 'hashlist,speeds,crackerBinary,crackerBinaryType,files'
        })
        .subscribe((result) => {
          const arrFiles: Array<any> = [];
          if (result.files) {
            for (let i = 0; i < result.files.length; i++) {
              arrFiles.push(result.files[i]['fileId']);
            }
          }
          this.createForm = new FormGroup({
            taskName: new FormControl(
              result['taskName'] + '_(Copied_task_id_' + this.editedIndex + ')',
              [Validators.required, Validators.minLength(1)]
            ),
            notes: new FormControl(
              'Copied from task id' + this.editedIndex + ''
            ),
            hashlistId: new FormControl(result.hashlist['hashlistId']),
            attackCmd: new FormControl(result['attackCmd'], [
              Validators.required,
              this.forbiddenChars(/[&*;$()\[\]{}'"\\|<>\/]/)
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
            // 'isMaskImport': new FormControl(result['isMaskImport']),
            skipKeyspace: new FormControl(result['skipKeyspace']),
            crackerBinaryId: new FormControl(
              result.crackerBinary['crackerBinaryId']
            ),
            isArchived: new FormControl(false),
            staticChunks: new FormControl(result['staticChunks']),
            chunkSize: new FormControl(result['chunkSize']),
            forcePipe: new FormControl(result['forcePipe']),
            preprocessorId: new FormControl(result['preprocessorId']),
            preprocessorCommand: new FormControl(result['preprocessorCommand']),
            files: new FormControl(arrFiles)
          });
        });
    }
  }

  /**
   * Copied from PreTask
   */
  private initFormpt() {
    if (this.copyMode) {
      this.gs
        .get(SERV.PRETASKS, this.editedIndex, { expand: 'pretaskFiles' })
        .subscribe((result) => {
          const arrFiles: Array<any> = [];
          if (result['pretaskFiles']) {
            for (let i = 0; i < result['pretaskFiles'].length; i++) {
              arrFiles.push(result['pretaskFiles'][i]['fileId']);
            }
            this.copyFiles = arrFiles;
          }
          this.createForm = new FormGroup({
            taskName: new FormControl(
              result['taskName'] +
                '_(Copied_pretask_id_' +
                this.editedIndex +
                ')',
              [Validators.required, Validators.minLength(1)]
            ),
            notes: new FormControl(
              'Copied from pretask id ' + this.editedIndex + ''
            ),
            hashlistId: new FormControl(),
            attackCmd: new FormControl(result['attackCmd'], [
              Validators.required,
              this.forbiddenChars(/[&*;$()\[\]{}'"\\|<>\/]/)
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
            // 'isMaskImport': new FormControl(result['isMaskImport']), //Now is not working with it
            skipKeyspace: new FormControl(null || 0),
            crackerBinaryId: new FormControl(null || 1),
            isArchived: new FormControl(false),
            staticChunks: new FormControl(null || 0),
            chunkSize: new FormControl(null || this.chunkSize),
            forcePipe: new FormControl(null || false),
            preprocessorId: new FormControl(0),
            preprocessorCommand: new FormControl(''),
            files: new FormControl(arrFiles)
          });
        });
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
    if (this.createForm.valid) {
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
