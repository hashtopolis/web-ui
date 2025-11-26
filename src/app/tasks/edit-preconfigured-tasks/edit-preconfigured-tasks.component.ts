import { DataTableDirective } from 'angular-datatables';
import { Subject, firstValueFrom } from 'rxjs';

import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { JPretask } from '@models/pretask.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { PreconfiguredTasksRoleService } from '@services/roles/tasks/preconfiguredTasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { ConfigService } from '@services/shared/config.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { yesNo } from '@src/app/core/_constants/general.config';

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

  /** Read-only mode based on roles */
  isReadOnly = false;

  // TABLES CODE
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  /** HttpClient without interceptors to avoid global error dialog */
  private httpNoInterceptors: HttpClient;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router,
    private serializer: JsonAPISerializer,
    private cs: ConfigService,
    httpBackend: HttpBackend,
    protected roleService: PreconfiguredTasksRoleService
  ) {
    this.titleService.set(['Edit Preconfigured Tasks']);
    this.httpNoInterceptors = new HttpClient(httpBackend);
    this.buildForm();
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  async ngOnInit(): Promise<void> {
    this.isReadOnly = !this.roleService.hasRole('edit');

    this.buildForm();

    this.editedPretaskIndex = +this.route.snapshot.params['id'];

    try {
      await this.loadPretask();
      this.loadData();
      this.isLoading = false;
    } catch (e: unknown) {
      const status = e instanceof HttpErrorResponse ? e.status : undefined;

      if (status === 403) {
        this.router.navigateByUrl('/forbidden');
        return;
      }

      this.router.navigateByUrl('/not-found');
      return;
    }
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Builds the empty form.
   */
  buildForm(): void {
    this.updateForm = new FormGroup({
      pretaskId: new FormControl({ value: '', disabled: true }),
      statusTimer: new FormControl({ value: '', disabled: true }),
      useNewBench: new FormControl({ value: '', disabled: true }),
      updateData: new FormGroup({
        taskName: new FormControl({ value: '', disabled: this.isReadOnly }),
        attackCmd: new FormControl({ value: '', disabled: this.isReadOnly }),
        chunkTime: new FormControl({ value: '', disabled: this.isReadOnly }),
        color: new FormControl({ value: '', disabled: this.isReadOnly }),
        priority: new FormControl({ value: '', disabled: this.isReadOnly }),
        maxAgents: new FormControl({ value: '', disabled: this.isReadOnly }),
        isCpuTask: new FormControl({ value: '', disabled: this.isReadOnly }),
        isSmall: new FormControl({ value: '', disabled: this.isReadOnly })
      })
    });
  }

  private async loadPretask(): Promise<void> {
    const url = `${this.cs.getEndpoint()}${SERV.PRETASKS.URL}/${this.editedPretaskIndex}`;

    const response = await firstValueFrom<ResponseWrapper>(this.httpNoInterceptors.get<ResponseWrapper>(url));

    const pretask = this.serializer.deserialize<JPretask>({
      data: response.data,
      included: response.included
    });

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
        taskName: new FormControl(pretask.taskName, this.isReadOnly ? [] : [Validators.required]),
        attackCmd: new FormControl(pretask.attackCmd, this.isReadOnly ? [] : [Validators.required]),
        chunkTime: new FormControl(pretask.chunkTime),
        color: new FormControl(pretask.color),
        priority: new FormControl(pretask.priority),
        maxAgents: new FormControl(pretask.maxAgents),
        isCpuTask: new FormControl(pretask.isCpuTask, this.isReadOnly ? [] : [Validators.required]),
        isSmall: new FormControl(pretask.isSmall, this.isReadOnly ? [] : [Validators.required])
      })
    });
  }

  /**
   * Loads data, specifically Pretasks/files, for the component.
   */
  loadData(): void {
    const params = new RequestParamBuilder()
      .addFilter({ field: 'pretaskId', operator: FilterType.EQUAL, value: this.editedPretaskIndex })
      .addInclude('pretaskFiles')
      .create();

    const loadtableSubscription$ = this.gs.getAll(SERV.PRETASKS, params).subscribe((response: ResponseWrapper) => {
      const responseBody = { data: response.data, included: response.included };
      const pretasks = this.serializer.deserialize<JPretask[]>(responseBody);
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
  onSubmit(): void {
    if (this.updateForm.valid && !this.isReadOnly) {
      this.isUpdatingLoading = true;
      const updateSubscription$ = this.gs
        .update(SERV.PRETASKS, this.editedPretaskIndex, this.updateForm.value['updateData'])
        .subscribe(() => {
          this.alert.showSuccessMessage('PreTask saved');
          this.isUpdatingLoading = false;
          this.router.navigate(['tasks/preconfigured-tasks']);
        });
      this.unsubscribeService.add(updateSubscription$);
    }
  }
}
