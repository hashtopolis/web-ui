import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { JPretask } from '@models/pretask.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { PRETASKS_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

/**
 * Component class to create a new supertask
 */
@Component({
  selector: 'app-new-supertasks',
  templateUrl: './new-supertasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class NewSupertasksComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the new SuperTask. */
  form: FormGroup;

  @Input()
  error;

  /** List of PreTasks. */
  selectPretasks: SelectOption[];

  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private formBuilder: FormBuilder,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    this.buildForm();
    this.titleService.set(['New SuperTask']);
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
    this.form = this.formBuilder.group({
      supertaskName: ['', Validators.required],
      pretasks: ['', Validators.required]
    });
  }

  /**
   * Loads data, specifically hashlists, for the component.
   */
  loadData(): void {
    const loadSubscription$ = this.gs.getAll(SERV.PRETASKS).subscribe((response: ResponseWrapper) => {
      const pretasks = new JsonAPISerializer().deserialize<JPretask[]>({
        data: response.data,
        included: response.included
      });
      this.selectPretasks = transformSelectOptions(pretasks, PRETASKS_FIELD_MAPPING);
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
    });
    this.unsubscribeService.add(loadSubscription$);
  }

  /**
   * Handles form submission, creating a new SuperTask.
   * If the form is valid, it makes an API request and navigates to the Supertaks page.
   */
  onSubmit() {
    if (this.form.valid) {
      const createSubscription$ = this.gs.create(SERV.SUPER_TASKS, this.form.value).subscribe(() => {
        this.alert.showSuccessMessage('New SuperTask created');
        this.form.reset();
        this.router.navigate(['tasks/supertasks']);
      });

      this.unsubscribeService.add(createSubscription$);
    }
  }
}
