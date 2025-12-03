import { Subscription } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { BaseModel } from '@models/base.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { ServiceConfig } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { MetadataService } from '@services/metadata.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

@Component({
  selector: 'app-form',
  templateUrl: 'form.component.html',
  standalone: false
})
/**
 * Component for managing forms, supporting both create and edit modes.
 */
export class FormComponent implements OnInit, OnDestroy {
  // Metadata Text, titles, subtitles, forms, and API path
  globalMetadata: ReturnType<MetadataService['getInfoMetadata']>[0];

  serviceConfig: ServiceConfig;

  /**
   * Indicates the mode of the form: either 'create' or 'edit'.
   * This property determines whether the form is in the process of creating a new item or editing an existing one.
   * @type {string}
   */
  type: string;

  /**
   * Flag that indicates whether the data for the form has been loaded and the form is ready for rendering.
   * When true, the form is fully loaded and can be displayed; otherwise, it's still being prepared.
   * @type {boolean}
   */
  isloaded = false;

  /**
   * Flag that specifies whether the form is in "create" mode.
   * When true, the form is set to create a new item; when false, it's in edit mode for an existing item.
   * @type {boolean}
   */
  isCreate: boolean;

  /**
   * The index of the item being edited in "edit" mode.
   * This value is set when editing an existing item and represents the unique identifier of the item.
   * @type {number}
   */
  editedIndex: number;

  /**
   * Title to be displayed in the form.
   * @type {string}
   */
  title: string;

  /**
   * The Angular FormGroup representing the dynamic form.
   * This FormGroup contains form controls for all fields in the formMetadata.
   */
  form: FormGroup;

  /**
   * Indicates if a custom form layout is used.
   * Custom forms may have special logic or layouts.
   * @type {boolean}
   */
  customform: boolean;

  /**
   * An array of form field metadata that describes the form structure.
   * Each item in the array represents a form field, including its type, label, and other properties.
   */
  formMetadata: ReturnType<MetadataService['getFormMetadata']> = [];

  /**
   * Initial values for form fields (optional).
   * If provided, these values are used to initialize form controls in the dynamic form.
   */
  formValues: (BaseModel & Record<string, unknown>)[] = [];

  // Subscription for managing asynchronous data retrieval
  private subscriptionService: Subscription;

  // Subscription for managing router params
  private routeParamsSubscription: Subscription;

  /**
   * Constructor for the FormComponent.
   * @param unsubscribeService - The UnsubscribeService for managing subscriptions.
   * @param metadataService - The MetadataService for accessing form metadata.
   * @param titleService - The AutoTitleService for setting titles.
   * @param route - The ActivatedRoute for retrieving route data.
   * @param alert - The AlertService for displaying alerts.
   * @param gs - The GlobalService for handling global operations.
   * @param router - The Angular Router for navigation.
   * @param confirmDialog
   */
  constructor(
    private unsubscribeService: UnsubscribeService,
    private metadataService: MetadataService,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router,
    private confirmDialog: ConfirmDialogService
  ) {
    // Subscribe to route data to initialize component data
    this.routeParamsSubscription = this.route.data.subscribe(
      (data: { kind: string; serviceConfig: ServiceConfig; type: string }) => {
        const formKind = data.kind;
        this.serviceConfig = data.serviceConfig; // Get the API path from route data
        this.type = data.type;
        this.isCreate = this.type === 'create';
        // Load metadata and form information
        this.globalMetadata = this.metadataService.getInfoMetadata(formKind + 'Info')[0];
        this.formMetadata = this.metadataService.getFormMetadata(formKind);
        this.title = this.globalMetadata['title'];
        this.customform = this.globalMetadata['customform'];
        this.titleService.set([this.title]);
        // Load metadata and form information
        if (this.type === 'edit') {
          this.getIndex();
          this.loadEdit(); // Load data for editing
        } else {
          this.isloaded = true;
        }
      }
    );
    // Add this.mySubscription to UnsubscribeService
    this.unsubscribeService.add(this.subscriptionService);
  }

  /**
   * Loads data for editing a form.
   */
  getIndex() {
    this.routeParamsSubscription = this.route.params.subscribe((params: Params) => {
      this.editedIndex = +params['id'];
    });
  }

