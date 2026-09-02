import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';
import { FormRouteData, FormRouteType, zFormRouteData, zIdRouteParams } from '@models/routes.schema';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { ServiceConfig } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { MetadataService } from '@services/metadata.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-form',
  templateUrl: 'form.component.html',
  standalone: false
})
/**
 * Component for managing forms, supporting both create and edit modes.
 */
export class FormComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private metadataService = inject(MetadataService);
  private titleService = inject(AutoTitleService);
  private route = inject(ActivatedRoute);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);
  private router = inject(Router);
  private confirmDialog = inject(ConfirmDialogService);

  // Metadata Text, titles, subtitles, forms, and API path
  globalMetadata: ReturnType<MetadataService['getInfoMetadata']>[0];

  serviceConfig: ServiceConfig;

  responseSchema: FormRouteData['responseSchema'];

  showDeleteButton: boolean = true;

  /**
   * Indicates the mode of the form: either 'create' or 'edit'.
   * This property determines whether the form is in the process of creating a new item or editing an existing one.
   * @type {string}
   */
  type: FormRouteType;

  /**
   * Flag that indicates whether the data for the form has been loaded and the form is ready for rendering.
   * When true, the form is fully loaded and can be displayed; otherwise, it's still being prepared.
   * @type {boolean}
   */
  isloaded: boolean = false;

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
  formValues: Record<string, unknown> = {};

  /**
   * Constructor for the FormComponent.
   * @param metadataService - The MetadataService for accessing form metadata.
   * @param titleService - The AutoTitleService for setting titles.
   * @param route - The ActivatedRoute for retrieving route data.
   * @param alert - The AlertService for displaying alerts.
   * @param gs - The GlobalService for handling global operations.
   * @param router - The Angular Router for navigation.
   * @param confirmDialog
   */
  constructor() {
    // Subscribe to route data to initialize component data
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      const routeData = zFormRouteData.parse(data);
      const formKind = routeData.kind;
      this.serviceConfig = routeData.serviceConfig;
      this.responseSchema = routeData.responseSchema;
      this.type = routeData.type;
      this.isCreate = this.type === FormRouteType.Create;
      // Load metadata and form information
      this.globalMetadata = this.metadataService.getInfoMetadata(formKind + 'Info')[0];
      this.formMetadata = this.metadataService.getFormMetadata(formKind);
      this.title = this.globalMetadata.title;
      this.customform = this.globalMetadata.customform ?? false;
      this.titleService.set([this.title]);
      // Load metadata and form information
      if (this.type === FormRouteType.Edit) {
        this.getIndex();
        this.loadEdit(); // Load data for editing
      } else {
        this.isloaded = true;
      }
    });
  }

  /**
   * Loads data for editing a form.
   */
  getIndex() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      this.editedIndex = zIdRouteParams.parse(params).id;
    });
  }

  /**
   * Loads data for editing a form.
   */
  loadEdit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      this.editedIndex = zIdRouteParams.parse(params).id;
    });

    // Fetch data from the API for editing
    this.gs
      .get(this.serviceConfig, this.editedIndex)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ResponseWrapper) => {
          this.formValues = this.responseSchema
            ? (new JsonAPISerializer().deserialize(response, this.responseSchema) as Record<string, unknown>)
            : new JsonAPISerializer().deserialize<Record<string, unknown>>(response);
          this.applyDynamicTitle();
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

          console.error('Error loading form data:', err);
          const msg = status ? `Error loading data (server returned ${status}).` : 'Error loading data.';
          this.alert.showErrorMessage(msg);
          this.isloaded = false;
        }
      });
  }

  /**
   * In edit mode, when the metadata declares `titleField`, build the page title
   * from the loaded entity. `titleField` may name several fields, whose values
   * are joined with spaces (e.g. "hashcat 6.2.6"). An optional `titlePrefix` is
   * prepended as a static entity word (e.g. "Wordlist rockyou.txt"). Keeps the
   * static title when neither prefix nor field yields anything.
   */
  private applyDynamicTitle(): void {
    const { titlePrefix, titleField } = this.globalMetadata;
    if (!titleField) {
      return;
    }
    const fields = Array.isArray(titleField) ? titleField : [titleField];
    const parts = [titlePrefix, ...fields.map((field) => this.formValues[field])].filter(
      (value) => value !== undefined && value !== null && value !== ''
    );
    if (parts.length) {
      this.title = parts.join(' ');
      this.titleService.set([this.title]);
    }
  }

  /**
   * Angular lifecycle hook: ngOnInit
   */
  ngOnInit(): void {
    // If in "edit" mode, load data for editing
    if (this.type === FormRouteType.Edit) {
      this.loadEdit();
    }
  }

  /**
   * Handles the submission of the form.
   * @param formValues - The values submitted from the form.
   */
  onFormSubmit(formValues: Record<string, unknown>) {
    if (this.customform) {
      this.modifyFormValues(formValues);
    }
    if (this.type === FormRouteType.Create) {
      // Create mode: Submit form data for creating a new item
      this.gs
        .create(this.serviceConfig, formValues)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.alert.showSuccessMessage(this.globalMetadata.submitok ?? '');
          this.router.navigate([this.globalMetadata.submitokredirect ?? '/']); // Navigate after alert
        });
    } else {
      // Update mode: Submit form data for updating an existing item
      this.gs
        .update(this.serviceConfig, this.editedIndex, formValues)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.alert.showSuccessMessage(this.globalMetadata.submitok ?? '');
          this.router.navigate([this.globalMetadata.submitokredirect ?? '/']);
        });
    }
  }

  /**
   * Modifies the form values as needed for custom form submission.
   * @param formValues - The form values to be modified.
   * @returns The modified form values.
   */
  modifyFormValues(formValues: Record<string, unknown>) {
    // Check the formMetadata for fields with 'replacevalue' property
    this.getIndex();
    for (const field of this.formMetadata) {
      if (field.replacevalue && field.name) {
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
    if (this.globalMetadata.deltitle ?? '') {
      this.getIndex();
    }
    this.confirmDialog
      .confirmDeletion(this.globalMetadata.deltitle ?? '', `${this.editedIndex}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (confirmed) {
          // Deletion
          this.gs
            .delete(this.serviceConfig, this.editedIndex)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.router
                .navigate([this.globalMetadata.delsubmitokredirect ?? '/'])
                .then(() => this.alert.showSuccessMessage(this.globalMetadata.delsubmitok ?? ''));
            });
        } else {
          this.alert.showInfoMessage(this.globalMetadata.delsubmitcancel ?? '');
        }
      });
  }
}
