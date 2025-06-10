import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JHashlist } from '@models/hashlist.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { UnsubscribeService } from '@services/unsubscribe.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { AlertService } from '@services/shared/alert.service';
import { GlobalService } from '@services/main.service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

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
  form: FormGroup;

  /** Select List of hashlists. */
  selectHashlists: any;

  /**
   * Constructor of the NewSuperhashlistComponent.
   *
   * @param unsubscribeService - The service responsible for managing subscriptions.
   * @param changeDetectorRef - Reference to the change detector to manually trigger change detection.
   * @param titleService - Service for managing the title of the page.
   * @param alert - Service for displaying alerts.
   * @param globalService - Service for making global API requests.
   * @param formBuilder - FormBuilder service for creating reactive forms.
   * @param router - Angular Router service for navigation.
   */
  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private alert: AlertService,
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.buildForm();
    titleService.set(['New SuperHashlist']);
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
      name: ['', Validators.required],
      hashlistIds: [null, Validators.required]
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
        this.selectHashlists = new JsonAPISerializer().deserialize<JHashlist>({
          data: response.data,
          included: response.included
        });
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
          this.alert.okAlert('New SuperHashList created!', '');
          this.form.reset();
          this.router.navigate(['hashlists/superhashlist']);
        });

      this.unsubscribeService.add(createSubscription$);
    }
  }
}