  /**
   * Loads data for editing a form.
   */
  loadEdit() {
    this.route.params.subscribe((params: Params) => {
      this.editedIndex = +params['id'];
    });

    // Fetch data from the API for editing
    const editSubscription = this.gs.get(this.serviceConfig, this.editedIndex).subscribe({
      next: (response: ResponseWrapper) => {
        this.formValues = new JsonAPISerializer().deserialize({ data: response.data, included: response.included });
        this.isloaded = true; // Data is loaded and ready for form rendering
      },
      error: (err: unknown) => {
        const status = err instanceof HttpErrorResponse ? err.status : undefined;
        if (status === 403) {
          this.router.navigateByUrl('/forbidden');
          return;
        }
        if (status === 404) {
          this.router.navigateByUrl('/not-found');
          return;
        }

        // For other server errors show a friendly message
        // eslint-disable-next-line no-console
        console.error('Error loading form data:', err);
        const msg = status ? `Error loading data (server returned ${status}).` : 'Error loading data.';
        this.alert.showErrorMessage(msg);
        this.isloaded = false;
      }
    });

    this.unsubscribeService.add(editSubscription);
  }

  /**
   * Angular lifecycle hook: ngOnInit
   */
  ngOnInit(): void {
    // If in "edit" mode, load data for editing
    if (this.type === 'edit') {
      this.loadEdit();
    }
  }

  /**
   * Angular lifecycle hook: ngOnDestroy
   * Unsubscribe from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    // Unsubscribe from the route params subscription
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
      this.routeParamsSubscription = null;
    }

    // Unsubscribe from other subscriptions
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Handles the submission of the form.
   * @param formValues - The values submitted from the form.
   */
  onFormSubmit(formValues: (BaseModel & Record<string, unknown>)[]) {
    if (this.customform) {
      this.modifyFormValues(formValues);
    }
    if (this.type === 'create') {
      // Create mode: Submit form data for creating a new item
      const createSubscription = this.gs.create(this.serviceConfig, formValues).subscribe(() => {
        this.alert.showSuccessMessage(this.globalMetadata['submitok']);
        this.router.navigate([this.globalMetadata['submitokredirect']]); // Navigate after alert
      });

      this.unsubscribeService.add(createSubscription);
    } else {
      // Update mode: Submit form data for updating an existing item
      const updateSubscription = this.gs.update(this.serviceConfig, this.editedIndex, formValues).subscribe(() => {
        this.alert.showSuccessMessage(this.globalMetadata['submitok']);
        this.router.navigate([this.globalMetadata['submitokredirect']]);
      });
      this.unsubscribeService.add(updateSubscription);
    }
  }

  /**
   * Modifies the form values as needed for custom form submission.
   * @param formValues - The form values to be modified.
   * @returns The modified form values.
   */
  modifyFormValues(formValues: (BaseModel | Record<string, unknown>)[]) {
    // Check the formMetadata for fields with 'replacevalue' property
    this.getIndex();
    for (const field of this.formMetadata) {
      if (field.replacevalue) {
        // Replace the value with the 'editedIndex'
        formValues[field.name] = this.editedIndex;
      }
      // Add custom logic to modify formValues as needed
    }

    // Return the modified formValues
    return formValues;
  }

  /**
   * Handles the deletion action when the "Delete" button is clicked.
   * Displays a confirmation dialog and, if confirmed, triggers the deletion of the item.
   * Emits success alerts and navigates to the appropriate route.
   */
  onDeleteAction() {
    if (this.globalMetadata['deltitle']) {
      this.getIndex();
    }
    this.confirmDialog
      .confirmDeletion(this.globalMetadata['deltitle'], `${this.editedIndex}`)
      .subscribe((confirmed) => {
        if (confirmed) {
          // Deletion
          const deleteSubscription = this.gs.delete(this.serviceConfig, this.editedIndex).subscribe(() => {
            this.router
              .navigate([this.globalMetadata['delsubmitokredirect']])
              .then(() => this.alert.showSuccessMessage(this.globalMetadata['delsubmitok']));
          });
          this.unsubscribeService.add(deleteSubscription);
        } else {
          this.alert.showInfoMessage(this.globalMetadata['delsubmitcancel']);
        }
      });
  }
}
