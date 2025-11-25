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

  pretask: any = [];
  files: any; //Add Model

  // TABLES CODE
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  private httpNoInterceptors: HttpClient;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router,
    private serializer: JsonAPISerializer,
    private http: HttpClient,
    private cs: ConfigService,
    httpBackend: HttpBackend
  ) {
    this.buildForm();
    this.titleService.set(['Edit Preconfigured Tasks']);
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  async ngOnInit(): Promise<void> {
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
   * Carga el pretask desde la API y rellena el formulario.
   * Lanza error si el recurso no existe (404 / 403).
   */
  private async loadPretask(): Promise<void> {
    const url = `${this.cs.getEndpoint()}${SERV.PRETASKS.URL}/${this.editedPretaskIndex}`;

    const response = await firstValueFrom<ResponseWrapper>(this.httpNoInterceptors.get<ResponseWrapper>(url));

    const pretask = this.serializer.deserialize<JPretask>({
      data: response.data,
      included: response.included
    });

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
  onSubmit(): void {
    if (this.updateForm.valid) {
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
