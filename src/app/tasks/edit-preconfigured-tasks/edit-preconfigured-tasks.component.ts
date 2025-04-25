import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { yesNo } from '../../core/_constants/general.config';
import { SERV } from '../../core/_services/main.config';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { FilterType } from 'src/app/core/_models/request-params.model';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { ResponseWrapper } from '@models/response.model';
import { JsonAPISerializer } from '@services/api/serializer-service';
import { JPretask } from '@models/pretask.model';

/**
 * Represents the EditPreconfiguredTasksComponent responsible for editing a Pretask.
 */
@Component({
    selector: 'app-edit-preconfigured-tasks',
    templateUrl: './edit-preconfigured-tasks.component.html',
    standalone: false
})
export class EditPreconfiguredTasksComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the Pretask. */
  updateForm: FormGroup;

  /** On form update show a spinner loading */
  isUpdatingLoading = false;

  /** Select Options. */
  selectYesno = yesNo;

  // Edit Options
  editedPretaskIndex: number;
  editedPretask: any; // Change to Model

  pretask: any = [];
  files: any; //Add Model

  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router,
    private serializer: JsonAPISerializer
  ) {
    this.getInitialization();
    this.buildForm();
    titleService.set(['Edit Preconfigured Tasks']);
  }

  /**
   * Initializes the form based on route parameters.
   */
  getInitialization() {
    this.route.params.subscribe((params: Params) => {
      this.editedPretaskIndex = +params['id'];
      this.updateFormValues();
    });
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
   * Builds the form for creating a new SuperHashlist.
   */
  buildForm(): void {
    this.updateForm = new FormGroup({
      pretaskId: new FormControl({ value: '', disabled: true }),
      statusTimer: new FormControl({ value: '', disabled: true }),
      useNewBench: new FormControl({ value: '', disabled: true }),
      updateData: new FormGroup({
        taskName: new FormControl(''),
        attackCmd: new FormControl(''),
        chunkTime: new FormControl(''),
        color: new FormControl(''),
        priority: new FormControl(''),
        maxAgents: new FormControl(''),
        isCpuTask: new FormControl(''),
        isSmall: new FormControl('')
      })
    });
  }

  /**
   * Loads data, specifically Pretasks, for the component.
   */
  loadData(): void {
    const params = new RequestParamBuilder()
      .addFilter({ field: 'pretaskId', operator: FilterType.EQUAL, value: this.editedPretaskIndex })
      .addInclude('pretaskFiles')
      .create();

    const loadtableSubscription$ = this.gs.getAll(SERV.PRETASKS, params).subscribe((response: ResponseWrapper) => {
      const responseBody = { data: response.data, included: response.included };
      const pretasks = this.serializer.deserialize<JPretask[]>(responseBody);

      this.files = pretasks;
      this.dtTrigger.next(void 0);
    });

    this.unsubscribeService.add(loadtableSubscription$);

    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 25,
      lengthMenu: [
        [10, 25, 50, 100, 250, -1],
        [10, 25, 50, 100, 250, 'All']
      ],
      stateSave: true,
      select: true,
      buttons: []
    };
  }

  /**
   * Handles form submission, edit Pretask
   * If the form is valid, it makes an API request and navigates to the SuperHashlist page.
   */
  onSubmit() {
    if (this.updateForm.valid) {
      this.isUpdatingLoading = true;
      const updateSubscription$ = this.gs
        .update(SERV.PRETASKS, this.editedPretaskIndex, this.updateForm.value['updateData'])
        .subscribe(() => {
          this.alert.okAlert('PreTask saved!', '');
          this.isUpdatingLoading = false;
          this.router.navigate(['tasks/preconfigured-tasks']);
        });
      this.unsubscribeService.add(updateSubscription$);
    }
  }

  /**
   * Updates the form values based on the data fetched from the server.
   * This method retrieves the pre-task data from the server and updates the form controls accordingly.
   */
  private updateFormValues() {
    const params = new RequestParamBuilder().create();

    const loadSubscription$ = this.gs
      .get(SERV.PRETASKS, this.editedPretaskIndex, params)
      .subscribe((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };
        const pretask = this.serializer.deserialize<JPretask>(responseBody);

        this.pretask = pretask;
        this.updateForm = new FormGroup({
          pretaskId: new FormControl({
            value: pretask.id,
            disabled: true
          }),
          statusTimer: new FormControl({
            value: pretask.statusTimer,
            disabled: true
          }),
          useNewBench: new FormControl({
            value: pretask.useNewBench,
            disabled: true
          }),
          updateData: new FormGroup({
            taskName: new FormControl(pretask.taskName, Validators.required),
            attackCmd: new FormControl(pretask.attackCmd, Validators.required),
            chunkTime: new FormControl(pretask.chunkTime),
            color: new FormControl(pretask.color),
            priority: new FormControl(pretask.priority),
            maxAgents: new FormControl(pretask.maxAgents),
            isCpuTask: new FormControl(pretask.isCpuTask, Validators.required),
            isSmall: new FormControl(pretask.isSmall, Validators.required)
          })
        });
        this.unsubscribeService.add(loadSubscription$);
      });
  }

  // TABLES CODE

  // Table Files
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  // // @HostListener allows us to also guard against browser refresh, close, etc.
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any) {
  //   if (!this.canDeactivate()) {
  //     $event.returnValue = 'IE and Edge Message';
  //   }
  // }

  // canDeactivate(): Observable<boolean> | boolean {
  //   if (this.updateForm.valid) {
  //     return false;
  //   }
  //   return true;
  // }
}
