import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JCrackerBinaryType } from '@models/cracker-binary.model';
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

import {
  CRACKER_TYPE_FIELD_MAPPING,
  CRACKER_VERSION_FIELD_MAPPING,
  DEFAULT_FIELD_MAPPING
} from '@src/app/core/_constants/select.config';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';

/**
 * ApplyHashlistComponent is a component responsible for managing and applying hashlists.
 *
 */
@Component({
  selector: 'app-applyhashlist',
  templateUrl: './applyhashlist.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false
})
export class ApplyHashlistComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the new SuperHashlist. */
  form: FormGroup;

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  /** Select Options. */
  selectHashlists: SelectOption[];
  selectCrackertype: SelectOption[];
  selectCrackerversions: SelectOption[];

  // Get SuperTask Index
  editedIndex: number;

  /**
   * Constructor for the ApplyHashlistComponent.
   * Initializes and sets up necessary services, properties, and the form.
   *
   * @param {UnsubscribeService} unsubscribeService - The service responsible for managing subscriptions.
   * @param {ChangeDetectorRef} changeDetectorRef - The reference to the Angular ChangeDetectorRef.
   * @param {AutoTitleService} titleService - The service responsible for setting the page title.
   * @param {ActivatedRoute} route - The Angular ActivatedRoute service for accessing route parameters.
   * @param {AlertService} alert - The service for displaying alert messages.
   * @param {GlobalService} gs - The service providing global functionality.
   * @param {Router} router - The Angular Router service for navigation.
   */
  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    this.onInitialize();
    this.buildForm();
    this.titleService.set(['Apply Hashlist']);
  }

  /**
   * Initializes the component by extracting and setting the user ID,
   */
  onInitialize() {
    this.route.params.subscribe((params: Params) => {
      this.editedIndex = +params['id'];
      this.initForm();
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
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
    this.form = new FormGroup({
      supertaskTemplateId: new FormControl(),
      hashlistId: new FormControl(),
      crackerBinaryId: new FormControl(),
      crackerBinaryTypeId: new FormControl()
    });
  }

  /**
   * Initializes the form for creating a new SuperHashlist.
   * Sets up form controls with default values and subscribes to changes for handling select cracker binary.
   * Loads necessary data.
   *
   * @returns {void}
   */
  initForm() {
    this.form = new FormGroup({
      supertaskTemplateId: new FormControl(this.editedIndex),
      hashlistId: new FormControl(),
      crackerBinaryId: new FormControl(1),
      crackerBinaryTypeId: new FormControl()
    });

    //subscribe to changes to handle select cracker binary
    this.form.get('crackerBinaryId').valueChanges.subscribe((newvalue) => {
      this.handleChangeBinary(newvalue);
    });

    this.loadData();
  }

  /**
   * Loads necessary data for the form, such as Hashlists, Cracker Types, and Crackers.
   * Populates select options for Hashlists, Cracker Types, and Crackers.
   * Handles subscriptions and updates form controls accordingly.
   */
  loadData() {
    this.loadHashlistSelectOptions();
    this.loadCrackerSelectOptions();
  }

  /**
   * Load hashlist select options
   */
  loadHashlistSelectOptions() {
    const requestParams = new RequestParamBuilder()
      .addFilter({ field: 'isArchived', operator: FilterType.EQUAL, value: false })
      .addFilter({ field: 'format', operator: FilterType.EQUAL, value: 0 })
      .create();

    const loadHashlistsSubscription$ = this.gs
      .getAll(SERV.HASHLISTS, requestParams)
      .subscribe((response: ResponseWrapper) => {
        const hashlists = new JsonAPISerializer().deserialize<JHashlist[]>({
          data: response.data,
          included: response.included
        });
        this.selectHashlists = transformSelectOptions(hashlists, DEFAULT_FIELD_MAPPING);
        this.isLoading = false;
        if (!this.selectHashlists.length) {
          this.alert.showErrorMessage('Before proceeding, you need to create a Hashlist.');
        }
        this.changeDetectorRef.detectChanges();
      });
    this.unsubscribeService.add(loadHashlistsSubscription$);
  }

  /**
   * Load cracker type and version select options
   */
  loadCrackerSelectOptions() {
    // Load Cracker Types and Crackers Select Options
    const loadCrackerTypesSubscription$ = this.gs.getAll(SERV.CRACKERS_TYPES).subscribe((response: ResponseWrapper) => {
      const crackerTypes = new JsonAPISerializer().deserialize<JCrackerBinaryType[]>({
        data: response.data,
        included: response.included
      });
      this.selectCrackertype = transformSelectOptions(crackerTypes, CRACKER_TYPE_FIELD_MAPPING);
      let id = '';
      if (this.selectCrackertype.find((obj) => obj.name === 'hashcat').id) {
        id = this.selectCrackertype.find((obj) => obj.name === 'hashcat').id as string;
      } else {
        id = this.selectCrackertype.slice(-1)[0]['id'] as string;
      }
      const requestParams = new RequestParamBuilder()
        .addFilter({ field: 'crackerBinaryTypeId', operator: FilterType.EQUAL, value: id })
        .create();
      const loadCrackersSubscription$ = this.gs
        .getAll(SERV.CRACKERS, requestParams)
        .subscribe((response: ResponseWrapper) => {
          const crackers = new JsonAPISerializer().deserialize<JCrackerBinaryType[]>({
            data: response.data,
            included: response.included
          });
          this.selectCrackerversions = transformSelectOptions(crackers, CRACKER_VERSION_FIELD_MAPPING);
          const lastItem = this.selectCrackerversions.slice(-1)[0]['id'];
          this.form.get('crackerBinaryTypeId').patchValue(lastItem);
        });
      this.unsubscribeService.add(loadCrackersSubscription$);
    });
    this.unsubscribeService.add(loadCrackerTypesSubscription$);
  }

  /**
   * Handles the change event for the Cracker Binary select control.
   * Loads and updates the list of Cracker Versions based on the selected Cracker Binary ID.
   * Subscribes to the corresponding API request and updates the form control accordingly.
   *
   * @param id - The selected Cracker Binary ID.
   */
  handleChangeBinary(id: string) {
    const requestParams = new RequestParamBuilder()
      .addFilter({ field: 'crackerBinaryTypeId', operator: FilterType.EQUAL, value: id })
      .create();
    const onChangeBinarySubscription$ = this.gs
      .getAll(SERV.CRACKERS, requestParams)
      .subscribe((response: ResponseWrapper) => {
        const crackers = new JsonAPISerializer().deserialize<JCrackerBinaryType[]>({
          data: response.data,
          included: response.included
        });
        this.selectCrackerversions = transformSelectOptions(crackers, CRACKER_VERSION_FIELD_MAPPING);
        const lastItem = this.selectCrackerversions.slice(-1)[0]['id'];
        this.form.get('crackerBinaryTypeId').patchValue(lastItem);
      });
    this.unsubscribeService.add(onChangeBinarySubscription$);
  }

  /**
   * OnSubmit save changes
   */
  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.isCreatingLoading = true;
      // Adapt the form structure
      const adaptedFormValue = {
        supertaskTemplateId: formValue.supertaskTemplateId,
        hashlistId: formValue.hashlistId,
        crackerVersionId: formValue.crackerBinaryTypeId
      };
      const onSubmitSubscription$ = this.gs.chelper(SERV.HELPER, 'createSupertask', adaptedFormValue).subscribe(() => {
        this.alert.showSuccessMessage('New SuperTask created');
        this.router.navigate(['tasks/show-tasks']);
        this.isCreatingLoading = false;
      });
      this.unsubscribeService.add(onSubmitSubscription$);
    } else {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }
}
