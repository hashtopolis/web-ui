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
<grid-main>
<app-page-subtitle [subtitle]="subtitle"></app-page-subtitle>
  <form [formGroup]="form" (ngSubmit)="onSubmit()">
   <grid-autocol [itemCount]="formMetadata.length">
      <div *ngFor="let field of formMetadata">
        <div *ngIf="field.type !== 'hidden'">
          <ng-container *ngIf="field.isTitle">
            <h5>{{ field.label }}</h5>
          </ng-container>
          <ng-container *ngIf="!field.isTitle">
          <p>
              <mat-form-field appearance="fill">
                <mat-label [ngClass]="{'requiredak': field.requiredasterisk}">{{ field.label }}</mat-label>
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
                <ng-container *ngSwitchCase="'number'">
                  <input matInput type="number" [formControlName]="field.name">
                </ng-container>
                <ng-container *ngSwitchCase="'text'">
                  <input matInput [type]="field.type" [formControlName]="field.name">
                </ng-container>
                <ng-container *ngSwitchCase="'password'">
                  <input matInput type="password" [formControlName]="field.name">
                </ng-container>
                <ng-container *ngSwitchCase="'textarea'">
                  <textarea matInput [formControlName]="field.name"></textarea>
                </ng-container>
                <ng-container *ngSwitchCase="'email'">
                  <input matInput [type]="field.type" [formControlName]="field.name">
                </ng-container>
                <ng-container *ngSwitchCase="'select'">
                  <mat-select [formControlName]="field.name">
                    <mat-option *ngFor="let option of field.selectOptions" [value]="option.value">{{ option.label }}</mat-option>
                  </mat-select>
                </ng-container>
                <ng-container *ngSwitchCase="'selectd'">
                  <mat-select [formControlName]="field.name">
                    <mat-option [value]="null">Please Select an Option</mat-option>
                    <mat-option *ngFor="let option of field.selectOptions$" [value]="option.id">{{ option.name }}</mat-option>
                  </mat-select>
                </ng-container>
                <ng-container *ngSwitchCase="'checkbox'">
                  <mat-checkbox [formControlName]="field.name">{{ field.label }}</mat-checkbox>
                </ng-container>
                </ng-container>
              </mat-form-field>
          </p>
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

  @Output() selectTypeChange: EventEmitter<number> = new EventEmitter<number>();

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
      } if (!this.isCreateMode) {
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
    // this.selectOptionsSubscription.unsubscribe();

    // Complete and close the destroy$ subject to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

}
