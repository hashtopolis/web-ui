import { zPreTaskListResponse } from '@generated/api/zod';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PretaskId } from '@models/id.types';
import { JPretask } from '@models/pretask.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { PRETASKS_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

/**
 * Component class to create a new Supertask
 */
@Component({
  selector: 'app-new-supertasks',
  templateUrl: './new-supertasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class NewSupertasksComponent implements OnInit {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the new Supertask. */
  form: FormGroup;

  /** List of Preconfigured Tasks. */
  selectPretasks: SelectOption<PretaskId>[];

  private destroyRef = inject(DestroyRef);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private titleService = inject(AutoTitleService);
  private formBuilder = inject(FormBuilder);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);

  constructor() {
    this.buildForm();
    this.titleService.set(['New Supertask']);
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Builds the form for creating a new Supertask.
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
    this.gs
      .getAll(SERV.PRETASKS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: ResponseWrapper) => {
        const pretasks: JPretask[] = new JsonAPISerializer().deserialize(response, zPreTaskListResponse);
        this.selectPretasks = transformSelectOptions(pretasks, PRETASKS_FIELD_MAPPING);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  /**
   * Handles form submission, creating a new SuperTask.
   * If the form is valid, it makes an API request and navigates to the Supertaks page.
   */
  onSubmit() {
    if (this.form.valid) {
      this.gs
        .create(SERV.SUPER_TASKS, this.form.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.alert.showSuccessMessage('New Supertask created');
          this.router.navigate(['tasks/supertasks']);
        });
    } else {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }
}
