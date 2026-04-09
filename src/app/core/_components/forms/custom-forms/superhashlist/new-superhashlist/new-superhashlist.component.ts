import { zHashlistListResponse } from '@generated/api/zod';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { JHashlist } from '@models/hashlist.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { DEFAULT_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

interface NewSuperhashlistForm {
  name: FormControl<string>;
  hashlistIds: FormControl<number[] | null>;
}

/**
 * Represents the NewSuperhashlistComponent responsible for creating a new SuperHashlist.
 */
@Component({
  selector: 'app-new-superhashlist',
  templateUrl: './new-superhashlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class NewSuperhashlistComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the new SuperHashlist. */
  form: FormGroup<NewSuperhashlistForm>;

  /** Select List of hashlists. */
  selectHashlists: SelectOption[];

  private unsubscribeService = inject(UnsubscribeService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private titleService = inject(AutoTitleService);
  private alert = inject(AlertService);
  private globalService = inject(GlobalService);
  private router = inject(Router);

  constructor() {
    this.buildForm();
    this.titleService.set(['New SuperHashlist']);
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
    this.form = new FormGroup<NewSuperhashlistForm>({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      hashlistIds: new FormControl<number[] | null>(null, [Validators.required])
    });
  }

  /**
   * Loads data, specifically hashlists, for the component.
   */
  loadData(): void {
    const requestParams = new RequestParamBuilder()
      .addFilter({ field: 'isArchived', operator: FilterType.EQUAL, value: false })
      .addFilter({ field: 'format', operator: FilterType.EQUAL, value: 0 })
      .create();

    const loadSubscription$ = this.globalService
      .getAll(SERV.HASHLISTS, requestParams)
      .subscribe((response: ResponseWrapper) => {
        const hashlists: JHashlist[] = new JsonAPISerializer().deserialize(response, zHashlistListResponse);
        this.selectHashlists = transformSelectOptions(hashlists, DEFAULT_FIELD_MAPPING);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
    this.unsubscribeService.add(loadSubscription$);
  }

  /**
   * Handles form submission, creating a new SuperHashlist.
   * If the form is valid, it makes an API request and navigates to the SuperHashlist page.
   */
  onSubmit(): void {
    if (this.form.valid) {
      const createSubscription$ = this.globalService
        .chelper(SERV.HELPER, 'createSuperHashlist', this.form.value)
        .subscribe(() => {
          this.alert.showSuccessMessage('New SuperHashList created');
          this.router.navigate(['hashlists/superhashlist']);
        });

      this.unsubscribeService.add(createSubscription$);
    } else {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }
}
