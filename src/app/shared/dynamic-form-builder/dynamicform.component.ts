import { Subject, Subscription, takeUntil } from 'rxjs';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

import { BaseModel } from '@models/base.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { GlobalService } from '@services/main.service';

import { transformSelectOptions } from '@src/app/shared/utils/forms';

/**
 * This component renders a dynamic form based on the provided form metadata.
 */
@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamicform.component.html',
  standalone: false
})
export class DynamicFormComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * The title to display.
   * @type {string}
   */
  @Input() title: string;

  /**
   * An array of form field metadata that describes the form structure.
   */
  @Input() formMetadata: any[] = [];

  /**
   * Initial values for form fields (optional). If not provided, an empty object is used as the default.
   */
  @Input() formValues: any = {};

  /**
   * The Angular FormGroup that represents the dynamic form.
   */
  @Input() form: FormGroup;

  /**
   * Indicates whether the form is in "create" mode or "update" mode.
   * When true, it's in "create" mode, and when false, it's in "update" mode.
   */
  @Input() isCreateMode: boolean;

  /**
   * A boolean input property that controls the visibility of the "Delete" button.
   * Set it to `true` to display the "Delete" button, and `false` to hide it.
   * By default, the "Delete" button is displayed (set to `true`).
   */
  @Input() showDeleteButton = true;

  /**
   * The text to display on the "Create" or "Update" button.
   */
  @Input() buttonText: string;

  /**
   * Event emitter for submitting the form. Emits the form values when the form is submitted.
   * Parent components can subscribe to this event to handle form submissions.
   */
  @Output() formSubmit: EventEmitter<any> = new EventEmitter();

  /**
   * Event emitter for handling the delete action. Emits when the "Delete" action is triggered.
   * Parent components can subscribe to this event to perform delete operations.
   */
  @Output() deleteAction: EventEmitter<void> = new EventEmitter();

  /**
   * Event emitter for notifying when the selection type changes.
   * Emits a number representing the selected type.
   */

  @Output() selectTypeChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * A Subject used for managing the lifecycle and unsubscribing from observables when the component is destroyed.
   * The `destroy$` subject is used to signal the component's destruction.
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * A subscription to handle dynamic select options data retrieval.
   * This subscription is used to fetch and update select field options with dynamic data.
   */
  private selectOptionsSubscription: Subscription;

  /**
   * Indicates whether the dynamic select options are currently being loaded.
   * When true, it represents that options are being fetched; when false, loading is complete.
   */
  isLoadingSelect = true;

  /**
   * Indicates when a form is being submitted
   *
   */
  isSubmitting = false;

  /**
   * Constructor for the DynamicFormComponent.
   * @param fb - The Angular FormBuilder for creating form controls and groups.
   * @param gs - The GlobalService for handling global operations and API requests.
   * @param cd - The Angular ChangeDetectorRef for triggering change detection manually.
   */
  constructor(
    private fb: FormBuilder,
    private gs: GlobalService,
    private cd: ChangeDetectorRef
  ) {}

  // Util functions
  transformSelectOptions = transformSelectOptions;

  /**
   * Initializes the dynamic form by creating form controls and setting their initial values.
   * This method is called when the dynamic form component is initialized.
   */
  ngOnInit() {
    // Initialize an object to store the configuration of form controls.
    const controlsConfig = {};

    // Iterate through the form metadata to create and configure form controls.
    for (const field of this.formMetadata) {
      // Exclude fields marked as titles from form control creation.
      if (!field.isTitle) {
        // Get the name of the field.
        const fieldName = field.name;

        // Determine the validators for the field, defaulting to an empty array if none are provided.
        const validators: ValidatorFn[] = field.validators ? field.validators : [];

        // Initialize the initial value for the form control.
        let initialValue;

        // Set the initial value for the form control based on the field's type.
        if (field.type === 'checkbox') {
          // For checkboxes, use the value directly from formValues.
          initialValue = this.formValues[fieldName];
        } else {
          // For other field types, use formValues[fieldName] or a default value if not provided.
          initialValue = fieldName in this.formValues ? this.formValues[fieldName] : null;
        }
        if (!this.isCreateMode) {
          // For other field types, use formValues[fieldName] or 0 as a default value if not provided.
          initialValue = fieldName in this.formValues ? this.formValues[fieldName] : 0;
        }

        // In 'create' mode, override the initial value if a default value is specified in the field's metadata.
        if (this.isCreateMode && field.defaultValue !== undefined) {
          initialValue = field.defaultValue;
        }

        // Create a form control with the initial value and any specified validators.
        if (!this.isCreateMode && field.disabled) {
          // If in 'update' mode and the field is disabled, create a disabled form control.
          controlsConfig[fieldName] = { value: initialValue, disabled: true };
        } else {
          // Create a form control with the initial value and optional validators.
          controlsConfig[fieldName] = new FormControl(initialValue, validators);
        }
      }
    }

    // Create the Angular FormGroup with the configured controls.
    this.form = this.fb.group(controlsConfig);
  }

  /**
   * Angular lifecycle hook: ngAfterViewInit
   * Performs initialization and logic for select fields with dynamic options.
   */
  ngAfterViewInit() {
    // Check if there are any "select" type fields with "selectOptions$"
    const selectFields = this.formMetadata.filter((field) => field.type === 'selectd' && field.selectOptions$);

    if (selectFields.length > 0) {
      // Handle logic for select fields with selectOptions$ after the view is initialized
      selectFields.forEach((field) => {
        // Fetch the select options dynamically here
        this.selectOptionsSubscription = this.gs
          .getAll(field.selectEndpoint$, { page: { size: 5000 } })
          .pipe(takeUntil(this.destroy$))
          .subscribe((response: ResponseWrapper) => {
            // Sometimes fields need to be mapped
            const options = new JsonAPISerializer().deserialize<BaseModel[]>({
              data: response.data,
              included: response.included
            });
            // Assign the fetched options to the field's selectOptions$
            field.selectOptions$ = this.transformSelectOptions(options, field.fieldMapping);
            // Update isLoadingSelect to indicate that loading is complete
            this.isLoadingSelect = false;

            // Optionally, update the form control value if needed
            const control = this.form.get(field.name);

            // Check if there are options available
            if (control && options && options.length > 0 && !this.isCreateMode) {
              // Ensure that options[0] exists before setting the value
              const initialSelectedValue = this.formValues[field.name];

              if (initialSelectedValue !== undefined) {
                control.setValue(initialSelectedValue);
              }
            }

            // Trigger change detection to prevent ExpressionChangedAfterItHasBeenCheckedError
            this.cd.detectChanges();
          });
      });
    }
  }

  /**
   * Checks if the form is valid.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  formIsValid(): boolean {
    return this.form.valid;
  }

  /**
   * Handles the form submission.
   * Emits the form values to the parent component if the form is valid.
   */
  onSubmit() {
    if (this.form.valid) {
      this.isSubmitting = true;
      // Emit the form values to the parent component
      this.formSubmit.emit(this.form.value);
    }
  }

  /**
   * Handles the delete action.
   * Emits the delete action to the parent component when the "Delete" button is clicked.
   */
  onDelete() {
    this.deleteAction.emit();
  }

  /**
   * Handles the onchange action.
   * Emits the change action to the parent component when the select option is selected.
   */
  onChange(value: any) {
    this.selectTypeChange.emit(value);
  }

  /**
   * Angular lifecycle hook: ngOnDestroy
   * Unsubscribes from all relevant subscriptions and cleans up resources
   */
  ngOnDestroy() {
    // Unsubscribe from the selectOptionsSubscription
    if (this.selectOptionsSubscription) {
      this.selectOptionsSubscription.unsubscribe();
    }
    // Complete and close the destroy$ subject to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
