import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import { environment } from './../../../../environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';

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

  // TABLES, TO BE REMOVED

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  allfiles: any;

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
    titleService.set(['Import SuperTask - Mask']);
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
      isSmall: new FormControl(''),
      isCPU: new FormControl(''),
      useBench: new FormControl(''),
      crackerBinaryId: new FormControl(''),
      attackCmd: new FormControl(
        this.uiService.getUIsettings('hashlistAlias').value,
        [Validators.required]
      ),
      files: new FormControl('')
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

    // TABLES
    this.gs
      .getAll(SERV.FILES, { expand: 'accessGroup' })
      .subscribe((files: any) => {
        this.allfiles = files.values;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          setTimeout(() => {
            this.dtTrigger.next(null);
            dtInstance.columns.adjust();
          });
        });
      });
  }

  /**
   * Handles the submission of the form to create a new Bulk.
   *
   */
  onSubmit() {
    if (this.createForm.valid) {
    }
  }

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
      this.filesFormArray.push(fileId);
      this.OnChangeAttack(fileName, fileType);
      this.createForm.patchValue({ files: this.filesFormArray });
    }
    if (isChecked && cmdAttk === 1) {
      this.OnChangeAttackPrep(fileName, fileType);
    }
    if (!isChecked && cmdAttk === 0) {
      const index = this.filesFormArray.indexOf(fileId);
      this.filesFormArray.splice(index, 1);
      this.createForm.patchValue({ files: this.filesFormArray });
      this.OnChangeAttack(fileName, fileType, true);
    }
    if (!isChecked && cmdAttk === 1) {
      this.OnChangeAttackPrep(fileName, fileType, true);
    }
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
}
