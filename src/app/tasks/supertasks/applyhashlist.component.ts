import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import {
  CRACKER_TYPE_FIELD_MAPPING,
  CRACKER_VERSION_FIELD_MAPPING
} from 'src/app/core/_constants/select.config';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from '../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';
import { FormControl, FormGroup } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { ListResponseWrapper } from 'src/app/core/_models/response.model';
import { Hashlist } from 'src/app/core/_models/hashlist.model';
import { transformSelectOptions } from 'src/app/shared/utils/forms';

/**
 * ApplyHashlistComponent is a component responsible for managing and applying hashlists.
 *
 */
@Component({
  selector: 'app-applyhashlist',
  templateUrl: './applyhashlist.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ApplyHashlistComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  /** Form group for the new SuperHashlist. */
  form: FormGroup;

  /** On form create show a spinner loading */
  isCreatingLoading = false;

  /** Select Options. */
  selectHashlists: any;
  selectCrackertype: any;
  selectCrackerversions: any = [];

  /** Select Options Mapping */
  selectCrackertypeMap = {
    fieldMapping: CRACKER_TYPE_FIELD_MAPPING
  };

  selectCrackervMap = {
    fieldMapping: CRACKER_VERSION_FIELD_MAPPING
  };

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
   * @returns {void}
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
    titleService.set(['Apply Hashlist']);
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
      crackerBinaryId: new FormControl(null || 1),
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
   *
   * @returns {void}
   */
  loadData() {
    // Load Hahslists Select Options
    const loadHashlistsSubscription$ = this.gs
      .getAll(SERV.HASHLISTS, {
        filter: 'isArchived=false,format=0'
      })
      .subscribe((response: ListResponseWrapper<Hashlist>) => {
        this.selectHashlists = response.values;
        this.isLoading = false;
        if (!this.selectHashlists.length) {
          this.alert.errorConfirmation(
            'Before proceeding, you need to create a Hashlist.'
          );
        }
        this.changeDetectorRef.detectChanges();
      });
    this.unsubscribeService.add(loadHashlistsSubscription$);

    // Load Cracker Types and Crackers Select Options
    const loadCrackerTypesSubscription$ = this.gs
      .getAll(SERV.CRACKERS_TYPES)
      .subscribe((response) => {
        const transformedOptions = transformSelectOptions(
          response.values,
          this.selectCrackertypeMap
        );
        this.selectCrackertype = transformedOptions;
        let id = '';
        if (this.selectCrackertype.find((obj) => obj.name === 'hashcat')._id) {
          id = this.selectCrackertype.find((obj) => obj.name === 'hashcat')._id;
        } else {
          id = this.selectCrackertype.slice(-1)[0]['_id'];
        }
        const loadCrackersSubscription$ = this.gs
          .getAll(SERV.CRACKERS, {
            filter: 'crackerBinaryTypeId=' + id + ''
          })
          .subscribe((response) => {
            const transformedOptions = transformSelectOptions(
              response.values,
              this.selectCrackervMap
            );
            this.selectCrackerversions = transformedOptions;
            const lastItem = this.selectCrackerversions.slice(-1)[0]['_id'];
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
   * @param {string} id - The selected Cracker Binary ID.
   * @returns {void}
   */
  handleChangeBinary(id: string) {
    const onChangeBinarySubscription$ = this.gs
      .getAll(SERV.CRACKERS, { filter: 'crackerBinaryTypeId=' + id + '' })
      .subscribe((response: any) => {
        const transformedOptions = transformSelectOptions(
          response.values,
          this.selectCrackervMap
        );
        this.selectCrackerversions = transformedOptions;
        const lastItem = this.selectCrackerversions.slice(-1)[0]['_id'];
        this.form.get('crackerBinaryTypeId').patchValue(lastItem);
      });
    this.unsubscribeService.add(onChangeBinarySubscription$);
  }

  /**
   * OnSubmit save changes
   */
  onSubmit() {
    const formValue = this.form.value;
    this.isCreatingLoading = true;
    // Adapt the form structure
    const adaptedFormValue = {
      supertaskTemplateId: formValue.supertaskTemplateId,
      hashlistId: formValue.hashlistId,
      crackerVersionId: formValue.crackerBinaryTypeId
    };

    const onSubmitSubscription$ = this.gs
      .chelper(SERV.HELPER, 'createSupertask', adaptedFormValue)
      .subscribe(() => {
        this.alert.okAlert('New SuperTask created!', '');
        this.router.navigate(['tasks/show-tasks']);
        this.isCreatingLoading = false;
      });

    this.unsubscribeService.add(onSubmitSubscription$);
  }
}
