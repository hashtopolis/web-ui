import { yesNo } from '@constants/general.config';
import { GlobalService } from 'src/app/core/_services/main.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JPretask } from '@models/pretask.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { PreconfiguredTasksRoleService } from '@services/roles/tasks/preconfiguredTasks-role.service';

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

  isReadOnly = false;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router,
    private serializer: JsonAPISerializer,
    protected roleService: PreconfiguredTasksRoleService
  ) {
    this.titleService.set(['Edit Preconfigured Tasks']);
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    if (this.roleService.hasRole('edit')) {
      this.isReadOnly = false;
    } else {
      this.isReadOnly = true;
    }

    this.route.params.subscribe((params: Params) => {
      this.editedPretaskIndex = +params['id'];
    });

    this.buildForm();
    this.initForm();
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

  /**
   * Loads data, specifically Pretasks, for the component.
   */
  initForm(): void {
    const params = new RequestParamBuilder().create();

    const loadSubscription$ = this.gs
      .get(SERV.PRETASKS, this.editedPretaskIndex, params)
      .subscribe((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };
        const pretask = this.serializer.deserialize<JPretask>(responseBody);

        this.updateForm.setValue({
          pretaskId: pretask.id,
          statusTimer: pretask.statusTimer,
          useNewBench: pretask.useNewBench,
          updateData: {
            taskName: pretask.taskName,
            attackCmd: pretask.attackCmd,
            chunkTime: pretask.chunkTime,
            color: pretask.color,
            priority: pretask.priority,
            maxAgents: pretask.maxAgents,
            isCpuTask: pretask.isCpuTask,
            isSmall: pretask.isSmall
          }
        });

        this.unsubscribeService.add(loadSubscription$);
      });
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
          this.alert.showSuccessMessage('PreTask saved');
          this.isUpdatingLoading = false;
          this.router.navigate(['tasks/preconfigured-tasks']);
        });
      this.unsubscribeService.add(updateSubscription$);
    }
  }
}
