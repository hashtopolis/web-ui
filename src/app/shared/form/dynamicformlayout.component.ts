import { FormBuilder, FormGroup, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, combineLatest, forkJoin, map, switchMap, takeUntil } from 'rxjs';
import { MetadataService } from 'src/app/core/_services/metadata.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { ChangeDetectorRef } from '@angular/core';

/**
 * This component renders a dynamic form based on the provided form metadata.
 */
@Component({
  selector: 'app-dynamic-form',
  template: `
<app-page-subtitle [subtitle]="subtitle"></app-page-subtitle>
<grid-main [class]="'width:100%;'" [centered]="true">
  <form [formGroup]="form" (ngSubmit)="onSubmit()">
   <grid-autocol [itemCount]="formMetadata.length">
     <div *ngFor="let row of customLayout">
        <div class="row g-3">
           <ng-container *ngFor="let field of row">
              <div class="col-md-{{ 12 / row.length }}">
                <div *ngFor="let field of formMetadata">
                  <div class="form-group" *ngIf="field.type !== 'hidden'">
                    <ng-container *ngIf="field.isTitle">
                      <h5>{{ field.label }}</h5>
                    </ng-container>
                    <ng-container *ngIf="!field.isTitle">
                      <div class="form-group">
                        <div class="form-outline form-input-custom">
                          <label [class.requiredak]="field.requiredasterisk" class="form-label" [for]="field.name">{{ field.label }}</label>
                          <fa-icon
                                placement="bottom"
                                ngbTooltip="{{field.tooltip}}"
                                container="body"
                                [icon]="faInfoCircle"
                                aria-hidden="true"
                                class="gray-light-ico display-col"
                                *ngIf="field.tooltip"
                          ></fa-icon>
                          <ng-container [ngSwitch]="field.type">
                            <td *ngSwitchCase="'number'">
                              <input class="form-control" type="number" [formControlName]="field.name">
                            </td>
                            <div *ngSwitchCase="'text'">
                              <input class="form-control" [type]="field.type" [formControlName]="field.name">
                            </div>
                            <div *ngSwitchCase="'password'">
                              <input class="form-control" type="password" [formControlName]="field.name">
                            </div>
                            <div *ngSwitchCase="'textarea'">
                              <textarea class="form-control" [formControlName]="field.name"></textarea>
                            </div>
                            <div *ngSwitchCase="'email'">
                              <input class="form-control" [type]="field.type" [formControlName]="field.name">
                            </div>
                            <div *ngSwitchCase="'select'">
                              <select class="form-select" [formControlName]="field.name">
                                <option *ngFor="let option of field.selectOptions" [ngValue]="option.value">{{ option.label }}</option>
                              </select>
                            </div>
                            <div *ngSwitchCase="'selectd'">
                            <select class="form-select" [formControlName]="field.name">
                              <ng-container *ngIf="isLoadingSelect; else options">
                                <option disabled>Loading...</option>
                              </ng-container>
                              <ng-template #options>
                                <option [ngValue]="null">Please Select an Option</option>
                                <option *ngFor="let option of field.selectOptions$" [ngValue]="option.id">{{ option.name }}</option>
                              </ng-template>
                            </select>
                            </div>
                            <td *ngSwitchCase="'checkbox'" class="form-check form-switch">
                              <input type="checkbox" [formControlName]="field.name" [id]="field.name" class="form-check-input">
                            </td>
                          </ng-container>
                        </div>
                      </div>
                    </ng-container>
                  </div>
                </div>
              </div>
           </ng-container>
        </div>
     </div>
     <grid-buttons>
        <button-submit name="Cancel" [disabled]="false" type="cancel" *ngIf="isCreateMode"></button-submit>
        <button-submit name="Delete" [disabled]="false" type="delete" *ngIf="!isCreateMode && showDeleteButton" (click)="onDelete()">Delete</button-submit>
        <button-submit [name]="buttonText" [disabled]="!formIsValid()"></button-submit>
      </grid-buttons>
   </grid-autocol>
  </form>
</grid-main>
  `,
})
export class DynamicFormComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * FontAwesome icon for providing additional information in form fields.
   */
  faInfoCircle = faInfoCircle;

  /**
   * The subtitle to display.
   * @type {string}
   */
  @Input() subtitle: string;

  /**
   * An array of form field metadata that describes the form structure.
   */
  @Input() formMetadata: any[] = [];

  /**
   * Additional CSS class for labels.
   */
  @Input() labelclass?: any;

  /**
   * Initial values for form fields (optional). If not provided, an empty object is used as the default.
   */
  @Input() formValues: any = {};

  /**
   * The Angular FormGroup that represents the dynamic form.
   */
  @Input() form: FormGroup;

  /**
   * Define the custom layout array.
   */
  @Input() customLayout: any[];

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
  @Input() showDeleteButton: boolean = true;

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
   * A Subject used for managing the lifecycle and unsubscribing from observables when the component is destroyed.
   * The `destroy$` subject is used to signal the component's destruction.
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Constructor for the DynamicFormComponent.
   * @param fb - The Angular FormBuilder for creating form controls and groups.
   * @param gs - The GlobalService for handling global operations and API requests.
   * @param cd - The Angular ChangeDetectorRef for triggering change detection manually.
   */
  constructor(private fb: FormBuilder, private gs: GlobalService, private cd: ChangeDetectorRef) {}

  /**
   * Initializes the dynamic form by creating form controls and setting their initial values.
   * This method is called when the dynamic form component is initialized.
   */
  ngOnInit() {
  // Check if this.customLayout is iterable and fallback to an empty array if it's not.
  const customLayout = Array.isArray(this.customLayout) ? this.customLayout : [];

      // Initialize an object to store the configuration of form rows.
    const formRows = [];
    // Iterate through customLayout to define the structure of form rows and columns.
    for (const row of customLayout) {
      // Create a FormGroup for each row.
      const formRow = new FormGroup({});

      // Iterate through the fields in the formMetadata to create and configure form controls.
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
            formRows[fieldName] = { value: initialValue, disabled: true };
          } else {
            // Create a form control with the initial value and optional validators.
            formRows[fieldName] = new FormControl(initialValue, validators);
          }

          // Create a form control with the initial value and any specified validators.
          const formControl = new FormControl(formRows);

          // Add the form control to the formRow with fieldName as the key.
          formRow.addControl(fieldName, formControl);
        }
      // Add the formRow (FormGroup for the current row) to the list of rows.
      formRows.push(formRow);
    }
  }
  // Create the Angular FormGroup with the configured controls.
  this.form = this.fb.group(formRows);
  }

  /**
   * A subscription to handle dynamic select options data retrieval.
   * This subscription is used to fetch and update select field options with dynamic data.
   */
  private selectOptionsSubscription: Subscription;

  /**
   * Indicates whether the dynamic select options are currently being loaded.
   * When true, it represents that options are being fetched; when false, loading is complete.
   */
  isLoadingSelect: boolean = true;

  /**
   * Angular lifecycle hook: ngAfterViewInit
   * Performs initialization and logic for select fields with dynamic options.
   */
  ngAfterViewInit() {
    // Check if there are any "select" type fields with "selectOptions$"
    const selectFields = this.formMetadata.filter(
      (field) => field.type === 'selectd' && field.selectOptions$
    );

    if (selectFields.length > 0) {
      // Handle logic for select fields with selectOptions$ after the view is initialized
      selectFields.forEach((field) => {
        // Fetch the select options dynamically here
        this.selectOptionsSubscription = this.gs.getAll(field.selectEndpoint$,{'maxResults': 5000})
        .pipe(takeUntil(this.destroy$))
        .subscribe((options) => {

          // Sometimes fields need to be mapped
          const transformedOptions = this.transformSelectOptions(options.values, field);

          // Assign the fetched options to the field's selectOptions$
          field.selectOptions$ = transformedOptions;

          // Update isLoadingSelect to indicate that loading is complete
          this.isLoadingSelect = false;

          // Optionally, update the form control value if needed
          const control = this.form.get(field.name);

          // Check if there are options available
          if (control && options.values && options.values.length > 0 && !this.isCreateMode) {
            // Ensure that options.values[0] and options.values[0].value exist before setting the value
            const initialSelectedValue = options.values[0]?.value;

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
   * Transforms API response options based on a field mapping configuration.
   *
   * @param apiOptions - The options received from an API response.
   * @param field - The field configuration that contains the mapping between form fields and API fields.
   *
   * @returns An array of transformed select options to be used in the form.
   */
  transformSelectOptions(apiOptions: any[], field: any): any[] {
    return apiOptions.map((apiOption: any) => {
      const transformedOption: any = {};

      for (const formField of Object.keys(field.fieldMapping)) {
        const apiField = field.fieldMapping[formField];

        if (Object.prototype.hasOwnProperty.call(apiOption, apiField)) {
          transformedOption[formField] = apiOption[apiField];
        } else {
          // Handle the case where the API field doesn't exist in the response
          transformedOption[formField] = null; // or set a default value
        }
      }

      return transformedOption;
    });
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
      // Emit the form values to the parent component
      this.formSubmit.emit(this.form.value);
    }
  }

  /**
   * Handles the delete action.
   * Emits the delete action to the parent component when the "Delete" button is clicked.
  */
  onDelete(){
    this.deleteAction.emit();
  }

  /**
   * Angular lifecycle hook: ngOnDestroy
   * Unsubscribes from all relevant subscriptions and cleans up resources
   */
  ngOnDestroy() {
    // Unsubscribe from the selectOptionsSubscription
    // this.selectOptionsSubscription.unsubscribe();

    // Complete and close the destroy$ subject to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

}
